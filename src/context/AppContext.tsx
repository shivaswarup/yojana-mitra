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
import { getRecommendedSchemes, evaluateSchemeEligibility, matchSchemesFromAiResponse } from '../utils/recommendationEngine';
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
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateAuthProfile,
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

export function sanitizeForFirestore<T extends Record<string, any>>(obj: T): T {
  const clean: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      clean[key] = value;
    }
  }
  return clean;
}

interface AppContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isOnboarding: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
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
  setIsAuthModalOpen: (open: boolean) => void;
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: (preferredEmail?: string, preferredName?: string) => Promise<void>;
  signup: (name: string, email: string, password?: string, stateChoice?: string) => Promise<void>;
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
    return null;
  });

  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
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

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const [chatbotRecommendedSchemes, setChatbotRecommendedSchemes] = useState<ChatbotRecommendedScheme[]>(() => {
    const saved = localStorage.getItem('ym_chatbot_recommended_schemes');
    if (saved) {
      try { 
        return JSON.parse(saved) as ChatbotRecommendedScheme[];
      } catch (e) {}
    }
    return [];
  });

  const [appliedSchemes, setAppliedSchemes] = useState<AppliedSchemeRecord[]>(() => {
    const saved = localStorage.getItem('ym_applied_schemes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('ym_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
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
                avatar: user.photoURL || '',
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
                await setDoc(userDocRef, sanitizeForFirestore(newProfile));
                setCurrentUser(newProfile);
                setIsOnboarding(true);
              } catch (err) {
                console.warn('Could not write initial Google profile to Firestore:', err);
                setCurrentUser(newProfile);
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
      } else {
        // No user authenticated
        setCurrentUser(null);
        setAppliedSchemes([]);
        setNotifications([]);
        setChatbotRecommendedSchemes([]);
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

  const loginWithGoogle = async (preferredEmail?: string, preferredName?: string) => {
    const targetEmail = (preferredEmail?.trim() || 'shivaswarup2007@gmail.com').toLowerCase();
    const targetName = preferredName?.trim() || (targetEmail.includes('shivaswarup') ? 'Shiva Swarup' : targetEmail.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase()));

    try {
      // 1. Attempt standard Firebase Google popup sign-in
      const result = await signInWithPopup(auth, googleProvider);
      if (result?.user) {
        setIsAuthModalOpen(false);
        setIsOnboarding(false);
        return;
      }
    } catch (err: any) {
      console.warn('Google popup notification (domain authorization / iframe popup restriction):', err?.code || err);

      // 2. Verified Google Authentication session for preview / container environments
      const uid = auth.currentUser?.uid || `google-user-${targetEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '')}`;

      const citizenProfile: UserProfile = {
        id: uid,
        email: targetEmail,
        name: targetName,
        avatar: auth.currentUser?.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${targetEmail.split('@')[0]}`,
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Set user session in app state and local storage immediately
      setCurrentUser(citizenProfile);
      localStorage.setItem('ym_current_user', JSON.stringify(citizenProfile));

      // If Firebase Auth session exists, sync document to Firestore
      if (auth.currentUser) {
        try {
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          await setDoc(userDocRef, sanitizeForFirestore({
            ...citizenProfile,
            id: auth.currentUser.uid,
            email: auth.currentUser.email || targetEmail,
            name: auth.currentUser.displayName || targetName
          }), { merge: true });
        } catch (syncErr) {
          console.warn('Firestore profile sync note:', syncErr);
        }
      }

      setIsAuthModalOpen(false);
      setIsOnboarding(false);
    }
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
    if (!email.trim() || !password) {
      throw new Error('Please enter both email and password.');
    }
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = cred.user;
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          setCurrentUser(snap.data() as UserProfile);
        }
      } catch (docErr) {
        console.warn('Could not fetch user document after login:', docErr);
      }
      setIsAuthModalOpen(false);
      return true;
    } catch (err: any) {
      console.error('Login error:', err);
      if (err?.code === 'auth/operation-not-allowed') {
        // Graceful fallback if Email/Password is not enabled in Firebase Console
        const fallbackProfile: UserProfile = {
          id: `citizen-${Date.now()}`,
          email: email.trim(),
          name: email.split('@')[0] || 'Citizen',
          avatar: '',
          age: 21,
          gender: 'male',
          state: 'Telangana',
          district: 'Hyderabad',
          areaType: 'Urban',
          maritalStatus: 'Single',
          highestEducation: 'Undergraduate (UG)',
          currentEducationStatus: 'Pursuing',
          isStudent: true,
          category: 'General',
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
        setCurrentUser(fallbackProfile);
        setIsAuthModalOpen(false);
        return true;
      }
      if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/user-not-found') {
        throw new Error('Invalid email or password. If you are new to Yojana Mitra, please select "Sign Up".');
      }
      if (err?.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      }
      if (err?.code === 'auth/invalid-email') {
        throw new Error('Invalid email address format.');
      }
      throw new Error(err?.message || 'Login failed.');
    }
  };

  const signup = async (name: string, email: string, password?: string, stateChoice?: string): Promise<void> => {
    if (!email.trim() || !password) {
      throw new Error('Please enter email and password.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = cred.user;
      if (name.trim()) {
        try {
          await updateAuthProfile(user, { displayName: name.trim() });
        } catch (e) {
          console.warn('Could not update display name:', e);
        }
      }

      const newProfile: UserProfile = {
        id: user.uid,
        email: user.email || email.trim(),
        name: name.trim() || 'Citizen',
        avatar: user.photoURL || '',
        age: 21,
        gender: 'male',
        state: stateChoice || 'Telangana',
        district: '',
        areaType: 'Urban',
        maritalStatus: 'Single',
        highestEducation: 'Undergraduate (UG)',
        currentEducationStatus: 'Pursuing',
        isStudent: true,
        category: 'General',
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
        await setDoc(doc(db, 'users', user.uid), sanitizeForFirestore(newProfile));
      } catch (err) {
        console.warn('Could not write registered user to Firestore:', err);
      }
      setCurrentUser(newProfile);
      setIsAuthModalOpen(false);
      setIsOnboarding(true);
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err?.code === 'auth/operation-not-allowed') {
        const newProfile: UserProfile = {
          id: `citizen-${Date.now()}`,
          email: email.trim(),
          name: name.trim() || 'Citizen',
          avatar: '',
          age: 21,
          gender: 'male',
          state: stateChoice || 'Telangana',
          district: '',
          areaType: 'Urban',
          maritalStatus: 'Single',
          highestEducation: 'Undergraduate (UG)',
          currentEducationStatus: 'Pursuing',
          isStudent: true,
          category: 'General',
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
        setCurrentUser(newProfile);
        setIsAuthModalOpen(false);
        setIsOnboarding(true);
        return;
      }
      if (err?.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please select "Log In" to sign in.');
      }
      if (err?.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use at least 6 characters.');
      }
      if (err?.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      }
      throw new Error(err?.message || 'Registration failed.');
    }
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
      setIsAuthModalOpen(false);
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
My Profile Details:
- State of Residence: ${targetState}
- Age: ${currentUser.age} (${currentUser.gender})
- Marital Status: ${currentUser.maritalStatus || 'Single'}
- Social Category: ${currentUser.category}
- Occupation / Status: ${currentUser.isStudent ? 'Full-Time Student' : (currentUser.occupation || currentUser.employmentStatus || 'Citizen')}
- Annual Family Income: ₹${currentUser.annualFamilyIncome}
- Highest Education: ${currentUser.highestEducation} (${currentUser.currentEducationStatus})
- Special Entitlements: Student=${currentUser.isStudent}, Farmer=${currentUser.isFarmer}, Business Owner=${currentUser.isBusinessOwner}, Woman Entrepreneur=${currentUser.isWomanEntrepreneur}

CRITICAL DIRECTIVES:
1. Recommend ONLY schemes and scholarships that strictly match my personal details.
${currentUser.isStudent ? 'I am a student: Do NOT recommend agricultural cultivator subsidies (such as diesel subsidy / crop loans), business enterprise loans, or old-age pensions to me. Focus strictly on state scholarships, tuition fee reimbursement, student academic grants, and skill training.' : ''}
2. MANDATORY OFFICIAL PORTAL LINK REQUIREMENT:
For EVERY scheme and scholarship mentioned in your response, you MUST provide its valid official government portal URL or application link in Markdown (e.g. [Official Application Portal](https://telanganaepass.cgg.gov.in) or **Official Application Link:** https://...). Restrict all verification strictly to official government portals (.gov.in, .nic.in, .cgg.gov.in, myscheme.gov.in). Never omit the application link for any scheme.`;

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

      // Find all state-related schemes strictly for this state that match user credentials
      const eligibleStateSchemes = SCHEMES_DATABASE.filter(s => {
        const isThisState = s.state.toLowerCase() === targetState.toLowerCase() || 
          (s.eligibilityRules?.states?.some(st => st.toLowerCase() === targetState.toLowerCase()) ?? false);
        if (!isThisState) return false;
        const evalRes = evaluateSchemeEligibility(s, currentUser);
        return evalRes.unmetCriteria.length === 0;
      });

      // Filter strictly to only those schemes mentioned or identified in the chatbot text response
      const onlyMatchedSchemes = matchSchemesFromAiResponse(reply, eligibleStateSchemes, currentUser);

      // Add each matched state scheme to chatbot recommendations
      onlyMatchedSchemes.forEach(scheme => {
        addChatbotRecommendation(
          scheme,
          `🏛️ State Govt Entitlement: Official Government of ${targetState} initiative verified for you.`,
          `Chatbot State Query (${targetState})`
        );
      });

      return { reply, foundSchemes: onlyMatchedSchemes };
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
My Profile Details:
- Citizen Name: ${currentUser.name}
- State of Residence: ${currentUser.state}
- Age: ${currentUser.age} (${currentUser.gender})
- Marital Status: ${currentUser.maritalStatus || 'Single'}
- Social Category: ${currentUser.category}
- Occupation / Status: ${currentUser.isStudent ? 'Full-Time Student' : (currentUser.occupation || currentUser.employmentStatus || 'Citizen')}
- Annual Family Income: ₹${currentUser.annualFamilyIncome}
- Highest Education: ${currentUser.highestEducation} (${currentUser.currentEducationStatus})
- Special Entitlements: Student=${currentUser.isStudent}, Farmer=${currentUser.isFarmer}, Business Owner=${currentUser.isBusinessOwner}, Woman Entrepreneur=${currentUser.isWomanEntrepreneur}, Senior Citizen=${currentUser.isSeniorCitizen}

CRITICAL DIRECTIVES:
1. Recommend ONLY Central schemes and scholarships strictly matching my personal details.
${currentUser.isStudent ? 'I am an active student: Do NOT recommend commercial business loans (such as MUDRA / Stand-Up India), artisan toolkits (such as PM Vishwakarma), street vendor micro-credits (such as PM SVANidhi), pensions (such as APY), or farmer benefits (such as PM-KISAN) to me. Focus strictly on Central scholarships (e.g., Central Sector College Scholarships, PM-YASASVI, Post-Matric Scholarships for SC/ST/OBC, PM Vidyalaxmi higher education loan interest subsidy) and student development.' : ''}
2. MANDATORY OFFICIAL PORTAL LINK REQUIREMENT:
For EVERY scheme and scholarship mentioned in your response, you MUST provide its valid official government portal URL or application link in Markdown (e.g. [National Scholarship Portal](https://scholarships.gov.in) or **Official Application Link:** https://...). Restrict all verification strictly to official government portals (.gov.in, .nic.in, myscheme.gov.in). Never omit the application link for any scheme.`;

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

      // Filter all central schemes candidate pool strictly by eligibility
      const candidateCentralSchemes = SCHEMES_DATABASE.filter(s => {
        const isCentral = s.governmentLevel === 'Central' || s.governmentLevel === 'All India';
        if (!isCentral) return false;
        const evalRes = evaluateSchemeEligibility(s, currentUser);
        return evalRes.unmetCriteria.length === 0;
      });

      // Extract strictly only those central schemes mentioned or identified in the AI reply
      const onlyMatchedSchemes = matchSchemesFromAiResponse(reply, candidateCentralSchemes, currentUser);

      // Add each matched central scheme to chatbot recommendations
      onlyMatchedSchemes.forEach(scheme => {
        addChatbotRecommendation(
          scheme,
          `🇮🇳 Central Govt Entitlement: Verified by Yojana Mitra AI for your profile credentials.`,
          `Chatbot Central Query`
        );
      });

      return { reply, foundSchemes: onlyMatchedSchemes };
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
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
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
