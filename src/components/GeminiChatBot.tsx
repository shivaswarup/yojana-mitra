import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  RefreshCw, 
  ExternalLink,
  Minimize2, 
  Maximize2,
  ChevronDown,
  ShieldCheck,
  Building2,
  HelpCircle,
  Clock,
  FileCheck,
  GripVertical,
  Move
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCHEMES_DATABASE } from '../data/schemes';
import { Scheme, UserProfile } from '../types';
import { evaluateSchemeEligibility, getRecommendedSchemes } from '../utils/recommendationEngine';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  matchedSchemes?: Scheme[];
}

const QUICK_PROMPTS = [
  'What scholarships match my profile?',
  'What active government schemes in my state am I eligible for?',
  'What documents are needed for my application?',
  'How do I apply for state welfare schemes on the official portal?'
];

function extractMatchingSchemes(text: string, profile?: UserProfile | null): Scheme[] {
  const normalized = text.toLowerCase();
  const matched: Scheme[] = [];

  for (const scheme of SCHEMES_DATABASE) {
    const nameLower = scheme.name.toLowerCase();
    
    // Check main title tokens
    const isDirectMatch = 
      normalized.includes(nameLower) || 
      (scheme.shortDescription && normalized.includes(scheme.shortDescription.toLowerCase().slice(0, 30)));

    // Check specific known scheme acronyms & keywords
    let isAliasMatch = false;
    if (scheme.id === 'pm-yasasvi-scholarship' && (normalized.includes('yasasvi') || normalized.includes('pm-yasasvi') || normalized.includes('pm yasasvi'))) {
      isAliasMatch = true;
    } else if (scheme.id === 'central-sector-scheme-university-college' && (normalized.includes('central sector') || normalized.includes('csss') || normalized.includes('merit-cum-means'))) {
      isAliasMatch = true;
    } else if (scheme.id === 'pm-kisan-samman-nidhi' && (normalized.includes('pm-kisan') || normalized.includes('pm kisan') || normalized.includes('kisan samman'))) {
      isAliasMatch = true;
    } else if (scheme.id === 'ayushman-bharat-pmjay' && (normalized.includes('ayushman') || normalized.includes('pm-jay') || normalized.includes('pmjay') || normalized.includes('golden card'))) {
      isAliasMatch = true;
    } else if (scheme.id === 'pradhan-mantri-mudra-yojana' && (normalized.includes('mudra') || normalized.includes('shishu loan') || normalized.includes('kishore loan'))) {
      isAliasMatch = true;
    } else if (scheme.id === 'aicte-pragati-scholarship' && (normalized.includes('pragati') || normalized.includes('aicte pragati'))) {
      isAliasMatch = true;
    } else if (scheme.id === 'nmmss-national-means-merit' && (normalized.includes('nmmss') || normalized.includes('means-cum-merit') || normalized.includes('means cum merit'))) {
      isAliasMatch = true;
    } else if (scheme.id === 'pm-awas-yojana-gramin' && (normalized.includes('pmay') || normalized.includes('pm awas') || normalized.includes('awas yojana'))) {
      isAliasMatch = true;
    } else if (scheme.id === 'sukanya-samriddhi-yojana' && (normalized.includes('sukanya') || normalized.includes('ssy'))) {
      isAliasMatch = true;
    } else if (scheme.id === 'stand-up-india' && (normalized.includes('stand-up india') || normalized.includes('stand up india'))) {
      isAliasMatch = true;
    } else if (scheme.id === 'atal-pension-yojana' && (normalized.includes('atal pension') || normalized.includes('apy'))) {
      isAliasMatch = true;
    } else if (scheme.id === 'pm-svanidhi' && (normalized.includes('svanidhi') || normalized.includes('street vendor'))) {
      isAliasMatch = true;
    } else if (scheme.id === 'national-overseas-scholarship' && (normalized.includes('national overseas') || normalized.includes('overseas scholarship'))) {
      isAliasMatch = true;
    }

    // State scheme recognition for the citizen's state
    if (scheme.governmentLevel === 'State') {
      const stateName = scheme.state.toLowerCase();
      const userState = profile?.state?.toLowerCase();
      const mentionsUserOrSchemeState = normalized.includes(stateName) || (userState && normalized.includes(userState) && stateName === userState);
      const isStateQuery = normalized.includes('state') || normalized.includes('local scheme') || normalized.includes('my state');

      if (mentionsUserOrSchemeState || isStateQuery) {
        if (
          scheme.tags.some(t => normalized.includes(t.toLowerCase())) ||
          normalized.includes(scheme.slug.replace(/-/g, ' ')) ||
          (userState && stateName === userState)
        ) {
          isAliasMatch = true;
        }
      }
    }

    if (isDirectMatch || isAliasMatch) {
      // STRICT FILTER: Only include if the scheme strictly matches the citizen's profile
      if (profile) {
        const evalResult = evaluateSchemeEligibility(scheme, profile);
        if (evalResult.unmetCriteria.length > 0 || evalResult.matchScore < 75) {
          continue; // Discard schemes outside user profile
        }
      }

      if (!matched.some(m => m.id === scheme.id)) {
        matched.push(scheme);
      }
    }
  }

  return matched;
}

