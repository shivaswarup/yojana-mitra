import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  UserProfile, 
  Scheme, 
  AppliedSchemeRecord, 
  NotificationItem, 
  SchemeRecommendation,
  ChatbotRecommendedScheme
} from '../types';
import { SCHEMES_DATABASE } from '../data/schemes';
import { getRecommendedSchemes, evaluateSchemeEligibility } from '../utils/recommendationEngine';
import { scanCitizenSchemesWithAI, generatePersonalizedAiNote } from '../utils/aiSchemeScanner';
import { 
  calculateDaysUntilDeadline, 
  generate3DayDeadlineNotifications, 
  getSchemesExpiringWithin3Days 
} from '../utils/deadlineAlerts';
import { 
  db, 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  handleFirestoreError,
  OperationType 
} from '../firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  onSnapshot, 
  writeBatch 
} from 'firebase/firestore';

interface AppContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isOnboarding: boolean;
  activeTab: 'home' | 'profile' | 'deadlines' | 'schemes' | 'recommended' | 'applied';
  selectedScheme: Scheme | null;
  searchQuery: string;
  appliedSchemes: AppliedSchemeRecord[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  recommendedSchemes: SchemeRecommendation[];
  chatbotRecommendedSchemes: ChatbotRecommendedScheme[];
  isNotificationsOpen: boolean;
  isChatbotOpen: boolean;
  isFirebaseConnected: boolean;
  isAiScanning: boolean;
  pendingChatbotPrompt: string | null;
  isAskingStateSchemes: boolean;
  stateChatbotAnswer: { state: string; text: string; timestamp: string } | null;
  isAskingCentralSchemes: boolean;
  centralChatbotAnswer: { text: string; timestamp: string } | null;
  expiringIn3DaysSchemes: Array<{ scheme: Scheme; daysLeft: number; statusText: string }>;
  
  // Actions
  rescanSchemesWithAI: () => Promise<void>;
  askChatbotForStateSchemes: (stateName?: string) => Promise<{ reply: string; foundSchemes: Scheme[] }>;
  askChatbotForCentralSchemes: () => Promise<{ reply: string; foundSchemes: Scheme[] }>;
  openChatbotWithPrompt: (prompt: string) => void;
  setPendingChatbotPrompt: (prompt: string | null) => void;
  login: (email: string, password?: string) => boolean;
  loginWithGoogle: () => Promise<void>;
  signup: (name: string, email: string, password?: string) => void;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (profileData: UserProfile) => Promise<void>;
  setActiveTab: (tab: 'home' | 'profile' | 'deadlines' | 'schemes' | 'recommended' | 'applied') => void;
  setSelectedScheme: (scheme: Scheme | null) => void;
  setSearchQuery: (query: string) => void;
  applyForScheme: (scheme: Scheme, notes?: string, appRef?: string) => Promise<void>;
  updateApplicationStatus: (applicationId: string, status: AppliedSchemeRecord['status'], notes?: string) => Promise<void>;
  removeApplication: (applicationId: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  setIsNotificationsOpen: (open: boolean) => void;
  setIsChatbotOpen: (open: boolean) => void;
  addChatbotRecommendation: (scheme: Scheme, aiNote?: string, sourceQuery?: string) => void;
  removeChatbotRecommendation: (schemeId: string) => void;
  clearChatbotRecommendations: () => void;
  loadDemoProfile: (profileType: 'student' | 'farmer' | 'woman_entrepreneur' | 'senior_citizen') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEMO_PROFILES: Record<string, UserProfile> = {
  student: {
    id: 'user-student-1',
    email: 'shivaswarup2007@gmail.com',
    name: 'Shiva Swarup',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    age: 19,
    gender: 'male',
    dateOfBirth: '2007-04-12',
    state: 'Telangana',
    district: 'Hyderabad',
    areaType: 'Urban',
    maritalStatus: 'Single',
    highestEducation: '12th Pass (Intermediate)',
    currentEducationStatus: 'Pursuing',
    courseStream: 'B.Tech Computer Science & Engineering',
    institutionName: 'JNTU Hyderabad',
    isStudent: true,
    category: 'OBC',
    isDisability: false,
    isMinority: false,
    annualFamilyIncome: 220000,
    employmentStatus: 'Student',
    occupation: 'Engineering Undergraduate Student',
    isFarmer: false,
    isBusinessOwner: false,
    isWomanEntrepreneur: false,
    isSeniorCitizen: false,
    isBPLOrEWS: true,
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-24T07:00:00Z'
  },
  farmer: {
    id: 'user-farmer-2',
    email: 'ramesh.patel@example.com',
    name: 'Ramesh Patel',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    age: 44,
    gender: 'male',
    dateOfBirth: '1982-06-15',
    state: 'Maharashtra',
    district: 'Nashik',
    areaType: 'Rural',
    maritalStatus: 'Married',
    highestEducation: '10th Pass (Matric)',
    currentEducationStatus: 'Completed',
    isStudent: false,
    category: 'General',
    isDisability: false,
    isMinority: false,
    annualFamilyIncome: 180000,
    employmentStatus: 'Farmer',
    occupation: 'Small Landholding Farmer (Soybean & Onion)',
    isFarmer: true,
    isBusinessOwner: false,
    isWomanEntrepreneur: false,
    isSeniorCitizen: false,
    isBPLOrEWS: false,
    hasKisanCreditCard: true,
    landHoldingAcres: 3.5,
    createdAt: '2026-08-05T10:00:00Z',
    updatedAt: '2026-08-24T07:00:00Z'
  },
  woman_entrepreneur: {
    id: 'user-woman-3',
    email: 'priya.sharma@example.com',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    age: 29,
    gender: 'female',
    dateOfBirth: '1997-03-21',
    state: 'Delhi',
    district: 'South Delhi',
    areaType: 'Urban',
    maritalStatus: 'Single',
    highestEducation: 'Undergraduate (UG)',
    currentEducationStatus: 'Completed',
    courseStream: 'B.Des Fashion & Textiles',
    isStudent: false,
    category: 'EWS',
    isDisability: false,
    isMinority: false,
    annualFamilyIncome: 320000,
    employmentStatus: 'Self-Employed / Business',
    occupation: 'Handloom & Eco-Textile Boutique Founder',
    isFarmer: false,
    isBusinessOwner: true,
    isWomanEntrepreneur: true,
    isSeniorCitizen: false,
    isBPLOrEWS: true,
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-08-24T07:00:00Z'
  },
  senior_citizen: {
    id: 'user-senior-4',
    email: 'kailash.gupta@example.com',
    name: 'Kailash Nath Gupta',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    age: 72,
    gender: 'male',
    dateOfBirth: '1954-09-08',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    areaType: 'Urban',
    maritalStatus: 'Married',
    highestEducation: '12th Pass (Intermediate)',
    currentEducationStatus: 'Completed',
    isStudent: false,
    category: 'General',
    isDisability: false,
    isMinority: false,
    annualFamilyIncome: 140000,
    employmentStatus: 'Retired / Senior Citizen',
    occupation: 'Retired Unorganized Sector Artisan',
    isFarmer: false,
    isBusinessOwner: false,
    isWomanEntrepreneur: false,
    isSeniorCitizen: true,
    isBPLOrEWS: true,
    createdAt: '2026-08-12T10:00:00Z',
    updatedAt: '2026-08-24T07:00:00Z'
  }
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-student-1',
    title: 'Upcoming Application Deadline',
    message: 'PM YASASVI Scholarship application deadline is approaching on 20 October 2026.',
    type: 'deadline',
    schemeId: 'pm-yasasvi-scholarship',
    createdAt: '2026-08-24T06:00:00Z',
    read: false
  },
  {
    id: 'notif-2',
    userId: 'user-student-1',
    title: '3 New Schemes Matching Your Profile',
    message: 'Central Sector Scholarship, AICTE Pragati, and NMMSS match your current education and category criteria.',
    type: 'new_scheme',
    schemeId: 'central-sector-scheme-university-college',
    createdAt: '2026-08-23T14:30:00Z',
    read: false
  },
  {
    id: 'notif-3',
    userId: 'user-student-1',
    title: 'Ayushman Bharat Universal Coverage Expanded',
    message: 'All senior citizens aged 70+ now receive free ₹5 Lakhs healthcare coverage under PM-JAY.',
    type: 'eligibility',
    schemeId: 'ayushman-bharat-pmjay',
    createdAt: '2026-08-22T09:15:00Z',
    read: true
  }
];

const INITIAL_APPLIED: AppliedSchemeRecord[] = [
  {
    id: 'app-1',
    userId: 'user-student-1',
    schemeId: 'central-sector-scheme-university-college',
    schemeName: 'Central Sector Scheme of Scholarships for College and University Students',
    schemeCategory: 'Scholarships',
    appliedDate: '2026-08-15',
    deadline: '15 November 2026',
    officialWebsite: 'https://scholarships.gov.in',
    status: 'Under Review',
    notes: 'Submitted verification form to college registrar desk for institutional biometric sign-off.',
    applicationReferenceNumber: 'NSP/CSSS/2026/98231',
    updatedAt: '2026-08-18'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('ym_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEMO_PROFILES.student;
  });

  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'deadlines' | 'schemes' | 'recommended' | 'applied'>('home');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [isAiScanning, setIsAiScanning] = useState<boolean>(false);
  const [pendingChatbotPrompt, setPendingChatbotPrompt] = useState<string | null>(null);
  const [isAskingStateSchemes, setIsAskingStateSchemes] = useState<boolean>(false);
  const [stateChatbotAnswer, setStateChatbotAnswer] = useState<{ state: string; text: string; timestamp: string } | null>(null);
  const [isAskingCentralSchemes, setIsAskingCentralSchemes] = useState<boolean>(false);
  const [centralChatbotAnswer, setCentralChatbotAnswer] = useState<{ text: string; timestamp: string } | null>(null);

  const [chatbotRecommendedSchemes, setChatbotRecommendedSchemes] = useState<ChatbotRecommendedScheme[]>(() => {
    const defaultProfile = DEMO_PROFILES.student;
    const saved = localStorage.getItem('ym_chatbot_recommended_schemes');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved) as ChatbotRecommendedScheme[];
        // Filter out any cached recommendations that do not match the current profile
        const filtered = parsed.filter(item => {
          const evalRes = evaluateSchemeEligibility(item.scheme, defaultProfile);
          return evalRes.unmetCriteria.length === 0 && evalRes.matchScore >= 75;
        });
        if (filtered.length > 0) return filtered;
      } catch (e) {}
    }
    // Generate verified initial AI recommendations for all matching schemes based strictly on the citizen profile
    const initialRecs = getRecommendedSchemes(SCHEMES_DATABASE, defaultProfile);
    return initialRecs.map(r => ({
      scheme: r.scheme,
      recommendedAt: new Date().toISOString(),
      aiNote: generatePersonalizedAiNote(r.scheme, defaultProfile),
      sourceQuery: `AI Profile Auto-Scan (${defaultProfile.occupation}, ${defaultProfile.state})`
    }));
  });

  const [appliedSchemes, setAppliedSchemes] = useState<AppliedSchemeRecord[]>(() => {
    const saved = localStorage.getItem('ym_applied_schemes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_APPLIED;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('ym_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Track active firestore listeners
  const unsubProfileRef = useRef<(() => void) | null>(null);
  const unsubAppsRef = useRef<(() => void) | null>(null);
  const unsubNotifsRef = useRef<(() => void) | null>(null);

  // Sync to local storage for quick cache fallback
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ym_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ym_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ym_applied_schemes', JSON.stringify(appliedSchemes));
  }, [appliedSchemes]);

  useEffect(() => {
    localStorage.setItem('ym_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ym_chatbot_recommended_schemes', JSON.stringify(chatbotRecommendedSchemes));
  }, [chatbotRecommendedSchemes]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      // Clean up previous listeners
      if (unsubProfileRef.current) { unsubProfileRef.current(); unsubProfileRef.current = null; }
      if (unsubAppsRef.current) { unsubAppsRef.current(); unsubAppsRef.current = null; }
      if (unsubNotifsRef.current) { unsubNotifsRef.current(); unsubNotifsRef.current = null; }

      if (user) {
        setIsFirebaseConnected(true);
        const userDocRef = doc(db, 'users', user.uid);
        
        // Listen to User Profile Document
        unsubProfileRef.current = onSnapshot(
          userDocRef,
          async (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data() as UserProfile;
              setCurrentUser(data);
            } else {
              // Create initial profile in Firestore for new Google user
              const newProfile: UserProfile = {
                id: user.uid,
                email: user.email || 'citizen@example.com',
                name: user.displayName || 'Citizen',
                avatar: user.photoURL || undefined,
                age: 21,
                gender: 'male',
                state: 'Telangana',
                district: 'Hyderabad',
                areaType: 'Urban',
                maritalStatus: 'Single',
                highestEducation: 'Undergraduate (UG)',
                currentEducationStatus: 'Pursuing',
                isStudent: true,
                category: 'OBC',
                isDisability: false,
                isMinority: false,
                annualFamilyIncome: 250000,
                employmentStatus: 'Student',
                occupation: 'Student',
                isFarmer: false,
                isBusinessOwner: false,
                isWomanEntrepreneur: false,
                isSeniorCitizen: false,
                isBPLOrEWS: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              
              try {
                await setDoc(userDocRef, newProfile);
                setCurrentUser(newProfile);
                setIsOnboarding(true);
              } catch (err) {
                handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
              }
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
          }
        );

        // Listen to Applied Schemes Subcollection
        const appsCollRef = collection(db, 'users', user.uid, 'appliedSchemes');
        unsubAppsRef.current = onSnapshot(
          appsCollRef,
          (snapshot) => {
            const items: AppliedSchemeRecord[] = [];
            snapshot.forEach(docSnap => {
              items.push(docSnap.data() as AppliedSchemeRecord);
            });
            setAppliedSchemes(items);
          },
          (error) => {
            handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/appliedSchemes`);
          }
        );

        // Listen to Notifications Subcollection
        const notifsCollRef = collection(db, 'users', user.uid, 'notifications');
        unsubNotifsRef.current = onSnapshot(
          notifsCollRef,
          (snapshot) => {
            const items: NotificationItem[] = [];
            snapshot.forEach(docSnap => {
              items.push(docSnap.data() as NotificationItem);
            });
            setNotifications(items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          },
          (error) => {
            handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/notifications`);
          }
        );
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubProfileRef.current) unsubProfileRef.current();
      if (unsubAppsRef.current) unsubAppsRef.current();
      if (unsubNotifsRef.current) unsubNotifsRef.current();
    };
  }, []);

  // Compute recommendations dynamically
  const recommendedSchemes = currentUser
    ? getRecommendedSchemes(SCHEMES_DATABASE, currentUser)
    : [];

  // Compute 3-day expiring schemes for current user
  const expiringIn3DaysSchemes = React.useMemo(() => {
    return getSchemesExpiringWithin3Days(SCHEMES_DATABASE, currentUser);
  }, [currentUser]);

  // Automated 3-day deadline notification checker
  useEffect(() => {
    if (!currentUser) return;
    const newAlerts = generate3DayDeadlineNotifications(SCHEMES_DATABASE, notifications, currentUser);
    if (newAlerts.length > 0) {
      setNotifications(prev => [...newAlerts, ...prev]);
      if (auth.currentUser) {
        newAlerts.forEach(async (notif) => {
          try {
            await setDoc(doc(db, 'users', auth.currentUser!.uid, 'notifications', notif.id), notif);
          } catch (e) {
            console.error('Error persisting deadline alert to Firestore:', e);
          }
        });
      }
    }
  }, [currentUser, notifications]);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsOnboarding(false);
    } catch (err: unknown) {
      console.error('Google Sign-In failed', err);
      throw err;
    }
  };

  const login = (email: string, password?: string) => {
    // Check if matches known demo profile
    const existing = Object.values(DEMO_PROFILES).find(p => p.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      setIsOnboarding(false);
      return true;
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      age: 20,
      gender: 'male',
      state: 'All India',
      district: '',
      areaType: 'Urban',
      maritalStatus: 'Single',
      highestEducation: '12th Pass (Intermediate)',
      currentEducationStatus: 'Pursuing',
      isStudent: true,
      category: 'General',
      isDisability: false,
      isMinority: false,
      annualFamilyIncome: 300000,
      employmentStatus: 'Student',
      occupation: 'Student',
      isFarmer: false,
      isBusinessOwner: false,
      isWomanEntrepreneur: false,
      isSeniorCitizen: false,
      isBPLOrEWS: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCurrentUser(newUser);
    setIsOnboarding(false);
    return true;
  };

  const signup = (name: string, email: string, password?: string) => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      name: name || 'Citizen',
      age: 21,
      gender: 'male',
      state: 'Telangana',
      district: 'Hyderabad',
      areaType: 'Urban',
      maritalStatus: 'Single',
      highestEducation: 'Undergraduate (UG)',
      currentEducationStatus: 'Pursuing',
      isStudent: true,
      category: 'OBC',
      isDisability: false,
      isMinority: false,
      annualFamilyIncome: 250000,
      employmentStatus: 'Student',
      occupation: 'Student',
      isFarmer: false,
      isBusinessOwner: false,
      isWomanEntrepreneur: false,
      isSeniorCitizen: false,
      isBPLOrEWS: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCurrentUser(newUser);
    setIsOnboarding(true);
  };

  const logout = async () => {
    if (auth.currentUser) {
      await signOut(auth);
    }
    setCurrentUser(null);
    setIsOnboarding(false);
    setActiveTab('home');
    setSelectedScheme(null);
  };

  const updateProfile = async (profileUpdate: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      ...profileUpdate,
      updatedAt: new Date().toISOString()
    };
    setCurrentUser(updated);

    // Automatically search & display ALL matching schemes for the updated profile
    setIsAiScanning(true);
    scanCitizenSchemesWithAI(updated, SCHEMES_DATABASE)
      .then(scanned => {
        if (scanned && scanned.length > 0) {
          setChatbotRecommendedSchemes(scanned);
        }
      })
      .catch(err => console.error('AI Scan error on profile update:', err))
      .finally(() => setIsAiScanning(false));

    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      try {
        await setDoc(userDocRef, updated, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
      }
    }

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: updated.id,
      title: 'Profile Updated',
      message: 'Your recommendations have been refreshed based on your new profile criteria.',
      type: 'eligibility',
      createdAt: new Date().toISOString(),
      read: false
    };

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'users', auth.currentUser.uid, 'notifications', newNotif.id), newNotif);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${auth.currentUser.uid}/notifications/${newNotif.id}`);
      }
    } else {
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const completeOnboarding = async (profileData: UserProfile) => {
    setCurrentUser(profileData);
    setIsOnboarding(false);
    setActiveTab('home');

    // Automatically search & display ALL matching schemes for the completed profile
    setIsAiScanning(true);
    scanCitizenSchemesWithAI(profileData, SCHEMES_DATABASE)
      .then(scanned => {
        if (scanned && scanned.length > 0) {
          setChatbotRecommendedSchemes(scanned);
        }
      })
      .catch(err => console.error('AI Scan error on onboarding:', err))
      .finally(() => setIsAiScanning(false));

    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      try {
        await setDoc(userDocRef, profileData);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${auth.currentUser.uid}`);
      }
    }

    const welcomeNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: profileData.id,
      title: 'Welcome to Yojana Mitra!',
      message: 'We have computed your personalized scheme and scholarship recommendations.',
      type: 'new_scheme',
      createdAt: new Date().toISOString(),
      read: false
    };

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'users', auth.currentUser.uid, 'notifications', welcomeNotif.id), welcomeNotif);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${auth.currentUser.uid}/notifications/${welcomeNotif.id}`);
      }
    } else {
      setNotifications(prev => [welcomeNotif, ...prev]);
    }
  };

  const applyForScheme = async (scheme: Scheme, notes?: string, appRef?: string) => {
    if (!currentUser) return;
    const existingIndex = appliedSchemes.findIndex(a => a.schemeId === scheme.id);
    let recordToSave: AppliedSchemeRecord;
    
    if (existingIndex >= 0) {
      recordToSave = {
        ...appliedSchemes[existingIndex],
        status: 'Applied',
        notes: notes || appliedSchemes[existingIndex].notes,
        applicationReferenceNumber: appRef || appliedSchemes[existingIndex].applicationReferenceNumber,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      const updated = [...appliedSchemes];
      updated[existingIndex] = recordToSave;
      setAppliedSchemes(updated);
    } else {
      recordToSave = {
        id: `app-${Date.now()}`,
        userId: currentUser.id,
        schemeId: scheme.id,
        schemeName: scheme.name,
        schemeCategory: scheme.category,
        appliedDate: new Date().toISOString().split('T')[0],
        deadline: scheme.deadline,
        officialWebsite: scheme.officialWebsite,
        status: 'Applied',
        notes: notes || 'Applied via official portal.',
        applicationReferenceNumber: appRef || `YM-${Math.floor(100000 + Math.random() * 900000)}`,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setAppliedSchemes(prev => [recordToSave, ...prev]);
    }

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'users', auth.currentUser.uid, 'appliedSchemes', recordToSave.id), recordToSave);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${auth.currentUser.uid}/appliedSchemes/${recordToSave.id}`);
      }
    }

    const appliedNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Application Tracked',
      message: `Marked "${scheme.name}" as Applied. You can monitor status in Applied Schemes.`,
      type: 'status_update',
      schemeId: scheme.id,
      createdAt: new Date().toISOString(),
      read: false
    };

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'users', auth.currentUser.uid, 'notifications', appliedNotif.id), appliedNotif);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${auth.currentUser.uid}/notifications/${appliedNotif.id}`);
      }
    } else {
      setNotifications(prev => [appliedNotif, ...prev]);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: AppliedSchemeRecord['status'], notes?: string) => {
    const target = appliedSchemes.find(a => a.id === applicationId);
    if (!target) return;

    const updatedItem = {
      ...target,
      status,
      notes: notes !== undefined ? notes : target.notes,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setAppliedSchemes(prev => prev.map(item => item.id === applicationId ? updatedItem : item));

    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid, 'appliedSchemes', applicationId), {
          status,
          notes: updatedItem.notes,
          updatedAt: updatedItem.updatedAt
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${auth.currentUser.uid}/appliedSchemes/${applicationId}`);
      }
    }
  };

  const removeApplication = async (applicationId: string) => {
    setAppliedSchemes(prev => prev.filter(a => a.id !== applicationId));

    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'appliedSchemes', applicationId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${auth.currentUser.uid}/appliedSchemes/${applicationId}`);
      }
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));

    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid, 'notifications', notificationId), {
          read: true
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${auth.currentUser.uid}/notifications/${notificationId}`);
      }
    }
  };

  const markAllNotificationsAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    if (auth.currentUser) {
      try {
        const batch = writeBatch(db);
        notifications.filter(n => !n.read).forEach(n => {
          batch.update(doc(db, 'users', auth.currentUser!.uid, 'notifications', n.id), { read: true });
        });
        await batch.commit();
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${auth.currentUser.uid}/notifications`);
      }
    }
  };

  const addChatbotRecommendation = (scheme: Scheme, aiNote?: string, sourceQuery?: string) => {
    // STRICT PROFILE CHECK: Do not add recommendation if it fails user's profile eligibility
    if (currentUser) {
      const evalRes = evaluateSchemeEligibility(scheme, currentUser);
      if (evalRes.unmetCriteria.length > 0 || evalRes.matchScore < 75) {
        return; // Scheme does not match user's profile
      }
    }

    setChatbotRecommendedSchemes(prev => {
      // Avoid duplicate recommendations
      const exists = prev.some(item => item.scheme.id === scheme.id);
      if (exists) {
        return prev.map(item => item.scheme.id === scheme.id ? {
          ...item,
          recommendedAt: new Date().toISOString(),
          aiNote: aiNote || item.aiNote,
          sourceQuery: sourceQuery || item.sourceQuery
        } : item);
      }
      return [
        {
          scheme,
          recommendedAt: new Date().toISOString(),
          aiNote: aiNote || 'Recommended by Yojana Mitra AI during conversation.',
          sourceQuery
        },
        ...prev
      ];
    });
  };

  const removeChatbotRecommendation = (schemeId: string) => {
    setChatbotRecommendedSchemes(prev => prev.filter(item => item.scheme.id !== schemeId));
  };

  const clearChatbotRecommendations = () => {
    setChatbotRecommendedSchemes([]);
  };

  const loadDemoProfile = (profileType: 'student' | 'farmer' | 'woman_entrepreneur' | 'senior_citizen') => {
    const profile = DEMO_PROFILES[profileType];
    if (profile) {
      setCurrentUser(profile);
      setIsOnboarding(false);
      setActiveTab('home');
      setSelectedScheme(null);

      // Re-align chatbot recommendations to include ALL schemes strictly matching the new profile
      setIsAiScanning(true);
      scanCitizenSchemesWithAI(profile, SCHEMES_DATABASE)
        .then(scanned => {
          if (scanned && scanned.length > 0) {
            setChatbotRecommendedSchemes(scanned);
          }
        })
        .catch(err => console.error('AI Scan error on demo switch:', err))
        .finally(() => setIsAiScanning(false));
    }
  };

  const rescanSchemesWithAI = async () => {
    if (!currentUser) return;
    setIsAiScanning(true);
    try {
      const scanned = await scanCitizenSchemesWithAI(currentUser, SCHEMES_DATABASE);
      if (scanned && scanned.length > 0) {
        setChatbotRecommendedSchemes(scanned);
      }
    } catch (err) {
      console.error('Error during manual AI rescan:', err);
    } finally {
      setIsAiScanning(false);
    }
  };

  const openChatbotWithPrompt = (prompt: string) => {
    setPendingChatbotPrompt(prompt);
    setIsChatbotOpen(true);
  };

  const askChatbotForStateSchemes = async (stateName?: string): Promise<{ reply: string; foundSchemes: Scheme[] }> => {
    if (!currentUser) return { reply: '', foundSchemes: [] };
    const targetState = stateName || currentUser.state || 'Telangana';
    setIsAskingStateSchemes(true);

    const promptMessage = `Identify and verify all active state government schemes, welfare programs, and scholarships specifically enacted by the Government of ${targetState} that I am eligible for.
My Profile Context:
- State of Residence: ${targetState}
- Age: ${currentUser.age} (${currentUser.gender})
- Marital Status: ${currentUser.maritalStatus || 'Single'}
- Social Category: ${currentUser.category}
- Occupation / Status: ${currentUser.occupation || currentUser.employmentStatus || 'Citizen'}
- Annual Family Income: ₹${currentUser.annualFamilyIncome}
- Highest Education: ${currentUser.highestEducation} (${currentUser.currentEducationStatus})
- Special Entitlements: Student=${currentUser.isStudent}, Farmer=${currentUser.isFarmer}, Woman Entrepreneur=${currentUser.isWomanEntrepreneur}`;

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptMessage,
          history: [],
          userProfile: currentUser
        })
      });

      const data = await res.json();
      const reply = data.reply || `Verified active government schemes for residents of ${targetState}.`;

      setStateChatbotAnswer({
        state: targetState,
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      // Find all state-related schemes and scholarships for this state without leaving anything
      const stateSchemes = SCHEMES_DATABASE.filter(s => {
        const isThisState = s.state.toLowerCase() === targetState.toLowerCase() || 
          (s.eligibilityRules?.states?.some(st => st.toLowerCase() === targetState.toLowerCase()) ?? false);
        return isThisState;
      });

      // Sort by eligibility match so fully eligible ones appear at top, leaving nothing out
      const matchingStateSchemes = [...stateSchemes].sort((a, b) => {
        const evalA = evaluateSchemeEligibility(a, currentUser);
        const evalB = evaluateSchemeEligibility(b, currentUser);
        return evalB.matchScore - evalA.matchScore;
      });

      // Add each matching state scheme to chatbot recommendations
      matchingStateSchemes.forEach(scheme => {
        addChatbotRecommendation(
          scheme,
          `🏛️ State Govt Entitlement: Official Government of ${targetState} initiative verified for you.`,
          `Chatbot State Query (${targetState})`
        );
      });

      return { reply, foundSchemes: matchingStateSchemes };
    } catch (err) {
      console.error('Error querying chatbot for state schemes:', err);
      return { reply: '', foundSchemes: [] };
    } finally {
      setIsAskingStateSchemes(false);
    }
  };

  const askChatbotForCentralSchemes = async (): Promise<{ reply: string; foundSchemes: Scheme[] }> => {
    if (!currentUser) return { reply: '', foundSchemes: [] };
    setIsAskingCentralSchemes(true);

    const promptMessage = `Identify and verify all active Central Government schemes, national flagship welfare programs, and Central Sector / Centrally Sponsored scholarships that I am eligible for as an Indian citizen.
My Profile Context:
- Citizen Name: ${currentUser.name}
- Age: ${currentUser.age} (${currentUser.gender})
- Marital Status: ${currentUser.maritalStatus || 'Single'}
- Social Category: ${currentUser.category}
- Occupation / Status: ${currentUser.occupation || currentUser.employmentStatus || 'Citizen'}
- Annual Family Income: ₹${currentUser.annualFamilyIncome}
- Highest Education: ${currentUser.highestEducation} (${currentUser.currentEducationStatus})
- Special Entitlements: Student=${currentUser.isStudent}, Farmer=${currentUser.isFarmer}, Woman Entrepreneur=${currentUser.isWomanEntrepreneur}, Senior Citizen=${currentUser.isSeniorCitizen}`;

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptMessage,
          history: [],
          userProfile: currentUser
        })
      });

      const data = await res.json();
      const reply = data.reply || `Verified active Central Government schemes and national scholarships matching your credentials.`;

      setCentralChatbotAnswer({
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      // Filter all central schemes that the user is strictly eligible for
      const matchingCentralSchemes = SCHEMES_DATABASE.filter(s => {
        const isCentral = s.governmentLevel === 'Central' || s.governmentLevel === 'All India';
        if (!isCentral) return false;
        const evalRes = evaluateSchemeEligibility(s, currentUser);
        return evalRes.unmetCriteria.length === 0 && evalRes.matchScore >= 60;
      });

      // Add each matching central scheme to chatbot recommendations
      matchingCentralSchemes.forEach(scheme => {
        addChatbotRecommendation(
          scheme,
          `🇮🇳 Central Govt Entitlement: Verified by Yojana Mitra AI for your profile credentials.`,
          `Chatbot Central Query`
        );
      });

      return { reply, foundSchemes: matchingCentralSchemes };
    } catch (err) {
      console.error('Error querying chatbot for central schemes:', err);
      return { reply: '', foundSchemes: [] };
    } finally {
      setIsAskingCentralSchemes(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isOnboarding,
        activeTab,
        selectedScheme,
        searchQuery,
        appliedSchemes,
        notifications,
        unreadNotificationCount,
        recommendedSchemes,
        chatbotRecommendedSchemes,
        isNotificationsOpen,
        isChatbotOpen,
        isFirebaseConnected,
        isAiScanning,
        pendingChatbotPrompt,
        isAskingStateSchemes,
        stateChatbotAnswer,
        isAskingCentralSchemes,
        centralChatbotAnswer,
        expiringIn3DaysSchemes,
        rescanSchemesWithAI,
        askChatbotForStateSchemes,
        askChatbotForCentralSchemes,
        openChatbotWithPrompt,
        setPendingChatbotPrompt,
        login,
        loginWithGoogle,
        signup,
        logout,
        updateProfile,
        completeOnboarding,
        setActiveTab,
        setSelectedScheme,
        setSearchQuery,
        applyForScheme,
        updateApplicationStatus,
        removeApplication,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        setIsNotificationsOpen,
        setIsChatbotOpen,
        addChatbotRecommendation,
        removeChatbotRecommendation,
        clearChatbotRecommendations,
        loadDemoProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
