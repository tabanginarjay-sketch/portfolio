'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Download,
  MessageSquare,
  Menu,
  X,
  ExternalLink,
  Award,
  Code2,
  Palette,
  Database,
  Terminal,
  Sparkles,
  CheckCircle2,
  Mail,
  Send,
  Eye,
  Video,
  Headphones,
  Loader2,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Trophy,
  Calendar,
  SlidersHorizontal,
  Lock,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react';
import SmokeAtmosphere from '../components/SmokeAtmosphere';
import GeometricShapes from '../components/GeometricShapes';
import BeforeAfterEditCard from '../components/BeforeAfterEditCard';
import BackToTop from '../components/BackToTop';

export default function PortfolioPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'WEB' | 'PWA' | 'UIUX'>('ALL');
  const [activeEditCategory, setActiveEditCategory] = useState<string>('All');
  const [selectedCertificate, setSelectedCertificate] = useState<any | null>(null);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // Load saved theme preference on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('arjay-portfolio-theme') as 'dark' | 'light' | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
        if (savedTheme === 'light') {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
          document.documentElement.classList.add('dark');
        }
      }
    } catch {}
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('arjay-portfolio-theme', nextTheme);
      } catch {}
      if (nextTheme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
      return nextTheme;
    });
  }, []);

  // Horizontal Certificates Carousel & Anti-Capture Shield state & refs
  const pageRootRef = useRef<HTMLDivElement | null>(null);
  const certSectionRef = useRef<HTMLElement | null>(null);
  const isCertInViewRef = useRef<boolean>(false);
  const certSliderRef = useRef<HTMLDivElement | null>(null);
  const certCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const certScrollRafRef = useRef<number | null>(null);
  const certHoverTimerRef = useRef<number | null>(null);
  const certShieldTimerRef = useRef<number | null>(null);
  const [activeCertIndex, setActiveCertIndex] = useState(0);
  const [canScrollCertPrev, setCanScrollCertPrev] = useState(false);
  const [canScrollCertNext, setCanScrollCertNext] = useState(true);
  const [isCertShielded, setIsCertShielded] = useState(false);
  const [certShieldReason, setCertShieldReason] = useState<'capture' | 'blur' | null>(null);
  const [hoveredCert, setHoveredCert] = useState<{
    cert: any;
    side: 'left' | 'right';
    top: number;
  } | null>(null);

  // Contact / Let's Chat form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [contactError, setContactError] = useState('');

  const closeChatModal = () => {
    setIsChatModalOpen(false);
    if (contactStatus === 'sent' || contactStatus === 'error') {
      setContactStatus('idle');
      setContactError('');
    }
  };

  const GMAIL_COMPOSE_URL =
    'https://mail.google.com/mail/?view=cm&fs=1&to=tabanginarjay@gmail.com&su=Portfolio%20Inquiry%20for%20Ar-jay%20Tabangin';

  const buildGmailComposeHref = () => {
    const hasDetails = contactName.trim() || contactEmail.trim() || contactMessage.trim();
    if (!hasDetails) return GMAIL_COMPOSE_URL;

    const subject = encodeURIComponent(
      `Portfolio Inquiry from ${contactName.trim() || 'Website Visitor'}`
    );
    const body = encodeURIComponent(
      `Name: ${contactName.trim()}\nEmail: ${contactEmail.trim()}\n\nMessage:\n${contactMessage.trim()}`
    );
    return `https://mail.google.com/mail/?view=cm&fs=1&to=tabanginarjay@gmail.com&su=${subject}&body=${body}`;
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;

    setContactStatus('sending');
    setContactError('');

    try {
      const response = await fetch('https://formsubmit.co/ajax/tabanginarjay@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: contactName.trim(),
          email: contactEmail.trim(),
          message: contactMessage.trim(),
          _subject: `New Portfolio Message from ${contactName.trim()}`,
          _replyto: contactEmail.trim(),
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const data = await response.json().catch(() => null);
      if (response.ok && (data?.success === 'true' || data?.success === true)) {
        setContactStatus('sent');
        setContactName('');
        setContactEmail('');
        setContactMessage('');
      } else {
        throw new Error(data?.message || 'Unable to deliver message right now.');
      }
    } catch (err) {
      setContactStatus('error');
      setContactError(
        err instanceof Error
          ? err.message
          : 'Could not send directly right now. Use the quick email button below.'
      );
    }
  };

  // Projects data (Featuring Ar-jay's actual deployed platforms & applications)
  const projects = [
    {
      id: 'proj-1',
      title: 'EduScholar - Scholarship System',
      category: 'WEB',
      type: 'Full-Stack Student Scholarship Management Platform',
      description:
        'A comprehensive cloud scholarship application, document verification, grant tracking, and automated qualification evaluation portal deployed live on Railway for Bestlink College of the Philippines.',
      tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Railway Deployment', 'Auth'],
      image: '/images/projects/eduscholar.png',
      link: 'https://eduscholar.up.railway.app',
      github: '#',
      status: 'Live on Railway',
    },
    {
      id: 'proj-2',
      title: 'Kusina Ordering App',
      category: 'WEB',
      type: 'Restaurant Food Ordering & Menu App',
      description:
        'A streamlined restaurant digital menu, dynamic item builder, real-time checkout cart, and customer dispatch system developed for Anna Quintos Lagmay.',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'REST API', 'Cart Management', 'Mobile UI'],
      image: '/images/thumb_photo-1542120178-984cbcccff94.jpg',
      link: '#',
      github: '#',
      status: 'Client Delivered',
    },
    {
      id: 'proj-3',
      title: 'Campus Navigator',
      category: 'UIUX',
      type: 'Interactive University Wayfinding & Navigation',
      description:
        'An interactive campus directory and floor-by-floor wayfinding design system enabling students, faculty, and campus visitors at Bestlink College of the Philippines to navigate university facilities effortlessly.',
      tags: ['UI/UX Design', 'Figma', 'Interactive Maps', 'Wayfinding', 'Tailwind CSS'],
      image: '/images/thumb_photo-1521097472625-419f0a4bbb6d.jpg',
      link: '#',
      github: '#',
      status: 'Campus Implemented',
    },
    {
      id: 'proj-4',
      title: 'Sole Surgeon Atelier & Worker PWA',
      category: 'PWA',
      type: 'E-Commerce Atelier & Worker Progressive Web App',
      description:
        'A precision footwear restoration atelier e-commerce booking portal and offline-first shop floor PWA with sequential stage progression, barcode intake, and live Airtable data synchronizations.',
      tags: ['Next.js 15', 'PWA Manifest', 'Service Worker', 'TypeScript', 'Tailwind v4', 'Airtable API'],
      image: '/images/projects/sole-surgeon.png',
      link: 'https://sole-surgeon-pwa.vercel.app/',
      github: '#',
      status: 'Production PWA',
    },
  ];

  // Official Certificates & Accreditations (All 7 verified certifications — View-Only & Hold-to-Reveal Protected)
  const certificates = [
    {
      id: 'cert-1',
      title: 'Introduction to Cybersecurity',
      issuer: 'Cisco Networking Academy',
      date: 'October 29, 2026',
      credentialId: 'CISCO-COURSE-COMPLETION',
      badge: 'Cisco Verified',
      description:
        'Official student-level course completion credential covering foundational cybersecurity principles, threat detection, online defense strategies, vulnerability mitigation, and organizational network safety.',
      skills: ['Cybersecurity', 'Threat Analysis', 'Network Defense', 'Incident Mitigation'],
      image: '/certificates/cisco_cybersecurity.jpg?v=wm2',
    },
    {
      id: 'cert-2',
      title: 'Global Knowledge Standards, Practices and Technologies for Cybersecurity Function, Governance and Management',
      issuer: 'Department of Information and Communications Technology (DICT) Region VIII',
      date: 'October 30, 2026',
      credentialId: 'ILCDB_R8_GKSPATFCFGAM_2026_196',
      badge: 'DICT Regional Office 8 (16 Hours)',
      description:
        'Official 16-hour credential awarded by the DICT ICT Academy covering international cybersecurity governance, risk management frameworks, and enterprise IT defense conducted in Tacloban City.',
      skills: ['Cybersecurity Governance', 'IT Management', 'Security Standards', 'Risk Management'],
      image: '/certificates/dict_cybersecurity.jpg?v=wm2',
    },
    {
      id: 'cert-3',
      title: 'Fundamentals of AI-Driven Development',
      issuer: 'AI Dev PH Discord Community',
      date: 'October 29, 2026',
      credentialId: 'MWA-9V75-3SVS',
      badge: 'All 4 AI Dev Courses Completed',
      verifyUrl: 'https://course.marwieang.com/verify/MWA-9V75-3SVS',
      description:
        'Comprehensive completion credential for mastering AI-driven development workflows, prompt engineering, AI coding assistants, and modern software paradigms taught by Mar Wie Ang.',
      skills: ['AI-Driven Development', 'Prompt Engineering', 'Full Stack AI', 'Modern Workflows'],
      image: '/certificates/aidev_fundamentals.jpg?v=wm2',
    },
    {
      id: 'cert-4',
      title: 'Career Seminar: Marketing ME Live',
      issuer: 'Jobs180.com & Bestlink College of the Philippines (BCP)',
      date: 'October 7, 2026',
      credentialId: 'BCP-JOBS180-QC',
      badge: 'Career Seminar Attendance',
      description:
        'Official Certificate of Attendance for participating in the career seminar Marketing ME Live at Bestlink College of the Philippines, Quezon City, presented by Managing Director Kim Chua.',
      skills: ['Personal Branding', 'Professional Communication', 'Career Positioning', 'Client Relations'],
      image: '/certificates/bcp_marketing_me.jpg?v=wm2',
    },
    {
      id: 'cert-5',
      title: 'Introduction to Laravel Webinar',
      issuer: 'Bestlink College of the Philippines — BSIT Department',
      date: 'October 1, 2026',
      credentialId: 'BCP-BSIT-LARAVEL-2026',
      badge: 'BCP BSIT Webinar',
      description:
        'Certificate of Appreciation for active participation in the academic webinar "Introduction to Laravel" covering modern PHP web application fundamentals, led by Resource Speaker Dr. Enrico P. Chavez (TUP – Manila).',
      skills: ['Laravel', 'PHP', 'Web Applications', 'Backend Fundamentals'],
      image: '/certificates/bcp_laravel_webinar.jpg?v=wm2',
    },
    {
      id: 'cert-6',
      title: '3rd Year Program Specific Research Seminar 2025',
      issuer: 'Bestlink College of the Philippines — Center for Research and Development',
      date: 'August 3, 2025',
      credentialId: 'RS05661',
      badge: 'Research Seminar',
      description:
        'Official Certificate of Attendance for actively participating in the 3rd Year Program Specific Research Seminar 2025 themed "Starting the Research Journey: Building the Foundation for Academic and Social Impact".',
      skills: ['IT Research', 'Research Methodology', 'Academic Writing', 'Capstone Readiness'],
      image: '/certificates/bcp_research_seminar.jpg?v=wm2',
    },
    {
      id: 'cert-7',
      title: 'Health Care CCT Graduate — Communication & Culture Training',
      issuer: 'Concentrix & Anthem Pay By Phone Member Services',
      date: 'November 15, 2019',
      credentialId: 'CNX-ANTHEM-CCT-2019',
      badge: 'Concentrix • Anthem',
      description:
        'Official graduation certificate from Concentrix & Anthem Pay By Phone Member Services for completing Health Care Communication & Culture Training (CCT) and earning endorsement to Product Specific Training.',
      skills: ['Healthcare Support', 'Client Communication', 'Cultural Alignment', 'Customer Service'],
      image: '/certificates/concentrix_anthem_cct.jpg?v=wm2',
    },
  ];

  const syncCertSliderState = useCallback(() => {
    const slider = certSliderRef.current;
    if (!slider) return;

    const maxScroll = Math.max(0, slider.scrollWidth - slider.clientWidth);
    const currentLeft = slider.scrollLeft;

    setCanScrollCertPrev(currentLeft > 6);
    setCanScrollCertNext(currentLeft < maxScroll - 6);

    if (maxScroll > 0 && currentLeft >= maxScroll - 8) {
      setActiveCertIndex(certificates.length - 1);
      return;
    }

    const padLeft = parseFloat(window.getComputedStyle(slider).paddingLeft) || 0;
    let closestIdx = 0;
    let minDiff = Infinity;

    certCardRefs.current.forEach((card, idx) => {
      if (!card) return;
      const targetLeft = Math.max(0, card.offsetLeft - padLeft);
      const diff = Math.abs(targetLeft - currentLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    setActiveCertIndex(closestIdx);
  }, [certificates.length]);

  const openCertCopyRequest = useCallback((certTitle: string) => {
    setSelectedCertificate(null);
    setContactStatus('idle');
    setContactError('');
    setContactMessage(
      `Hi Ar-jay, I would like to request an official verified copy of your certificate: "${certTitle}".`
    );
    setIsChatModalOpen(true);
  }, []);

  const handleCertScroll = useCallback(() => {
    setHoveredCert(null);
    if (certScrollRafRef.current !== null) return;
    certScrollRafRef.current = window.requestAnimationFrame(() => {
      certScrollRafRef.current = null;
      syncCertSliderState();
    });
  }, [syncCertSliderState]);

  const clearCertHover = useCallback(() => {
    if (certHoverTimerRef.current !== null) {
      window.clearTimeout(certHoverTimerRef.current);
      certHoverTimerRef.current = null;
    }
    setHoveredCert(null);
  }, []);

  const handleCertHoverStart = useCallback((cert: any, cardEl: HTMLElement) => {
    if (typeof window === 'undefined') return;
    if (
      window.innerWidth < 1024 ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    ) {
      return;
    }
    if (certHoverTimerRef.current !== null) {
      window.clearTimeout(certHoverTimerRef.current);
    }

    const rect = cardEl.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const side: 'left' | 'right' = cardCenterX < window.innerWidth / 2 ? 'right' : 'left';
    const estimatedHeight = 560;
    const idealTop = rect.top + rect.height / 2 - estimatedHeight / 2;
    const maxTop = Math.max(20, window.innerHeight - estimatedHeight - 20);
    const clampedTop = Math.max(20, Math.min(idealTop, maxTop));

    certHoverTimerRef.current = window.setTimeout(() => {
      setHoveredCert({ cert, side, top: Math.round(clampedTop) });
    }, 85);
  }, []);

  const handleCertHoverEnd = useCallback(() => {
    if (certHoverTimerRef.current !== null) {
      window.clearTimeout(certHoverTimerRef.current);
      certHoverTimerRef.current = null;
    }
    certHoverTimerRef.current = window.setTimeout(() => {
      setHoveredCert(null);
    }, 55);
  }, []);

  useEffect(() => {
    if (!hoveredCert) return;
    const dismissOnScroll = () => setHoveredCert(null);
    window.addEventListener('scroll', dismissOnScroll, { passive: true });
    return () => window.removeEventListener('scroll', dismissOnScroll);
  }, [hoveredCert]);

  // Track when the Certificates section is onscreen so anti-screenshot shield only activates when needed
  useEffect(() => {
    const sectionEl = certSectionRef.current;
    if (!sectionEl) return;
    const observer = new IntersectionObserver(
      (entries) => {
        isCertInViewRef.current = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.05 }
    );
    observer.observe(sectionEl);
    return () => observer.disconnect();
  }, []);

  // Anti-Screenshot & Screen-Capture Blackout Shield (certificates stay visible normally, black out immediately on capture triggers)
  useEffect(() => {
    const isProtectingCerts = () =>
      Boolean(selectedCertificate || hoveredCert || isCertInViewRef.current);

    const triggerCaptureShield = (durationMs = 2800) => {
      setHoveredCert(null);
      setCertShieldReason('capture');
      setIsCertShielded(true);
      if (certShieldTimerRef.current !== null) {
        window.clearTimeout(certShieldTimerRef.current);
      }
      certShieldTimerRef.current = window.setTimeout(() => {
        setIsCertShielded(false);
        setCertShieldReason(null);
        certShieldTimerRef.current = null;
      }, durationMs);
    };

    const handleKeyCapture = (e: KeyboardEvent) => {
      if (!isProtectingCerts()) return;

      const key = e.key?.toLowerCase() || '';
      const isPrintScreen = e.key === 'PrintScreen' || e.code === 'PrintScreen';
      const isMetaShiftCombo = e.metaKey && e.shiftKey; // Early trigger for Win+Shift+S & Cmd+Shift+3/4/5
      const isWinSnipping = (e.metaKey || e.ctrlKey) && e.shiftKey && key === 's';
      const isPrintOrSave = (e.ctrlKey || e.metaKey) && (key === 'p' || key === 's' || key === 'u');
      const isDevTools =
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(key));

      if (isPrintScreen || isMetaShiftCombo || isWinSnipping || isPrintOrSave || isDevTools) {
        e.preventDefault();
        e.stopPropagation();
        triggerCaptureShield();
        if (isPrintScreen && navigator.clipboard?.writeText) {
          navigator.clipboard.writeText('').catch(() => {});
        }
      }
    };

    // Instant blackout if 3-finger screenshot gesture is detected on Android/iOS
    const handleMultiTouchGuard = (e: TouchEvent) => {
      if (e.touches.length >= 3 && isProtectingCerts()) {
        triggerCaptureShield(2400);
      }
    };

    // Instant blackout when window loses focus (e.g. Snipping Tool / OS screen recorder picker / app switcher)
    const handleWindowBlur = () => {
      if (!isProtectingCerts()) return;
      setHoveredCert(null);
      setCertShieldReason('blur');
      setIsCertShielded(true);
    };

    const handleWindowFocus = () => {
      setIsCertShielded((prev) => {
        if (!prev) return prev;
        return false;
      });
      setCertShieldReason((prev) => (prev === 'blur' ? null : prev));
    };

    const handleVisibilityChange = () => {
      if (document.hidden && isProtectingCerts()) {
        setHoveredCert(null);
        setCertShieldReason('blur');
        setIsCertShielded(true);
      } else if (!document.hidden) {
        setIsCertShielded(false);
        setCertShieldReason(null);
      }
    };

    window.addEventListener('keydown', handleKeyCapture, true);
    window.addEventListener('keyup', handleKeyCapture, true);
    window.addEventListener('touchstart', handleMultiTouchGuard, { passive: true });
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyCapture, true);
      window.removeEventListener('keyup', handleKeyCapture, true);
      window.removeEventListener('touchstart', handleMultiTouchGuard);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (certShieldTimerRef.current !== null) {
        window.clearTimeout(certShieldTimerRef.current);
      }
    };
  }, [selectedCertificate, hoveredCert]);

  // Smooth zero-lag scroll-reveal observer across all sections & cards
  useEffect(() => {
    const root = pageRootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed="true"])')
    );
    if (targets.length === 0) return;

    const revealElement = (el: HTMLElement, immediate = false) => {
      el.setAttribute('data-revealed', 'true');
      if (immediate) {
        el.setAttribute('data-reveal-done', 'true');
        return;
      }
      const rawDelay = el.style.getPropertyValue('--reveal-delay').trim();
      const delayMs = rawDelay.endsWith('ms') ? parseFloat(rawDelay) || 0 : 0;
      window.setTimeout(() => {
        el.setAttribute('data-reveal-done', 'true');
      }, delayMs + 800);
    };

    const viewportCutoff = window.innerHeight * 0.94;
    const pending: HTMLElement[] = [];

    targets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewportCutoff && rect.bottom > 0) {
        revealElement(el, true);
      } else {
        pending.push(el);
      }
    });

    root.classList.add('js-reveal-active');
    if (pending.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          revealElement(el, false);
          observer.unobserve(el);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -36px 0px' }
    );

    pending.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeTab, activeEditCategory]);

  const scrollToCertIndex = useCallback((idx: number) => {
    const slider = certSliderRef.current;
    const card = certCardRefs.current[idx];
    if (!slider || !card) return;

    const padLeft = parseFloat(window.getComputedStyle(slider).paddingLeft) || 0;
    const maxScroll = Math.max(0, slider.scrollWidth - slider.clientWidth);
    const targetLeft = Math.min(Math.max(0, card.offsetLeft - padLeft), maxScroll);

    slider.scrollTo({ left: targetLeft, behavior: 'smooth' });
    setActiveCertIndex(idx);
  }, []);

  const scrollCertBy = useCallback((direction: -1 | 1) => {
    const slider = certSliderRef.current;
    if (!slider) return;

    const padLeft = parseFloat(window.getComputedStyle(slider).paddingLeft) || 0;
    const maxScroll = Math.max(0, slider.scrollWidth - slider.clientWidth);
    const currentLeft = slider.scrollLeft;

    const positions = certCardRefs.current
      .map((card) => (card ? Math.max(0, Math.round(card.offsetLeft - padLeft)) : null))
      .filter((pos): pos is number => pos !== null);

    if (direction === 1) {
      const nextPos = positions.find((pos) => pos > currentLeft + 16);
      const target = nextPos !== undefined ? Math.min(nextPos, maxScroll) : maxScroll;
      slider.scrollTo({ left: target, behavior: 'smooth' });
    } else {
      const prevCandidates = positions.filter((pos) => pos < currentLeft - 16);
      const target =
        prevCandidates.length > 0 ? prevCandidates[prevCandidates.length - 1] : 0;
      slider.scrollTo({ left: target, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    syncCertSliderState();
    const handleResize = () => syncCertSliderState();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      if (certScrollRafRef.current !== null) {
        window.cancelAnimationFrame(certScrollRafRef.current);
      }
      if (certHoverTimerRef.current !== null) {
        window.clearTimeout(certHoverTimerRef.current);
      }
    };
  }, [syncCertSliderState]);

  const workExperience = [
    {
      id: 'exp-1',
      role: 'Freelance Graphic Designer',
      subtitle: 'Photo / Video Editor',
      company: 'Self-Employed / Freelance',
      period: '2021 – 2026',
      current: true,
      description:
        'Provided freelance photo and video editing services while assisting clients with their digital content and social media needs. Managed content scheduling and posting, monitored social media analytics, and utilized Microsoft Office and Google Workspace for administrative tasks, file organization, and client communication.',
      highlights: ['Photo & Video Editing', 'Social Media Analytics', 'Content Scheduling', 'Google Workspace'],
    },
    {
      id: 'exp-2',
      role: 'Customer Service Representative',
      subtitle: 'Customer Advisor II',
      company: 'Teleperformance',
      period: '2020 – 2021',
      current: false,
      description:
        'Provided professional customer service and support by assisting corporate clients with their inquiries, concerns, and account-related needs. Maintained positive client relationships through clear communication, timely assistance, and effective problem-solving while handling multiple tasks efficiently.',
      highlights: ['Corporate Client Support', 'Account Resolution', 'Problem-Solving', 'Multitasking'],
    },
    {
      id: 'exp-3',
      role: 'Customer Service Representative',
      subtitle: 'Customer Care / Technical Support',
      company: 'Concentrix',
      period: '2019 – 2020',
      current: false,
      description:
        'Provided customer service and support by handling customer inquiries, concerns, and account-related issues. Managed multiple tasks while maintaining professional communication and ensuring that customer concerns were addressed accurately and efficiently, including e-commerce-related operations.',
      highlights: ['Technical Support', 'E-Commerce Operations', 'Customer Care', 'CRM Systems'],
    },
  ];

  const educationHistory = [
    {
      id: 'edu-1',
      school: 'Bestlink College of the Philippines',
      program: 'Bachelor of Science in Information Technology (BSIT)',
      period: '2026 – Present',
      status: 'Current',
      details: 'Quezon City • Focused on full-stack web systems, UI/UX engineering, and IT solutions.',
    },
    {
      id: 'edu-2',
      school: 'University of Northern Philippines',
      program: 'Bachelor of Science in Architecture',
      period: 'Last Attended 2021',
      status: 'College',
      details: 'Developed strong fundamentals in visual composition, drafting, and spatial design thinking.',
    },
    {
      id: 'edu-3',
      school: 'Belen National High School',
      program: 'General Academic Strand (GAS)',
      period: 'Completed in 2017',
      status: 'Secondary',
      details: 'Senior High School academic foundation across communication, technology, and humanities.',
    },
  ];

  const achievements = [
    {
      id: 'ach-1',
      title: 'Top Performers Award',
      year: 'Excellence Recognition',
      description:
        'Recognized for consistently exceeding performance benchmarks, strong client satisfaction, and dependable delivery.',
    },
    {
      id: 'ach-2',
      title: 'Best Graphic Designer',
      year: '2022',
      description:
        'Awarded for delivering standout visual design craftsmanship, creative direction, and high-quality media outputs.',
    },
    {
      id: 'ach-3',
      title: 'Client & Creative Commendations',
      year: 'Ongoing',
      description:
        'Consistently received positive feedback and recognition from managers and clients for high-quality creative outputs and timely execution.',
    },
  ];

  const editCategories = ['All', 'Sneaker Cleaning', 'Sneaker Restoration', 'Leather Care'];

  const editSamples = [
    {
      id: 'edit-1',
      title: 'Canvas Deep Clean & Mud Extraction',
      subject: "Canvas Low-Top 'Natural Tan'",
      category: 'Sneaker Cleaning',
      beforeImage: '/images/edits/clean-before.jpg',
      afterImage: '/images/edits/clean-after.jpg',
      editNotes:
        'Dried mud splatters and dark stains across the canvas upper, grimy laces, and soiled rubber sole restored to studio-fresh clarity with clean white foxing and bright highlights.',
      techniques: ['Stain Cleanup', 'Color Balance', 'White Brightening'],
    },
    {
      id: 'edit-2',
      title: 'Complete Canvas Fiber Revival & Sole Brightening',
      subject: "Heritage Canvas Low-Top 'Tonal Tan'",
      category: 'Sneaker Restoration',
      beforeImage: '/images/edits/restore-before.jpg',
      afterImage: '/images/edits/restore-after.jpg',
      editNotes:
        'Deep ground-in dirt, heavy road soil splatters across the canvas weave, stained laces, and scuffed foxing revived to a crisp factory-clean finish.',
      techniques: ['Texture Revival', 'Tone Matching', 'Edge Cleanup'],
    },
    {
      id: 'edit-4',
      title: 'Artisan Hand-Buffed Wax Polish & Scuff Buffing',
      subject: 'Handcrafted Calfskin Leather Oxford Cap-Toes',
      category: 'Leather Care',
      beforeImage: '/images/edits/leather-before.jpg',
      afterImage: '/images/edits/leather-after.jpg',
      editNotes:
        'Dry, parched calfskin leather with abrasive toe-cap scratches transformed with rich tonal conditioning, pigment blending, and specular mirror shine.',
      techniques: ['Leather Retouch', 'Scuff Removal', 'Specular Gloss'],
    },
    {
      id: 'edit-6',
      title: 'Intensive Outsole Grooving & Gravel De-Pebbling',
      subject: 'All-Terrain Rubber Tread Trainer',
      category: 'Sneaker Cleaning',
      beforeImage: '/images/edits/sole-tread-before.jpg',
      afterImage: '/images/edits/sole-tread-after.jpg',
      editNotes:
        'Heavily caked dried mud and gravel pebbles lodged across the rubber traction grooves cleanly removed while restoring natural gum-sole depth and sharpness.',
      techniques: ['Macro Cleanup', 'Contrast Clarity', 'Color Restore'],
    },
    {
      id: 'edit-7',
      title: 'Express Sidewall Brightening & Scuff Reduction',
      subject: 'Minimalist Low-Top Calfskin Court',
      category: 'Sneaker Cleaning',
      beforeImage: '/images/edits/essential-clean-before.jpg',
      afterImage: '/images/edits/essential-clean-after.jpg',
      editNotes:
        'Daily street scuff streaks along the white rubber foxing and dusty leather upper cleaned into a crisp, e-commerce-ready commercial showcase shot.',
      techniques: ['Product Retouch', 'Scuff Removal', 'Studio Grade'],
    },
  ];

  const filteredEdits =
    activeEditCategory === 'All'
      ? editSamples
      : editSamples.filter((e) => e.category === activeEditCategory);

  const filteredProjects =
    activeTab === 'ALL' ? projects : projects.filter((p) => p.category === activeTab);

  return (
    <div
      ref={pageRootRef}
      className={`relative min-h-screen overflow-x-clip selection:bg-[#FF5A5F]/30 selection:text-[#FF5A5F] transition-colors duration-300 ${
        theme === 'light' ? 'light-theme bg-[#f8fafc] text-zinc-900' : 'bg-[#000000] text-white'
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. TOP HEADER NAVIGATION (Matching the Reference Screenshot)             */}
      {/* ========================================================================= */}
      <header className="hero-anim-down relative z-50 w-full max-w-7xl mx-auto pt-[max(0.75rem,env(safe-area-inset-top))] pb-2.5 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:px-8 lg:px-12 sm:py-4 lg:py-6 flex items-center justify-between">
        {/* Brand Logo & Email Link */}
        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href="#"
            className="group flex items-center"
            aria-label="Ar-jay Home"
          >
            <span className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-zinc-950 border border-white/15 group-hover:border-[#FF5A5F]/60 flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(255,90,95,0.12)] group-hover:shadow-[0_0_24px_rgba(255,90,95,0.3)] transition-all duration-300">
              <Image
                src="/images/arjay-logo.png"
                alt="Ar-jay AJ Monogram Logo"
                width={36}
                height={36}
                priority
                unoptimized
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </span>
          </a>

          <a
            href={GMAIL_COMPOSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Compose email in Gmail"
            className="hidden sm:inline-block text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors"
          >
            tabanginarjay@gmail.com
          </a>
        </div>

        {/* Right Menu & Theme Switcher Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Light / Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all duration-300 shadow-sm cursor-pointer text-xs font-semibold"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                <span className="hidden xs:inline sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-500 group-hover:-rotate-12 transition-transform duration-300" />
                <span className="hidden xs:inline sm:inline">Dark</span>
              </>
            )}
          </button>

          <a
            href={GMAIL_COMPOSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Compose email in Gmail"
            className="sm:hidden text-xs text-zinc-400 hover:text-white transition-colors"
          >
            Email
          </a>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-white hover:text-[#FF5A5F] transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Slide-out / Mobile Navigation Overlay & Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ease-out ${
          isMenuOpen
            ? 'opacity-100 pointer-events-auto visible'
            : 'opacity-0 pointer-events-none invisible'
        }`}
        aria-hidden={!isMenuOpen}
      >
        {/* Dark Frosted Glass Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Sliding Drawer Panel (from right) */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-full max-w-[320px] sm:max-w-[360px] bg-zinc-950/95 border-l border-zinc-800/80 shadow-2xl p-6 sm:p-7 flex flex-col justify-between transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform transform ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header: Monogram + Close Button */}
          <div className="flex items-center justify-between pb-5 border-b border-zinc-900">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-xs tracking-wider text-white">
                AJ
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Ar-jay Tabangin</span>
                <span className="text-[10px] text-zinc-400 font-mono">Portfolio Navigation</span>
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links with Staggered Cascading Entrance */}
          <nav className="flex flex-col space-y-3.5 my-auto py-5">
            {[
              { href: '#hero', label: 'Home', num: '01' },
              { href: '#experience', label: 'Experience & Education', num: '02' },
              { href: '#certificates', label: 'Certificates', num: '03' },
              { href: '#projects', label: 'Featured Websites', num: '04' },
              { href: '#edits', label: 'Photo Edit Samples', num: '05' },
              { href: '#skills', label: 'Skills & Tech Stack', num: '06' },
            ].map((item, idx) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  transitionDelay: isMenuOpen ? `${60 + idx * 35}ms` : '0ms',
                }}
                className={`group flex items-center justify-between py-2 text-base font-semibold text-zinc-300 hover:text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
                  isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-zinc-600 group-hover:text-[#FF5A5F] transition-colors">
                    {item.num}
                  </span>
                  <span>{item.label}</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-[#FF5A5F] group-hover:translate-x-1 transition-all" />
              </a>
            ))}

            {/* Drawer Theme Switcher Row */}
            <div
              style={{
                transitionDelay: isMenuOpen ? '240ms' : '0ms',
              }}
              className={`flex items-center justify-between p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 transition-all duration-300 transform ${
                isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-[#22D3EE]" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <div>
                  <span className="text-xs font-bold block text-white">Appearance</span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {theme === 'dark' ? 'Dark Theme' : 'Light Theme'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Dark</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Contact Button */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsChatModalOpen(true);
              }}
              style={{
                transitionDelay: isMenuOpen ? '280ms' : '0ms',
              }}
              className={`w-full mt-3 py-3 rounded-2xl bg-gradient-to-r from-[#FF5A5F] to-[#FA5252] text-white text-xs font-bold shadow-lg shadow-rose-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform flex items-center justify-center gap-2 cursor-pointer ${
                isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Let&apos;s Chat / Direct Consultation</span>
            </button>
          </nav>

          {/* Drawer Footer: Status & Direct Contact */}
          <div className="pt-5 border-t border-zinc-900 space-y-2.5">
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for Projects</span>
            </div>
            <a
              href="mailto:tabanginarjay@gmail.com"
              className="text-[11px] text-zinc-400 hover:text-white font-mono block transition-colors"
            >
              tabanginarjay@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION (Compact Mobile + 3-Col Editorial Tablet / Laptop / PC)   */}
      {/* ========================================================================= */}
      <section
        id="hero"
        className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-1 sm:pt-2 lg:pt-4 pb-8 sm:pb-12 lg:pb-18 md:min-h-[600px] lg:min-h-[82dvh] xl:min-h-[85dvh] flex flex-col justify-between overflow-hidden"
      >
        {/* Subtle, non-intrusive ethereal smoke transition effect behind content */}
        <SmokeAtmosphere />
        <div className="grid grid-cols-12 gap-x-2 gap-y-3 sm:gap-x-4 sm:gap-y-4 md:gap-5 lg:gap-6 xl:gap-10 items-center relative z-20">
          {/* ----------------- LEFT COLUMN: HEADING & CTA ----------------- */}
          <div className="col-span-7 md:col-span-4 space-y-2.5 sm:space-y-4 lg:space-y-6 text-left order-1 pt-2 md:pt-0 relative z-30">
            <div className="space-y-1">
              <h1
                style={{ '--delay': '80ms' } as React.CSSProperties}
                className="hero-anim-up font-serif text-[30px] min-[390px]:text-[35px] sm:text-5xl md:text-[38px] lg:text-[52px] xl:text-7xl font-bold tracking-tight text-white leading-[1.06] lg:leading-[1.1]"
              >
                Hi, <br />
                I&apos;m <span className="text-[#FF5A5F]">Ar-jay</span>
              </h1>
              <div
                style={{ '--delay': '170ms' } as React.CSSProperties}
                className="hero-anim-up pt-1 lg:pt-2 space-y-0.5 lg:space-y-1"
              >
                <p className="text-white text-[13px] min-[390px]:text-sm sm:text-lg md:text-sm lg:text-lg xl:text-xl font-semibold tracking-wide leading-snug">
                  Developer &amp; UI/UX Designer
                </p>
                <p className="text-zinc-400 text-[10.5px] min-[390px]:text-[11px] sm:text-sm md:text-xs lg:text-sm xl:text-base font-medium leading-snug">
                  Certified Customer Service &bull; Photo/Video Editor
                </p>
              </div>
            </div>

            {/* Hire Me CTA Button matching the reference pill */}
            <div
              style={{ '--delay': '250ms' } as React.CSSProperties}
              className="hero-anim-up pt-1 lg:pt-2"
            >
              <button
                type="button"
                onClick={() => setIsChatModalOpen(true)}
                className="group inline-flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-7 sm:py-3 rounded-full bg-gradient-to-r from-[#FF5A5F] to-[#FA5252] text-white font-bold text-xs sm:text-sm lg:text-base shadow-lg shadow-rose-900/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Hire Me</span>
                <span className="p-0.5 sm:p-1 rounded-full bg-white/20 group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                </span>
              </button>
            </div>

            {/* Left Social Links */}
            <div
              style={{ '--delay': '330ms' } as React.CSSProperties}
              className="hero-anim-up pt-2 sm:pt-3 lg:pt-7 flex flex-col space-y-2 lg:space-y-4"
            >
              <div className="flex items-center gap-4 sm:gap-5 text-zinc-400">
                <a
                  href="https://www.facebook.com/share/1CstVHcQAw/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/tabanginarjay-sketch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/jay.fowp?jplx=YjY0dzk2dzMycG9r&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>

              {/* LinkedIn Link with Blue 'in' Badge */}
              <a
                href="https://www.linkedin.com/in/jay-t-a6bb1a217"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 sm:gap-2 text-[9.5px] min-[390px]:text-[10.5px] sm:text-xs text-zinc-400 hover:text-white transition-colors"
              >
                <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#0A66C2] flex items-center justify-center text-[8px] sm:text-[9px] font-bold text-white group-hover:scale-110 transition-transform shrink-0">
                  in
                </span>
                <span className="whitespace-nowrap">www.linkedin.com/in/jay-t-a6bb1a217</span>
              </a>
            </div>
          </div>

          {/* ----------------- CENTER / MOBILE-RIGHT COLUMN: PORTRAIT IMAGE WITH DYNAMIC ORBITAL LIGHTING ----------------- */}
          <div className="col-span-5 md:col-span-4 flex items-end justify-end md:items-center md:justify-center order-2 relative self-end md:self-center">
            {/* Dynamic Orbital Lighting System wrapping Ar-jay's portrait (Cyan ring, coral ring, and cyan dot orbiting with synced studio aura) */}
            <GeometricShapes>
              {/* True transparent portrait PNG — right-aligned beside Heading on mobile, centered on md+ */}
              <div
                style={{ '--delay': '110ms' } as React.CSSProperties}
                className="hero-anim-portrait relative w-[152px] min-[390px]:w-[168px] sm:w-[230px] md:w-[235px] lg:w-[320px] xl:w-[415px] aspect-[482/744] max-h-[245px] min-[390px]:max-h-[270px] sm:max-h-[360px] md:max-h-[365px] lg:max-h-[505px] xl:max-h-[630px] -mr-2 sm:mr-0 -mb-6 sm:-mb-8 md:my-0 select-none shrink-0"
              >
                <Image
                  src="/images/arjay-portrait-hero.png?v=6"
                  alt="Ar-jay Tabangin - Developer & UI/UX Designer"
                  fill
                  priority
                  unoptimized
                  className="object-contain object-top transition-transform duration-700 ease-out hover:scale-[1.02]"
                />
              </div>
            </GeometricShapes>
          </div>

          {/* ----------------- RIGHT / MOBILE-BOTTOM COLUMN: EXPERTISE ----------------- */}
          <div className="col-span-12 md:col-span-4 space-y-3 sm:space-y-4 lg:space-y-6 text-left order-3 relative mt-2 pt-4 border-t border-zinc-900/70 md:border-t-0 md:pt-0 md:mt-0">
            <div
              style={{ '--delay': '210ms' } as React.CSSProperties}
              className="hero-anim-right space-y-2 sm:space-y-2.5 lg:space-y-3"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[10px] sm:text-xs text-zinc-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Open for Opportunities</span>
              </div>

              <div>
                <span className="text-[#FF5A5F] text-[11px] sm:text-xs font-bold uppercase tracking-wider block">
                  Expert on
                </span>

                <h2 className="text-[15px] sm:text-lg md:text-base lg:text-xl xl:text-2xl font-bold text-white leading-snug pr-20 md:pr-0">
                  Based in Philippines <br className="hidden md:block" />
                  developer and <br className="hidden md:block" />
                  UI/UX designer, <br className="hidden md:block" />
                  certified customer service, <br className="hidden md:block" />
                  Photo/Video editor.
                </h2>
              </div>

              <p className="text-zinc-400 text-xs sm:text-sm md:text-xs lg:text-sm leading-relaxed max-w-sm pt-0.5 lg:pt-1">
                Versatile creator building modern web applications, designing user-centered interfaces,
                delivering certified client support, and producing compelling photo &amp; video media.
              </p>
            </div>

            {/* Download CV Link & Quick Preview */}
            <div
              style={{ '--delay': '320ms' } as React.CSSProperties}
              className="hero-anim-up pt-1 lg:pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 lg:gap-5"
            >
              <a
                href="/Ar-jay_Tabangin_CV.pdf"
                download="Ar-jay_Tabangin_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#FF5A5F] hover:text-rose-400 text-xs lg:text-sm font-bold border-b border-[#FF5A5F] pb-0.5 transition-colors group cursor-pointer whitespace-nowrap"
              >
                <span>Download CV</span>
                <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
              </a>
              <button
                type="button"
                onClick={() =>
                  setSelectedCertificate({
                    id: 'cert-cv',
                    title: 'Curriculum Vitae (CV) - Ar-Jay Q. Tabangin',
                    issuer: 'Freelance Programmer, Editor & Customer Service',
                    date: '2026',
                    credentialId: 'CV-ARJAY-TABANGIN',
                    badge: 'Official CV',
                    pdfUrl: '/Ar-jay_Tabangin_CV.pdf',
                    description:
                      'Complete curriculum vitae detailing BSIT education at Bestlink College of the Philippines, corporate customer service at Teleperformance and Concentrix, freelance design & editing, and key achievements.',
                    skills: ['UI/UX', 'Full Stack Development', 'Customer Care', 'Photo/Video Editing'],
                    image: '/certificates/arjay_cv_preview.jpg',
                  })
                }
                className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 whitespace-nowrap"
              >
                <Eye className="w-3 h-3 text-zinc-500" />
                <span>Quick Preview</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Quick-Jump Action Bar: View My Work + View My Certificates + Let's Chat */}
        <div
          style={{ '--delay': '380ms' } as React.CSSProperties}
          className="hero-anim-up relative z-30 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 pt-4 sm:pt-5"
        >
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-zinc-950/90 hover:bg-zinc-900 border border-zinc-800 hover:border-[#FF5A5F]/70 text-[10.5px] min-[390px]:text-[11px] sm:text-xs font-bold text-white transition-all shadow-lg active:scale-95 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF5A5F] shrink-0" />
              <span>View My Work</span>
              <ArrowRight className="w-3 h-3 text-zinc-400 group-hover:text-[#FF5A5F] group-hover:translate-x-0.5 transition-all shrink-0" />
            </a>

            <a
              href="#certificates"
              className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-zinc-950/90 hover:bg-zinc-900 border border-zinc-800 hover:border-[#FF5A5F]/70 text-[10.5px] min-[390px]:text-[11px] sm:text-xs font-bold text-white transition-all shadow-lg active:scale-95 whitespace-nowrap"
            >
              <Award className="w-3.5 h-3.5 text-[#FF5A5F] shrink-0" />
              <span>View My Certificates</span>
              <ArrowRight className="w-3 h-3 text-zinc-400 group-hover:text-[#FF5A5F] group-hover:translate-x-0.5 transition-all shrink-0" />
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsChatModalOpen(true)}
            className="group self-end sm:self-auto flex items-center gap-2.5 px-4 py-2 sm:py-2.5 rounded-full bg-zinc-950/90 hover:bg-zinc-900 border border-zinc-800 text-xs font-bold text-white transition-all shadow-lg hover:border-[#FF5A5F]/60 active:scale-95 cursor-pointer shrink-0"
          >
            <span>Let&apos;s Chat</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <MessageSquare className="w-4 h-4 text-white group-hover:text-[#FF5A5F] transition-colors" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BACKGROUND & TRACK RECORD (EXPERIENCE, EDUCATION & ACHIEVEMENTS)       */}
      {/* ========================================================================= */}
      <section id="experience" className="relative z-20 py-12 sm:py-16 lg:py-24 border-t border-zinc-900 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-8 sm:space-y-12 lg:space-y-14">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div data-reveal="up" className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A5F] flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5" />
                Background &amp; Track Record
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Experience, Education &amp; Achievements
              </h2>
              <p className="text-sm text-zinc-400 max-w-2xl">
                A proven track record blending freelance visual media production, corporate customer
                support at Teleperformance &amp; Concentrix, and formal academic training in IT and Architecture.
              </p>
            </div>

            <a
              data-reveal="right"
              style={{ '--reveal-delay': '100ms' } as React.CSSProperties}
              href="/Ar-jay_Tabangin_CV.pdf"
              download="Ar-jay_Tabangin_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-[#FF5A5F]/50 text-xs font-bold text-white transition-all self-start sm:self-auto shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-[#FF5A5F]" />
              <span>Download Full CV</span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* LEFT COLUMN: WORK EXPERIENCE TIMELINE */}
            <div className="lg:col-span-7 space-y-6">
              <div data-reveal="up" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-[#FF5A5F] flex items-center justify-center border border-rose-500/20">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Work Experience</h3>
                  <p className="text-xs text-zinc-400">Creative Design, Media Editing &amp; Corporate Client Support</p>
                </div>
              </div>

              <div className="relative pl-5 sm:pl-8 space-y-5 sm:space-y-6 before:content-[''] before:absolute before:left-[7px] before:top-3 before:bottom-3 before:w-px before:bg-gradient-to-b before:from-[#FF5A5F] before:via-zinc-800 before:to-transparent">
                {workExperience.map((exp, idx) => (
                  <div
                    key={exp.id}
                    data-reveal="left"
                    style={{ '--reveal-delay': `${idx * 90}ms` } as React.CSSProperties}
                    className="relative group p-4 sm:p-6 rounded-3xl bg-zinc-950/85 hover:bg-zinc-900/80 border border-zinc-850 hover:border-[#FF5A5F]/40 hover:-translate-y-1 transition-[transform,border-color,background-color] duration-300 shadow-lg space-y-3.5"
                  >
                    {/* Timeline Node Dot */}
                    <span
                      className={`absolute -left-[21px] sm:-left-[33px] top-6 sm:top-7 w-3.5 h-3.5 rounded-full border-2 border-black ${exp.current
                        ? 'bg-[#FF5A5F] shadow-[0_0_12px_rgba(255,90,95,0.8)]'
                        : 'bg-zinc-600 group-hover:bg-[#FF5A5F] transition-colors'
                        }`}
                    />

                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5A5F]">
                          {exp.company}
                        </span>
                        <h4 className="text-lg font-bold text-white leading-snug">
                          {exp.role}
                        </h4>
                        <p className="text-xs font-medium text-zinc-300">{exp.subtitle}</p>
                      </div>

                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300 shrink-0">
                        <Calendar className="w-3 h-3 text-[#FF5A5F]" />
                        {exp.period}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exp.highlights.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-lg bg-zinc-900/90 text-[11px] font-medium text-zinc-300 border border-zinc-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: EDUCATION + ACHIEVEMENTS */}
            <div className="lg:col-span-5 space-y-10">
              {/* EDUCATION */}
              <div className="space-y-5">
                <div data-reveal="up" className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Education</h3>
                    <p className="text-xs text-zinc-400">Academic Background &amp; Schools Attended</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {educationHistory.map((edu, idx) => (
                    <div
                      key={edu.id}
                      data-reveal="right"
                      style={{ '--reveal-delay': `${idx * 90}ms` } as React.CSSProperties}
                      className="p-5 rounded-3xl bg-zinc-950/85 hover:bg-zinc-900/80 border border-zinc-850 hover:border-cyan-500/35 hover:-translate-y-1 transition-[transform,border-color,background-color] duration-300 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${edu.status === 'Current'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                            }`}
                        >
                          {edu.status}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400">{edu.period}</span>
                      </div>

                      <h4 className="text-base font-bold text-white leading-snug">{edu.school}</h4>
                      <p className="text-xs font-semibold text-cyan-300/90">{edu.program}</p>
                      <p className="text-xs text-zinc-400 leading-relaxed">{edu.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACHIEVEMENTS & RECOGNITION */}
              <div className="space-y-5">
                <div data-reveal="up" className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Achievements &amp; Awards</h3>
                    <p className="text-xs text-zinc-400">Recognition &amp; Creative Honors</p>
                  </div>
                </div>

                <div
                  data-reveal="zoom"
                  style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
                  className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-zinc-950 via-zinc-950 to-amber-950/15 border border-amber-500/20 space-y-4 shadow-xl"
                >
                  {achievements.map((ach, idx) => (
                    <div
                      key={ach.id}
                      className={`flex items-start gap-3.5 ${idx !== 0 ? 'pt-4 border-t border-zinc-900' : ''
                        }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{ach.title}</h4>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            {ach.year}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{ach.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CERTIFICATES & CREDENTIALS SECTION (CAPTURE-PROTECTED)                 */}
      {/* ========================================================================= */}
      <section
        id="certificates"
        ref={certSectionRef}
        onContextMenu={(e) => e.preventDefault()}
        className="cert-protected relative z-20 py-12 sm:py-16 lg:py-24 border-t border-zinc-900 bg-black"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-6 sm:space-y-9 lg:space-y-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6">
            <div data-reveal="up" className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A5F] flex items-center gap-2">
                  <Award className="w-3.5 h-3.5" />
                  Verified Credentials
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-950 border border-zinc-800 text-[10px] font-mono font-semibold text-zinc-300">
                  <ShieldCheck className="w-3 h-3 text-[#FF5A5F]" />
                  Capture Protected
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Certificates & Accreditations
              </h2>
              <p className="text-sm text-zinc-400 max-w-xl">
                Official certifications, coursework achievements, and verified credentials in
                Cybersecurity, AI-Driven Development, and Professional Career Leadership.
              </p>
            </div>

            {/* Compact Slide Counter & Swipe Cue */}
            <div
              data-reveal="right"
              style={{ '--reveal-delay': '100ms' } as React.CSSProperties}
              className="inline-flex items-center gap-3 self-start md:self-auto px-3.5 py-2 rounded-full bg-zinc-950 border border-zinc-800/90 text-xs shrink-0"
            >
              <span className="font-mono font-bold text-white tabular-nums">
                {String(activeCertIndex + 1).padStart(2, '0')}
                <span className="text-zinc-600 font-normal">
                  {' '}
                  / {String(certificates.length).padStart(2, '0')}
                </span>
              </span>
              <span className="h-3.5 w-px bg-zinc-800" />
              <span className="text-zinc-400 font-medium inline-flex items-center gap-1">
                Swipe or slide
                <ArrowRight className="w-3 h-3 text-[#FF5A5F]" />
              </span>
            </div>
          </div>

          {/* Print Redaction Notice (only shown if someone tries Print / Save-as-PDF) */}
          <div className="cert-print-notice">
            Protected Credentials — Ar-jay Tabangin&apos;s certificates are restricted from printing and screenshot exports.
          </div>

          {/* Horizontal Swipeable / Slideable Certificates Track */}
          <div
            data-reveal="zoom"
            style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
            className="cert-no-print relative space-y-5"
          >
            {/* Anti-Screenshot / Capture Pure-Black Privacy Shield Overlay */}
            {isCertShielded && (
              <div
                role="alert"
                className="absolute inset-0 z-30 rounded-3xl bg-black border border-[#FF5A5F]/40 flex flex-col items-center justify-center p-6 text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/35 flex items-center justify-center text-[#FF5A5F]">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {certShieldReason === 'capture'
                      ? 'Screenshot & Capture Restricted'
                      : 'Protected Credential View Paused'}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {certShieldReason === 'capture'
                      ? 'Screen capture, printing, and saving are restricted to protect Ar-jay Tabangin’s official credentials.'
                      : 'Return focus to this window to continue viewing protected certificates.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCertShielded(false);
                    setCertShieldReason(null);
                  }}
                  className="px-4 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Resume View
                </button>
              </div>
            )}

            <div
              ref={certSliderRef}
              onScroll={handleCertScroll}
              aria-label="Certificates carousel"
              className={`relative flex items-stretch gap-4 sm:gap-5 lg:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 scroll-pl-4 sm:-mx-8 sm:px-8 sm:scroll-pl-8 lg:mx-0 lg:px-0 lg:scroll-pl-0 pt-2 pb-3 ${
                isCertShielded ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible'
              }`}
            >
              {certificates.map((cert, idx) => (
                <div
                  key={cert.id}
                  ref={(el) => {
                    certCardRefs.current[idx] = el;
                  }}
                  onMouseEnter={(e) => handleCertHoverStart(cert, e.currentTarget)}
                  onMouseLeave={handleCertHoverEnd}
                  onClick={() => {
                    clearCertHover();
                    setSelectedCertificate(cert);
                  }}
                  className="group relative snap-start shrink-0 w-[82vw] max-w-[345px] sm:w-[70vw] sm:max-w-[420px] md:w-[calc(54%-0.75rem)] lg:w-[calc(46%-0.75rem)] xl:w-[calc(42%-0.75rem)] 2xl:w-[calc(38%-0.75rem)] p-4 sm:p-5 rounded-3xl bg-zinc-950/80 hover:bg-zinc-900/90 border border-zinc-850 hover:border-[#FF5A5F]/75 hover:-translate-y-1.5 transition-[transform,border-color,background-color,box-shadow] duration-300 ease-out cursor-pointer shadow-lg hover:shadow-[0_20px_50px_-18px_rgba(255,90,95,0.28)] flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    {/* Certificate Thumbnail Preview (Watermarked + Capture-Blackout Protected) */}
                    <div
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                      className="cert-protected relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 select-none"
                    >
                      {!isCertShielded && (
                        <Image
                          src={cert.image}
                          alt={cert.title}
                          fill
                          unoptimized
                          draggable={false}
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out pointer-events-none"
                        />
                      )}
                      {/* Transparent anti-save / anti-long-press protective veil */}
                      <div
                        aria-hidden="true"
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                        className="absolute inset-0 z-10 bg-transparent"
                      />
                      <div className="absolute top-3 left-3 z-20 max-w-[85%] truncate px-2.5 py-1 rounded-full bg-black/90 text-[10px] font-mono font-bold text-[#FF5A5F] border border-zinc-800 pointer-events-none">
                        {cert.badge}
                      </div>
                      <div className="hidden lg:inline-flex items-center gap-1.5 absolute bottom-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/85 border border-[#FF5A5F]/50 text-[10px] font-semibold text-white opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-[opacity,transform] duration-200 pointer-events-none">
                        <Eye className="w-3 h-3 text-[#FF5A5F]" />
                        <span>Live Preview</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800 shrink-0">
                          {cert.date}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500 truncate">
                          {cert.credentialId}
                        </span>
                      </div>

                      <h3 className="font-bold text-white text-base group-hover:text-[#FF5A5F] transition-colors leading-snug">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-zinc-400 font-medium">{cert.issuer}</p>

                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                        {cert.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-900/80 flex items-center justify-between text-xs">
                    <span className="text-zinc-500 text-[11px] font-medium inline-flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#FF5A5F]" />
                      <span>View Only &bull; Protected</span>
                    </span>
                    <span className="text-[#FF5A5F] font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                      Preview <Eye className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Pagination Dots & Prev/Next Controls */}
            <div className="flex items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-2" role="tablist" aria-label="Certificate slides">
                {certificates.map((cert, idx) => {
                  const isActive = idx === activeCertIndex;
                  return (
                    <button
                      key={cert.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`View certificate ${idx + 1}: ${cert.title}`}
                      onClick={() => scrollToCertIndex(idx)}
                      className={`h-2 rounded-full transition-[width,background-color] duration-200 cursor-pointer ${
                        isActive
                          ? 'w-7 bg-[#FF5A5F]'
                          : 'w-2 bg-zinc-800 hover:bg-zinc-600'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => scrollCertBy(-1)}
                  disabled={!canScrollCertPrev}
                  aria-label="Previous certificate"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-zinc-950 border border-zinc-800 text-white hover:border-[#FF5A5F]/70 hover:text-[#FF5A5F] active:scale-95 disabled:opacity-30 disabled:hover:border-zinc-800 disabled:hover:text-white disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCertBy(1)}
                  disabled={!canScrollCertNext}
                  aria-label="Next certificate"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-zinc-950 border border-zinc-800 text-white hover:border-[#FF5A5F]/70 hover:text-[#FF5A5F] active:scale-95 disabled:opacity-30 disabled:hover:border-zinc-800 disabled:hover:text-white disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Certificate Credential Note */}
          <div
            data-reveal="up"
            className="p-5 rounded-2xl bg-zinc-950/60 border border-dashed border-zinc-800 text-center"
          >
            <p className="text-xs text-zinc-400">
              🔒 <strong>Verified &amp; Protected Credentials:</strong> All 7 credentials above are officially awarded to Ar-jay Tabangin and watermarked for data privacy. Hover over any card on desktop for a quick full preview, swipe or use the arrows to browse, or click any card to inspect details and request an official copy.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FEATURED WEBSITES & PROJECTS SECTION ("yung ibang nagawa naming website")*/}
      {/* ========================================================================= */}
      <section id="projects" className="relative z-20 py-12 sm:py-16 lg:py-24 border-t border-zinc-900 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-8 sm:space-y-11 lg:space-y-12">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div data-reveal="up" className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A5F] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Portfolio
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Websites & Applications We&apos;ve Built
              </h2>
              <p className="text-sm text-zinc-400 max-w-xl">
                Real-world web apps, modern e-commerce storefronts, and specialized Progressive Web
                Apps crafted with Next.js, TypeScript, and live cloud databases.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div
              data-reveal="right"
              style={{ '--reveal-delay': '100ms' } as React.CSSProperties}
              className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-900/90 border border-zinc-800 self-start sm:self-auto max-w-full overflow-x-auto no-scrollbar"
            >
              {(['ALL', 'WEB', 'PWA', 'UIUX'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${activeTab === tab
                    ? 'bg-[#FF5A5F] text-white shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                    }`}
                >
                  {tab === 'ALL'
                    ? 'All Projects'
                    : tab === 'WEB'
                      ? 'Websites'
                      : tab === 'PWA'
                        ? 'PWA Apps'
                        : 'UI/UX'}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id}
                data-reveal="zoom"
                style={{ '--reveal-delay': `${(idx % 2) * 100}ms` } as React.CSSProperties}
                className="group relative rounded-3xl bg-zinc-950/70 border border-zinc-850 hover:border-[#FF5A5F]/60 hover:-translate-y-1.5 overflow-hidden transition-[transform,border-color,box-shadow] duration-300 hover:shadow-2xl hover:shadow-rose-950/20 flex flex-col"
              >
                {/* Project Screenshot / Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/90 text-emerald-400 border border-emerald-500/30 backdrop-blur-xs">
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-mono font-bold text-[#FF5A5F]">
                        {project.type}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#FF5A5F] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Stack Tags & Actions */}
                  <div className="pt-3 border-t border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-lg bg-zinc-900 text-[11px] font-medium text-zinc-300 border border-zinc-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {project.link && project.link !== '#' && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FF5A5F]/15 hover:bg-[#FF5A5F]/25 text-[#FF5A5F] border border-[#FF5A5F]/30 text-xs font-bold transition-all"
                        >
                          <span>Live Site</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#FF5A5F] transition-colors cursor-pointer shrink-0"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#FF5A5F]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Projects Note */}
          <div
            data-reveal="up"
            className="p-5 rounded-2xl bg-zinc-950/60 border border-dashed border-zinc-800 text-center"
          >
            <p className="text-xs text-zinc-400">
              💡 <strong>Featured Work:</strong> Featuring Ar-jay&apos;s real platforms and systems, including the live <strong>EduScholar Scholarship System</strong> on Railway, <strong>Kusina Ordering App</strong>, <strong>Campus Navigator</strong>, and <strong>Sole Surgeon Atelier</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PHOTO EDITING & BEFORE/AFTER RETOUCHING SAMPLES                        */}
      {/* ========================================================================= */}
      <section id="edits" className="relative z-20 py-12 sm:py-16 lg:py-24 border-t border-zinc-900 bg-black overflow-hidden">
        {/* Subtle studio radial ambient (zero blur filter cost) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[820px] h-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,90,95,0.06)_0%,transparent_70%)]"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-8 sm:space-y-11 lg:space-y-12">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div data-reveal="up" className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A5F] flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Photo Editing &amp; Retouching Showcase
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Before &amp; After Edit Samples
              </h2>
              <p className="text-sm text-zinc-400 max-w-xl">
                Interactive product retouching &amp; restoration comparisons from the{' '}
                <strong className="text-zinc-200">Sole Surgeon Atelier</strong> archive. Watch the smooth
                auto-sweep transition, drag the divider, or toggle <strong className="text-zinc-200">Before / After</strong>{' '}
                to inspect every pixel.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div
              data-reveal="right"
              style={{ '--reveal-delay': '100ms' } as React.CSSProperties}
              className="flex flex-wrap lg:flex-nowrap items-center gap-1 p-1.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 self-start lg:self-auto lg:shrink-0"
            >
              {editCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveEditCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${activeEditCategory === cat
                    ? 'bg-[#FF5A5F] text-white shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                    }`}
                >
                  {cat === 'All' ? `All (${editSamples.length})` : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Before & After Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {filteredEdits.map((sample, idx) => {
              const isOddLastCard =
                filteredEdits.length % 2 === 1 && idx === filteredEdits.length - 1;
              return (
                <div
                  key={sample.id}
                  data-reveal="zoom"
                  style={{ '--reveal-delay': `${(idx % 2) * 100}ms` } as React.CSSProperties}
                  className={
                    isOddLastCard
                      ? 'md:col-span-2 md:max-w-[calc(50%-0.875rem)] md:mx-auto md:w-full'
                      : ''
                  }
                >
                  <BeforeAfterEditCard
                    title={sample.title}
                    subject={sample.subject}
                    category={sample.category}
                    beforeImage={sample.beforeImage}
                    afterImage={sample.afterImage}
                    editNotes={sample.editNotes}
                    techniques={sample.techniques}
                    delayOffsetMs={(idx % 4) * 450}
                    priority={idx < 2}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SKILLS & TECHNICAL ARSENAL                                             */}
      {/* ========================================================================= */}
      <section id="skills" className="relative z-20 py-12 sm:py-16 lg:py-24 border-t border-zinc-900 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-8 sm:space-y-11 lg:space-y-12">
          <div data-reveal="up" className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A5F]">
              Core Capabilities
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Skills & Engineering Stack
            </h2>
            <p className="text-sm text-zinc-400">
              The modern tools and technologies I use to architect lightning-fast, pixel-perfect
              applications, manage media editing, and provide client service excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
            {/* Frontend & Web Development */}
            <div
              data-reveal="up"
              style={{ '--reveal-delay': '0ms' } as React.CSSProperties}
              className="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-850 space-y-4 hover:border-zinc-700 hover:-translate-y-1.5 transition-[transform,border-color] duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-[#FF5A5F] flex items-center justify-center border border-rose-500/20">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Web & App Development</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Responsive layouts, Next.js App Router, client-side state, modern web architectures, and mobile PWA optimization.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'Git'].map(
                  (s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-xl bg-zinc-900 text-xs font-medium text-zinc-200 border border-zinc-800"
                    >
                      {s}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* UI/UX Design */}
            <div
              data-reveal="up"
              style={{ '--reveal-delay': '90ms' } as React.CSSProperties}
              className="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-850 space-y-4 hover:border-zinc-700 hover:-translate-y-1.5 transition-[transform,border-color] duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">UI/UX & Product Design</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                User research, high-fidelity wireframing, dark atelier aesthetics, typography hierarchy, and interactive prototypes.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  'Figma',
                  'Design Systems',
                  'Wireframing',
                  'Dark Theme UI',
                  'Prototyping',
                  'UX Research',
                ].map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-xl bg-zinc-900 text-xs font-medium text-zinc-200 border border-zinc-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Photo & Video Editing */}
            <div
              data-reveal="up"
              style={{ '--reveal-delay': '180ms' } as React.CSSProperties}
              className="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-850 space-y-4 hover:border-zinc-700 hover:-translate-y-1.5 transition-[transform,border-color] duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Photo & Video Editing</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Professional multimedia post-production, color grading, cinematic video editing, thumbnail design, and creative media assets.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  'Photoshop',
                  'Premiere Pro',
                  'After Effects',
                  'CapCut',
                  'Color Grading',
                  'Media Assets',
                ].map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-xl bg-zinc-900 text-xs font-medium text-zinc-200 border border-zinc-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Certified Customer Service */}
            <div
              data-reveal="up"
              style={{ '--reveal-delay': '270ms' } as React.CSSProperties}
              className="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-850 space-y-4 hover:border-zinc-700 hover:-translate-y-1.5 transition-[transform,border-color] duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Certified Customer Service</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Empathetic client communication, CRM ticket management, technical problem resolution, and client success delivery.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  'Customer Support',
                  'CRM & Helpdesk',
                  'Active Listening',
                  'Issue Escalation',
                  'Live Assistance',
                  'Client Success',
                ].map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-xl bg-zinc-900 text-xs font-medium text-zinc-200 border border-zinc-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CALL TO ACTION & FOOTER                                                */}
      {/* ========================================================================= */}
      <footer className="relative z-20 pt-14 sm:pt-16 pb-[max(3.5rem,calc(2.5rem+env(safe-area-inset-bottom)))] border-t border-zinc-900 bg-black">
        <div
          data-reveal="up"
          className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
        >
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 text-lg font-bold text-white">
              <span className="w-8 h-8 rounded-lg bg-zinc-950 border border-white/15 flex items-center justify-center p-1">
                <Image
                  src="/images/arjay-logo.png"
                  alt="Ar-jay AJ Monogram Logo"
                  width={24}
                  height={24}
                  unoptimized
                  className="w-full h-full object-contain"
                />
              </span>
              <span>Ar-jay Tabangin</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A5F]" />
            </div>
            <p className="text-xs text-zinc-500">
              &copy; 2026 Ar-jay Tabangin &bull; Developer, UI/UX Designer, Certified Customer Service &amp; Media Editor. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4">
            {/* Footer Social Links */}
            <div className="flex items-center gap-3 pr-2 text-zinc-400">
              <a
                href="https://www.facebook.com/share/1CstVHcQAw/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://github.com/tabanginarjay-sketch"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/jay.fowp?jplx=YjY0dzk2dzMycG9r&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/jay-t-a6bb1a217"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <span className="w-3.5 h-3.5 rounded bg-[#0A66C2] flex items-center justify-center text-[8px] font-bold text-white">
                  in
                </span>
              </a>
            </div>

            <button
              onClick={() => setIsChatModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#FF5A5F] hover:bg-[#FA5252] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Get in Touch
            </button>
            <a
              href="#hero"
              className="px-4 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-medium border border-zinc-800 transition-colors"
            >
              Back to Top ↑
            </a>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 7. INTERACTIVE "LET'S CHAT / HIRE ME" MODAL                               */}
      {/* ========================================================================= */}
      {isChatModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md modal-backdrop-anim"
          onClick={closeChatModal}
        >
          <div
            className="relative w-full max-w-lg max-h-[92dvh] overflow-y-auto rounded-3xl bg-zinc-950 border border-zinc-800 p-5 sm:p-8 shadow-2xl space-y-5 sm:space-y-6 modal-content-anim before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-[#FF5A5F] before:to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF5A5F] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Direct Consultation
                </span>
                <h3 className="text-2xl font-bold text-white">Let&apos;s Build Together</h3>
                <p className="text-xs text-zinc-400">
                  Send a direct message straight to Ar-jay&apos;s inbox (tabanginarjay@gmail.com).
                </p>
              </div>
              <button
                type="button"
                onClick={closeChatModal}
                aria-label="Close modal"
                className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {contactStatus === 'sent' ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xl font-bold text-white">Message Sent!</h4>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. Your inquiry has been sent to{' '}
                    <span className="text-zinc-200 font-medium">tabanginarjay@gmail.com</span>.
                    Ar-jay will get back to you shortly.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setContactStatus('idle')}
                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Send Another
                  </button>
                  <button
                    type="button"
                    onClick={closeChatModal}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#FF5A5F] to-[#FA5252] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <div className="space-y-1 text-left">
                  <label htmlFor="contact-name" className="font-bold text-zinc-300">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    disabled={contactStatus === 'sending'}
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF5A5F] transition-colors disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label htmlFor="contact-email" className="font-bold text-zinc-300">
                    Your Email Address
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    disabled={contactStatus === 'sending'}
                    placeholder="e.g. john@company.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF5A5F] transition-colors disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label htmlFor="contact-message" className="font-bold text-zinc-300">
                    Project Overview / Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    disabled={contactStatus === 'sending'}
                    placeholder="Tell me about the website, mobile app, or design you would like to build..."
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF5A5F] transition-colors resize-none disabled:opacity-60"
                  />
                </div>

                {contactStatus === 'error' && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 space-y-2 text-left">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-[#FF5A5F] shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-relaxed">{contactError}</p>
                    </div>
                    <a
                      href={buildGmailComposeHref()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-[11px] font-bold transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#FF5A5F]" />
                      <span>Open Pre-filled Gmail Instead</span>
                    </a>
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={buildGmailComposeHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#FF5A5F]" />
                    <span>tabanginarjay@gmail.com</span>
                  </a>

                  <button
                    type="submit"
                    disabled={contactStatus === 'sending'}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5A5F] to-[#FA5252] hover:brightness-110 text-white font-bold transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {contactStatus === 'sending' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. CERTIFICATE PREVIEW MODAL (CAPTURE-BLACKOUT PROTECTED)                 */}
      {/* ========================================================================= */}
      {selectedCertificate && (() => {
        const isCvPreview = selectedCertificate.id === 'cert-cv';
        return (
          <div
            onContextMenu={(e) => e.preventDefault()}
            className="cert-protected cert-no-print fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md modal-backdrop-anim"
            onClick={() => setSelectedCertificate(null)}
          >
            <div
              className="relative w-full max-w-3xl rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl space-y-4 sm:space-y-5 my-auto max-h-[92dvh] flex flex-col modal-content-anim before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-[#FF5A5F] before:to-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                className="cert-protected relative aspect-[4/3] sm:aspect-[16/10] max-h-[50dvh] sm:max-h-[56dvh] w-full bg-zinc-900/90 flex items-center justify-center p-3 select-none shrink-0"
              >
                {!isCertShielded ? (
                  <>
                    <Image
                      src={selectedCertificate.image}
                      alt={selectedCertificate.title}
                      fill
                      unoptimized
                      draggable={false}
                      className="object-contain p-2 pointer-events-none"
                    />
                    {/* Transparent anti-save / anti-long-press protective veil */}
                    <div
                      aria-hidden="true"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                      className="absolute inset-0 z-10 bg-transparent"
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 z-20 bg-black flex flex-col items-center justify-center p-6 text-center space-y-2.5">
                    <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/35 flex items-center justify-center text-[#FF5A5F]">
                      <Lock className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-white">
                      {certShieldReason === 'capture'
                        ? 'Screenshot & Capture Restricted'
                        : 'Protected Preview Paused'}
                    </p>
                    <p className="text-xs text-zinc-400 max-w-xs">
                      Screen capture, saving, and printing are restricted on Ar-jay&apos;s verified credentials.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedCertificate(null)}
                  aria-label="Close certificate preview"
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-black/80 border border-zinc-800 text-white hover:bg-zinc-900 transition-colors cursor-pointer z-30"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 sm:p-6 pt-0 space-y-3.5 sm:space-y-4 overflow-y-auto">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-[#FF5A5F] px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                      {selectedCertificate.credentialId}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {selectedCertificate.badge}
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-2xl font-bold text-white leading-snug">
                    {selectedCertificate.title}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {selectedCertificate.issuer} • Issued {selectedCertificate.date}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {selectedCertificate.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedCertificate.skills?.map((s: string) => (
                    <span
                      key={s}
                      className="px-2.5 py-0.5 rounded-lg bg-zinc-900 text-[11px] font-medium text-zinc-300 border border-zinc-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    {isCvPreview && selectedCertificate.pdfUrl ? (
                      <a
                        href={selectedCertificate.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF5A5F] to-[#FA5252] text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download / View CV PDF</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openCertCopyRequest(selectedCertificate.title)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF5A5F] to-[#FA5252] text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Request Official Copy</span>
                      </button>
                    )}
                    {selectedCertificate.verifyUrl && (
                      <a
                        href={selectedCertificate.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#FF5A5F]" />
                        <span>Online Verification</span>
                      </a>
                    )}
                    {!isCvPreview && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#FF5A5F]" />
                        <span>Capture Protected</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCertificate(null)}
                    className="px-5 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* 9. PROJECT DETAILS MODAL                                                 */}
      {/* ========================================================================= */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-xl max-h-[92dvh] overflow-y-auto rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl space-y-5 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full bg-zinc-900 shrink-0">
              <Image
                src={selectedProject.image}
                alt={selectedProject.title}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 pt-0 space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold text-[#FF5A5F]">
                  {selectedProject.type}
                </span>
                <h4 className="text-2xl font-bold text-white">{selectedProject.title}</h4>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {selectedProject.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedProject.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-lg bg-zinc-900 text-[11px] font-medium text-zinc-300 border border-zinc-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                <div>
                  {selectedProject.link && selectedProject.link !== '#' ? (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF5A5F] to-[#FA5252] text-white text-xs font-bold transition-all shadow-md active:scale-95 inline-flex items-center gap-1.5"
                    >
                      <span>Visit Live Platform</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-zinc-500 font-mono">
                      Status: {selectedProject.status}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. FLOATING HOVER CERTIFICATE SPOTLIGHT (DESKTOP QUICK-INSPECT PREVIEW)  */}
      {/* ========================================================================= */}
      {hoveredCert && !selectedCertificate && !isCertShielded && (
        <div
          key={hoveredCert.cert.id}
          aria-hidden="true"
          style={{ top: `${hoveredCert.top}px` }}
          className={`cert-spotlight-enter cert-protected cert-no-print hidden lg:block fixed z-40 w-[410px] xl:w-[445px] max-h-[calc(100vh-40px)] pointer-events-none ${
            hoveredCert.side === 'right' ? 'right-6 xl:right-10' : 'left-6 xl:left-10'
          }`}
        >
          <div className="rounded-3xl bg-zinc-950/95 border border-[#FF5A5F]/45 shadow-[0_30px_90px_-15px_rgba(0,0,0,0.95),0_0_40px_-12px_rgba(255,90,95,0.28)] overflow-hidden">
            {/* Top Status Strip */}
            <div className="px-4 py-2 bg-black/85 border-b border-zinc-800/90 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white">
                <span className="w-2 h-2 rounded-full bg-[#FF5A5F]" />
                Certificate Quick Preview
              </span>
              <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[200px]">
                {hoveredCert.cert.credentialId}
              </span>
            </div>

            {/* Full Uncropped Watermarked Certificate Image */}
            <div className="relative aspect-[16/10] w-full bg-zinc-900/95 p-2.5 select-none">
              <Image
                src={hoveredCert.cert.image}
                alt={hoveredCert.cert.title}
                fill
                unoptimized
                draggable={false}
                className="object-contain p-1.5 pointer-events-none"
              />
            </div>

            {/* Complete Untruncated Certificate Info */}
            <div className="p-4 space-y-2.5 border-t border-zinc-900 bg-zinc-950">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold text-[#FF5A5F] px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/25">
                  {hoveredCert.cert.badge}
                </span>
                <span className="text-[11px] font-mono text-zinc-400 shrink-0">
                  {hoveredCert.cert.date}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-white leading-snug">
                  {hoveredCert.cert.title}
                </h4>
                <p className="text-xs font-medium text-zinc-400">{hoveredCert.cert.issuer}</p>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                {hoveredCert.cert.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {hoveredCert.cert.skills?.map((skill: string) => (
                  <span
                    key={skill}
                    className="px-2.5 py-0.5 rounded-lg bg-zinc-900 text-[10px] font-medium text-zinc-200 border border-zinc-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="pt-2.5 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF5A5F]" />
                  <span>View Only &bull; Protected</span>
                </span>
                <span className="text-[#FF5A5F] font-semibold">Click card to inspect</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Circular Back-to-Top Button with Scroll Progress Ring */}
      <BackToTop />
    </div>
  );
}