export const GeminiChatBot: React.FC<{ onSelectScheme?: (scheme: Scheme) => void }> = ({ onSelectScheme }) => {
  const { 
    currentUser, 
    isChatbotOpen, 
    setIsChatbotOpen, 
    setSelectedScheme: setContextSelectedScheme,
    addChatbotRecommendation,
    pendingChatbotPrompt,
    setPendingChatbotPrompt,
    openAuthModal
  } = useApp();
  
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const allMatches = currentUser ? getRecommendedSchemes(SCHEMES_DATABASE, currentUser).map(r => r.scheme) : [];
    return [
      {
        id: 'welcome',
        role: 'model',
        text: currentUser 
          ? `Namaste **${currentUser.name || 'Citizen'}**! 🙏\n\nI am **Yojana Mitra AI**, powered by Google Gemini. I have already scanned government schemes strictly according to your profile details (${currentUser.occupation || 'Citizen'}, ${currentUser.maritalStatus || 'Single'}, ${currentUser.category || 'General'}, ${currentUser.state || 'India'}${currentUser.district ? ` - ${currentUser.district}` : ''}) and automatically displayed all **${allMatches.length} eligible schemes** on your **Home Page Recommendations**!\n\nYou can ask me here about required documents, application deadlines, step-by-step registration on official portals, or appeal procedures.`
          : `Namaste Citizen! 🙏\n\nI am **Yojana Mitra AI**, official Government Scheme & Scholarship assistant. Please **Log In** or **Sign Up** to check your verified eligibility for central & state schemes!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchedSchemes: allMatches
      }
    ];
  });

  // Keep chatbot welcome message synchronized when profile details change (e.g. marital status, state)
  useEffect(() => {
    if (currentUser) {
      const allMatches = getRecommendedSchemes(SCHEMES_DATABASE, currentUser).map(r => r.scheme);
      setMessages(prev => {
        if (prev.length === 1 && prev[0].id.startsWith('welcome')) {
          return [
            {
              id: 'welcome',
              role: 'model',
              text: `Namaste **${currentUser.name || 'Citizen'}**! 🙏\n\nI am **Yojana Mitra AI**, powered by Google Gemini. I have already scanned government schemes strictly according to your profile details (${currentUser.occupation || 'Citizen'}, ${currentUser.maritalStatus || 'Single'}, ${currentUser.category || 'General'}, ${currentUser.state || 'India'}${currentUser.district ? ` - ${currentUser.district}` : ''}) and automatically displayed all **${allMatches.length} eligible schemes** on your **Home Page Recommendations**!\n\nYou do not need to ask for eligible schemes again. You can ask me here about required documents, application deadlines, step-by-step registration on official portals, or appeal procedures.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              matchedSchemes: allMatches
            }
          ];
        }
        return prev;
      });
    }
  }, [currentUser?.id, currentUser?.maritalStatus, currentUser?.occupation, currentUser?.state, currentUser?.district, currentUser?.category, currentUser?.annualFamilyIncome]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Movable Floating Launcher State ---
  const [launcherPos, setLauncherPos] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [isDraggingLauncher, setIsDraggingLauncher] = useState(false);
  const launcherDragRef = useRef<{ startX: number; startY: number; initX: number; initY: number; moved: boolean } | null>(null);
  const launcherBtnRef = useRef<HTMLButtonElement>(null);

  // --- Movable Chat Modal Window State ---
  const [modalPos, setModalPos] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const modalDragRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatbotOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatbotOpen, isMinimized]);

  // Adjust positions on window resize to ensure they stay on screen
  useEffect(() => {
    const handleResize = () => {
      setLauncherPos(prev => {
        if (prev.x === null || prev.y === null) return prev;
        const maxX = Math.max(10, window.innerWidth - 220);
        const maxY = Math.max(10, window.innerHeight - 80);
        return {
          x: Math.min(Math.max(10, prev.x), maxX),
          y: Math.min(Math.max(10, prev.y), maxY)
        };
      });

      setModalPos(prev => {
        if (prev.x === null || prev.y === null) return prev;
        const width = Math.min(420, window.innerWidth - 32);
        const height = isMinimized ? 56 : Math.min(540, window.innerHeight * 0.85);
        const maxX = Math.max(10, window.innerWidth - width - 10);
        const maxY = Math.max(10, window.innerHeight - height - 10);
        return {
          x: Math.min(Math.max(10, prev.x), maxX),
          y: Math.min(Math.max(10, prev.y), maxY)
        };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMinimized]);

  // Launcher Pointer Handlers
  const handleLauncherPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return; // only main click
    const rect = launcherBtnRef.current?.getBoundingClientRect();
    const currentX = rect ? rect.left : (launcherPos.x ?? (window.innerWidth - 200));
    const currentY = rect ? rect.top : (launcherPos.y ?? (window.innerHeight - 80));

    launcherDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: currentX,
      initY: currentY,
      moved: false
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!launcherDragRef.current) return;
      const dx = moveEvent.clientX - launcherDragRef.current.startX;
      const dy = moveEvent.clientY - launcherDragRef.current.startY;

      if (Math.hypot(dx, dy) > 5) {
        launcherDragRef.current.moved = true;
        setIsDraggingLauncher(true);

        const btnWidth = launcherBtnRef.current?.offsetWidth || 180;
        const btnHeight = launcherBtnRef.current?.offsetHeight || 50;

        const newX = Math.min(Math.max(10, launcherDragRef.current.initX + dx), window.innerWidth - btnWidth - 10);
        const newY = Math.min(Math.max(10, launcherDragRef.current.initY + dy), window.innerHeight - btnHeight - 10);

        setLauncherPos({ x: newX, y: newY });
      }
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

      if (launcherDragRef.current && !launcherDragRef.current.moved) {
        if (!currentUser) {
          openAuthModal('login');
        } else {
          setIsChatbotOpen(true);
        }
      }
      setIsDraggingLauncher(false);
      launcherDragRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Modal Header Pointer Handlers (Drag modal window)
  const handleModalHeaderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore clicks on control buttons (minimize, clear, close)
    if ((e.target as HTMLElement).closest('button')) return;
    if (e.button !== 0) return;

    const rect = modalRef.current?.getBoundingClientRect();
    const width = rect ? rect.width : Math.min(420, window.innerWidth - 32);
    const height = rect ? rect.height : 540;

    const currentX = rect ? rect.left : (modalPos.x ?? (window.innerWidth - width - 24));
    const currentY = rect ? rect.top : (modalPos.y ?? (window.innerHeight - height - 24));

    modalDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: currentX,
      initY: currentY
    };

    setIsDraggingModal(true);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!modalDragRef.current) return;
      const dx = moveEvent.clientX - modalDragRef.current.startX;
      const dy = moveEvent.clientY - modalDragRef.current.startY;

      const newWidth = modalRef.current?.offsetWidth || width;
      const newHeight = modalRef.current?.offsetHeight || height;

      const clampedX = Math.min(Math.max(10, modalDragRef.current.initX + dx), window.innerWidth - newWidth - 10);
      const clampedY = Math.min(Math.max(10, modalDragRef.current.initY + dy), window.innerHeight - newHeight - 10);

      setModalPos({ x: clampedX, y: clampedY });
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      setIsDraggingModal(false);
      modalDragRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleSchemeClick = (scheme: Scheme) => {
    if (onSelectScheme) {
      onSelectScheme(scheme);
    } else {
      setContextSelectedScheme(scheme);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage.trim();
    if (!textToSend || loading) return;

    if (!currentUser) {
      openAuthModal('login');
      return;
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setLoading(true);

    try {
      // Build conversation history for context
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role,
          text: m.text
        }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history,
          userProfile: currentUser
        })
      });

      const data = await res.json();
      const replyText = data.reply || 'No response generated from Gemini API.';

      // Extract schemes matched in the reply or query that strictly match the user's profile
      const matched = extractMatchingSchemes(textToSend + ' ' + replyText, currentUser);

      // Add each matched scheme to the AppContext Chatbot Recommendations list
      matched.forEach(scheme => {
        addChatbotRecommendation(
          scheme, 
          `Recommended during AI conversation about: "${textToSend.slice(0, 50)}${textToSend.length > 50 ? '...' : ''}"`,
          textToSend
        );
      });

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'model',
        text: replyText,
        matchedSchemes: matched,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Gemini Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          text: 'Unable to reach the AI server right now. Please verify your connection or check official government portals directly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Run pending chatbot prompt triggered from Home Page or other views
  useEffect(() => {
    if (pendingChatbotPrompt) {
      setIsChatbotOpen(true);
      setIsMinimized(false);
      const promptToRun = pendingChatbotPrompt;
      setPendingChatbotPrompt(null);
      handleSendMessage(promptToRun);
    }
  }, [pendingChatbotPrompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        text: `Conversation cleared. Namaste **${currentUser?.name || 'Citizen'}**! How can I assist you with government schemes or scholarships?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Render markdown with basic formatting, links, and code
  const formatText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Inline link & bold parser
      const renderInline = (str: string) => {
        // Match [Label](url) OR raw url https://...
        const linkRegex = /(\[([^\]]+)\]\((https?:\/\/[^\)]+)\)|https?:\/\/[^\s\)\],]+)/g;
        const segments: React.ReactNode[] = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = linkRegex.exec(str)) !== null) {
          if (match.index > lastIndex) {
            segments.push(parseBold(str.substring(lastIndex, match.index), segments.length));
          }

          const full = match[0];
          let url = full;
          let label = full;

          if (match[2] && match[3]) {
            label = match[2];
            url = match[3];
          } else {
            url = full.replace(/[\.\,\;\:\)\*\_]+$/, '');
            try {
              label = new URL(url).hostname.replace(/^www\./, '');
            } catch {
              label = url;
            }
          }

          segments.push(
            <a
              key={`link-${segments.length}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-950 underline decoration-emerald-500 hover:decoration-2 transition-all mx-0.5 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200"
            >
              <span>{label}</span>
              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
            </a>
          );
          lastIndex = linkRegex.lastIndex;
        }

        if (lastIndex < str.length) {
          segments.push(parseBold(str.substring(lastIndex), segments.length));
        }

        return segments.length > 0 ? segments : parseBold(str, 0);
      };

      const parseBold = (sub: string, keyPrefix: number) => {
        const parts = sub.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={`${keyPrefix}-${pIdx}`} className="font-bold text-stone-900">{part.slice(2, -2)}</strong>;
          }
          return part;
        });
      };

      if (line.startsWith('### ')) {
        return <h4 key={idx} className="font-bold text-stone-900 text-xs mt-2 mb-1">{renderInline(line.replace('### ', ''))}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="font-bold text-stone-900 text-sm mt-2 mb-1">{renderInline(line.replace('## ', ''))}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={idx} className="font-bold text-stone-900 text-base mt-2 mb-1">{renderInline(line.replace('# ', ''))}</h2>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-stone-700 text-xs leading-relaxed my-0.5">
            {renderInline(line.replace(/^[\-\*]\s+/, ''))}
          </li>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }

      return (
        <p key={idx} className="text-stone-700 text-xs leading-relaxed my-0.5">
          {renderInline(line)}
        </p>
      );
    });
  };

  return (
    <>
      {/* Movable Floating Launcher Button */}
      {!isChatbotOpen && (
        <button
          ref={launcherBtnRef}
          id="open-gemini-chat-btn"
          onPointerDown={handleLauncherPointerDown}
          onClick={() => {
            if (launcherDragRef.current?.moved) return;
            if (!currentUser) {
              openAuthModal('login');
            } else {
              setIsChatbotOpen(true);
            }
          }}
          style={
            launcherPos.x !== null && launcherPos.y !== null
              ? {
                  left: `${launcherPos.x}px`,
                  top: `${launcherPos.y}px`,
                  right: 'auto',
                  bottom: 'auto',
                  position: 'fixed'
                }
              : undefined
          }
          className={`fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 flex items-center gap-2.5 bg-emerald-800 hover:bg-emerald-700 text-white px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full shadow-2xl border border-emerald-700 select-none touch-none ${
            isDraggingLauncher ? 'cursor-grabbing scale-105 shadow-3xl opacity-90' : 'cursor-grab hover:scale-105'
          } transition-transform duration-75 group`}
          title="Drag to reposition or click to open Yojana Mitra AI Chat"
        >
          <div className="text-emerald-300 opacity-60 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-3.5 h-3.5" />
          </div>
          <div className="w-6 h-6 rounded-full bg-emerald-700 flex items-center justify-center text-white shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="text-left pointer-events-none">
            <div className="text-xs font-bold leading-tight">Yojana Mitra AI</div>
            <div className="text-[10px] text-emerald-200 leading-tight">Ask about schemes</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </button>
      )}

      {/* Movable Floating Chat Window */}
      {isChatbotOpen && (
        <div
          ref={modalRef}
          id="gemini-chat-modal"
          style={
            modalPos.x !== null && modalPos.y !== null
              ? {
                  left: `${modalPos.x}px`,
                  top: `${modalPos.y}px`,
                  right: 'auto',
                  bottom: 'auto',
                  position: 'fixed'
                }
              : undefined
          }
          className={`fixed right-2 sm:right-6 bottom-16 sm:bottom-6 z-50 bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden transition-[width,height] duration-200 ${
            isMinimized 
              ? 'w-72 sm:w-80 h-14' 
              : 'w-[calc(100vw-1rem)] sm:w-96 md:w-[420px] h-[520px] max-h-[80vh]'
          }`}
        >
          {/* Draggable Header */}
          <div 
            onPointerDown={handleModalHeaderPointerDown}
            className={`p-3 bg-emerald-800 text-white flex items-center justify-between select-none touch-none ${
              isDraggingModal ? 'cursor-grabbing' : 'cursor-grab'
            } border-b border-emerald-700/60`}
            title="Drag anywhere on header to move"
          >
            <div className="flex items-center gap-2 pointer-events-none">
              <div className="text-emerald-300 opacity-70">
                <GripVertical className="w-4 h-4" />
              </div>
              <div className="w-7 h-7 rounded-lg bg-emerald-700 text-emerald-100 flex items-center justify-center font-bold shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5 leading-tight">
                  <span>Yojana Mitra AI</span>
                  <span className="px-1.5 py-0.5 text-[9px] bg-emerald-900/60 rounded text-emerald-200 font-normal">
                    Gemini 3.7
                  </span>
                </div>
                <div className="text-[10px] text-emerald-200 flex items-center gap-1 leading-tight mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span>Official Government Advisor</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-emerald-700/80 rounded-md text-emerald-200 hover:text-white transition-colors cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleClearChat}
                className="p-1.5 hover:bg-emerald-700/80 rounded-md text-emerald-200 hover:text-white transition-colors cursor-pointer"
                title="Clear Conversation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsChatbotOpen(false)}
                className="p-1.5 hover:bg-emerald-700/80 rounded-md text-emerald-200 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content (hidden when minimized) */}
          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto bg-stone-50/60 space-y-3.5 text-xs">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-xl p-3 shadow-2xs ${
                          isUser
                            ? 'bg-emerald-800 text-white rounded-br-2xs'
                            : 'bg-white text-stone-800 border border-stone-200 rounded-bl-2xs'
                        }`}
                      >
                        {isUser ? (
                          <p className="text-white text-xs whitespace-pre-wrap">{msg.text}</p>
                        ) : (
                          <div className="space-y-1">{formatText(msg.text)}</div>
                        )}

                        {/* Interactive Scheme Cards inside AI Reply */}
                        {!isUser && msg.matchedSchemes && msg.matchedSchemes.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-stone-100 space-y-1.5">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              <span>Added to Home Page Recommendations:</span>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              {msg.matchedSchemes.map((scheme) => (
                                <button
                                  key={scheme.id}
                                  onClick={() => handleSchemeClick(scheme)}
                                  className="w-full text-left p-2 rounded-lg bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/80 flex items-center justify-between gap-2 transition-colors cursor-pointer group"
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="text-[11px] font-bold text-stone-900 truncate group-hover:text-emerald-900">
                                      {scheme.name}
                                    </div>
                                    <div className="text-[9px] text-emerald-700 font-semibold truncate">
                                      {scheme.financialBenefitAmount || scheme.category}
                                    </div>
                                  </div>
                                  <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded shadow-2xs border border-emerald-200 shrink-0 flex items-center gap-0.5">
                                    View Details ↗
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div
                          className={`text-[9px] mt-1.5 text-right ${
                            isUser ? 'text-emerald-200' : 'text-stone-400'
                          }`}
                        >
                          {msg.timestamp}
                        </div>
                      </div>
                      {isUser && (
                        <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-0.5 border border-stone-300">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex gap-2.5 justify-start">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-white text-stone-800 border border-stone-200 rounded-xl p-3 shadow-2xs rounded-bl-2xs flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" />
                      </div>
                      <span className="text-[11px] text-stone-500 font-medium">Consulting official guidelines...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Suggestions */}
              {messages.length <= 2 && (
                <div className="px-3 py-2 bg-stone-100/70 border-t border-stone-200/80">
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                    Suggested Questions:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-[11px] text-stone-700 bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-stone-200 px-2.5 py-1 rounded-full text-left transition-colors cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Footer */}
              <div className="p-3 border-t border-stone-200 bg-white">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about schemes, scholarships, eligibility..."
                    className="w-full text-xs pl-3.5 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-600 text-stone-800 placeholder-stone-400"
                    disabled={loading}
                  />
                  <button
                    id="send-gemini-chat-btn"
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || loading}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-800 text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                    title="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-400 mt-1.5 px-1">
                  <span>Grounded in verified portals (.gov.in)</span>
                  <span>Powered by Gemini</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
