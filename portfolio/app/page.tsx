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
} from 'lucide-react';
import SmokeAtmosphere from '../components/SmokeAtmosphere';
import GeometricShapes from '../components/GeometricShapes';
import BeforeAfterEditCard from '../components/BeforeAfterEditCard';

export default function PortfolioPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'WEB' | 'PWA' | 'UIUX'>('ALL');
  const [activeEditCategory, setActiveEditCategory] = useState<string>('All');
  const [selectedCertificate, setSelectedCertificate] = useState<any | null>(null);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // Horizontal Certificates Carousel state & refs
  const certSliderRef = useRef<HTMLDivElement | null>(null);
  const certCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const certScrollRafRef = useRef<number | null>(null);
  const [activeCertIndex, setActiveCertIndex] = useState(0);
  const [canScrollCertPrev, setCanScrollCertPrev] = useState(false);
  const [canScrollCertNext, setCanScrollCertNext] = useState(true);

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

  const buildMailtoHref = () => {
    const subject = encodeURIComponent(
      `Portfolio Inquiry from ${contactName.trim() || 'Website Visitor'}`
    );
    const body = encodeURIComponent(
      `Name: ${contactName.trim()}\nEmail: ${contactEmail.trim()}\n\nMessage:\n${contactMessage.trim()}`
    );
    return `mailto:tabanginarjay@gmail.com?subject=${subject}&body=${body}`;
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
      image: '/images/thumb_photo-1513350027966-f016e1adcecd.jpg',
      link: 'https://eduscholar-production.up.railway.app/',
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
      image: '/images/thumb_photo-1584125073721-71adc0702886.jpg',
      link: '#',
      github: '#',
      status: 'Production PWA',
    },
  ];

  // Official Certificates & Accreditations (All 7 verified certifications)
  const certificates = [
    {
      id: 'cert-1',
      title: 'Introduction to Cybersecurity',
      issuer: 'Cisco Networking Academy',
      date: 'October 29, 2026',
      credentialId: 'CISCO-COURSE-COMPLETION',
      badge: 'Cisco Verified',
      pdfUrl: '/certificates/cisco_cybersecurity.pdf',
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
      pdfUrl: '/certificates/dict_cybersecurity.pdf',
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
      pdfUrl: '/certificates/aidev_fundamentals.pdf',
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
      pdfUrl: '/certificates/bcp_marketing_me.pdf',
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

  const handleCertScroll = useCallback(() => {
    if (certScrollRafRef.current !== null) return;
    certScrollRafRef.current = window.requestAnimationFrame(() => {
      certScrollRafRef.current = null;
      syncCertSliderState();
    });
  }, [syncCertSliderState]);

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
    <div className="relative min-h-screen bg-[#000000] text-white selection:bg-[#FF5A5F]/30 selection:text-[#FF5A5F]">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER NAVIGATION (Matching the Reference Screenshot)             */}
      {/* ========================================================================= */}
      <header className="relative z-50 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-7 flex items-center justify-between">
        {/* Brand Logo & Email Link */}
        <div className="flex items-center gap-6 sm:gap-10">
          <a
            href="#"
            className="group flex items-center gap-2.5 sm:gap-3 text-xl sm:text-2xl font-bold tracking-tight text-white"
            aria-label="Ar-jay Home"
          >
            <span className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-950 border border-white/15 group-hover:border-[#FF5A5F]/60 flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(255,90,95,0.12)] group-hover:shadow-[0_0_24px_rgba(255,90,95,0.3)] transition-all duration-300">
              <Image
                src="/images/arjay-logo.png"
                alt="Ar-jay AJ Monogram Logo"
                width={32}
                height={32}
                priority
                unoptimized
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </span>
            <span className="flex items-center gap-1.5">
              <span className="tracking-tight">Ar-jay</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A5F] group-hover:scale-150 transition-transform" />
            </span>
          </a>

          <a
            href="mailto:tabanginarjay@gmail.com"
            className="hidden sm:inline-block text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors"
          >
            tabanginarjay@gmail.com
          </a>
        </div>

        {/* Right Menu Hamburger Button */}
        <div className="flex items-center gap-4">
          <a
            href="mailto:tabanginarjay@gmail.com"
            className="sm:hidden text-xs text-zinc-400 hover:text-white"
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

      {/* Slide-out / Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col justify-center items-center p-8 space-y-6 animate-in fade-in duration-200">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-8 right-8 p-3 text-zinc-400 hover:text-white"
          >
            <X className="w-8 h-8" />
          </button>
          <nav className="text-center space-y-6 text-2xl font-bold">
            <a
              href="#hero"
              onClick={() => setIsMenuOpen(false)}
              className="block text-zinc-400 hover:text-[#FF5A5F] transition-colors"
            >
              Home
            </a>
            <a
              href="#experience"
              onClick={() => setIsMenuOpen(false)}
              className="block text-zinc-400 hover:text-[#FF5A5F] transition-colors"
            >
              Experience &amp; Education
            </a>
            <a
              href="#certificates"
              onClick={() => setIsMenuOpen(false)}
              className="block text-zinc-400 hover:text-[#FF5A5F] transition-colors"
            >
              Certificates
            </a>
            <a
              href="#projects"
              onClick={() => setIsMenuOpen(false)}
              className="block text-zinc-400 hover:text-[#FF5A5F] transition-colors"
            >
              Featured Websites
            </a>
            <a
              href="#edits"
              onClick={() => setIsMenuOpen(false)}
              className="block text-zinc-400 hover:text-[#FF5A5F] transition-colors"
            >
              Photo Edit Samples
            </a>
            <a
              href="#skills"
              onClick={() => setIsMenuOpen(false)}
              className="block text-zinc-400 hover:text-[#FF5A5F] transition-colors"
            >
              Skills & Tech Stack
            </a>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsChatModalOpen(true);
              }}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#FF5A5F] to-[#FA5252] text-white text-lg font-bold shadow-lg shadow-rose-900/40 hover:scale-105 transition-all"
            >
              Let&apos;s Chat 💬
            </button>
          </nav>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. HERO SECTION (High-Fidelity Match to Reference Image)                  */}
      {/* ========================================================================= */}
      <section
        id="hero"
        className="relative w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-12 pt-0 sm:pt-2 lg:pt-4 pb-16 lg:pb-20 lg:min-h-[85vh] flex flex-col justify-between overflow-hidden"
      >
        {/* Subtle, non-intrusive ethereal smoke transition effect behind content */}
        <SmokeAtmosphere />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5 lg:gap-10 items-center relative z-20">
          {/* ----------------- LEFT COLUMN: HEADING & CTA ----------------- */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-5 lg:space-y-6 text-left order-2 lg:order-1 pt-0 relative z-30">
            <div className="space-y-1">
              <h1 className="font-serif text-[42px] sm:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] lg:leading-[1.1]">
                Hi, <br />
                I&apos;m <span className="text-[#FF5A5F]">Ar-jay</span>
              </h1>
              <div className="pt-1.5 lg:pt-2 space-y-0.5 lg:space-y-1">
                <p className="text-white text-base sm:text-xl font-semibold tracking-wide">
                  Developer &amp; UI/UX Designer
                </p>
                <p className="text-zinc-400 text-xs sm:text-base font-medium">
                  Certified Customer Service &bull; Photo/Video Editor
                </p>
              </div>
            </div>

            {/* Hire Me CTA Button matching the reference pill */}
            <div className="pt-1 lg:pt-2">
              <button
                type="button"
                onClick={() => setIsChatModalOpen(true)}
                className="group inline-flex items-center gap-3 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-gradient-to-r from-[#FF5A5F] to-[#FA5252] text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-900/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Hire Me</span>
                <span className="p-1 rounded-full bg-white/20 group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </span>
              </button>
            </div>

            {/* Left Social Links */}
            <div className="pt-3 sm:pt-5 lg:pt-8 flex flex-col space-y-3 lg:space-y-4">
              <div className="flex items-center gap-5 text-zinc-400">
                <a
                  href="https://www.facebook.com/share/1CstVHcQAw/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-sm font-bold font-serif"
                  aria-label="Facebook"
                >
                  f
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
                className="group inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
              >
                <span className="w-4 h-4 rounded-full bg-[#0A66C2] flex items-center justify-center text-[9px] font-bold text-white group-hover:scale-110 transition-transform">
                  in
                </span>
                <span>www.linkedin.com/in/jay-t-a6bb1a217</span>
              </a>
            </div>
          </div>

          {/* ----------------- CENTER COLUMN: PORTRAIT IMAGE ----------------- */}
          <div className="lg:col-span-4 flex items-center justify-center order-1 lg:order-2 relative">
            {/* Zero-cost radial studio backlight halo (pure gradients, zero heavy CSS blur filters!) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-8 lg:-inset-12 flex items-center justify-center"
            >
              <div className="w-[280px] h-[340px] sm:w-[340px] sm:h-[420px] lg:w-[440px] lg:h-[520px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,244,234,0.08)_0%,rgba(255,90,95,0.04)_36%,rgba(34,211,238,0.025)_56%,transparent_72%)] -translate-y-6 lg:-translate-y-8" />
            </div>

            {/* True transparent portrait PNG — compact & balanced on iOS/Android, editorial scale on desktop */}
            <div className="relative w-[228px] sm:w-[275px] md:w-[330px] lg:w-[430px] aspect-[482/744] max-h-[355px] sm:max-h-[430px] lg:max-h-[640px] -mt-1 -mb-16 sm:-mb-20 lg:mt-0 lg:mb-0 select-none">
              <Image
                src="/images/arjay-portrait-hero.png?v=6"
                alt="Ar-jay Tabangin - Developer & UI/UX Designer"
                fill
                priority
                unoptimized
                className="object-contain object-top"
              />
            </div>
          </div>

          {/* ----------------- RIGHT COLUMN: EXPERTISE & GEOMETRIC ACCENT ----------------- */}
          <div className="lg:col-span-4 space-y-6 text-left order-3 relative mt-8 lg:mt-0">
            {/* Dynamic floating geometric shapes with independent multi-directional drift & mouse parallax */}
            <GeometricShapes />

            <div className="space-y-3">
              <span className="text-[#FF5A5F] text-xs font-bold uppercase tracking-wider block">
                Expert on
              </span>

              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Based in Philippines <br />
                developer and <br />
                UI/UX designer, <br />
                certified customer service, <br />
                Photo/Video editor.
              </h2>

              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm pt-1">
                Versatile creator building modern web applications, designing user-centered interfaces,
                delivering certified client support, and producing compelling photo &amp; video media.
              </p>
            </div>

            {/* Download CV Link & Quick Preview */}
            <div className="pt-2 flex items-center gap-5">
              <a
                href="/Ar-jay_Tabangin_CV.pdf"
                download="Ar-jay_Tabangin_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#FF5A5F] hover:text-rose-400 text-sm font-bold border-b border-[#FF5A5F] pb-0.5 transition-colors group cursor-pointer"
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
                className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <Eye className="w-3 h-3 text-zinc-500" />
                <span>Quick Preview</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Floating "Let's Chat" Pill (Above SmokeAtmosphere z-10 fade) */}
        <div className="relative z-30 w-full flex justify-end pt-8 sm:pt-4">
          <button
            type="button"
            onClick={() => setIsChatModalOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-950/90 hover:bg-zinc-900 border border-zinc-800 text-xs font-bold text-white transition-all shadow-lg hover:border-[#FF5A5F]/60 active:scale-95 cursor-pointer"
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
      <section id="experience" className="relative z-20 py-24 border-t border-zinc-900 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 space-y-14">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-2">
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-[#FF5A5F] flex items-center justify-center border border-rose-500/20">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Work Experience</h3>
                  <p className="text-xs text-zinc-400">Creative Design, Media Editing &amp; Corporate Client Support</p>
                </div>
              </div>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-[7px] before:top-3 before:bottom-3 before:w-px before:bg-gradient-to-b before:from-[#FF5A5F] before:via-zinc-800 before:to-transparent">
                {workExperience.map((exp) => (
                  <div
                    key={exp.id}
                    className="relative group p-6 rounded-3xl bg-zinc-950/85 hover:bg-zinc-900/80 border border-zinc-850 hover:border-[#FF5A5F]/40 transition-all shadow-lg space-y-3.5"
                  >
                    {/* Timeline Node Dot */}
                    <span
                      className={`absolute -left-[25px] sm:-left-[33px] top-7 w-3.5 h-3.5 rounded-full border-2 border-black ${exp.current
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
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Education</h3>
                    <p className="text-xs text-zinc-400">Academic Background &amp; Schools Attended</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {educationHistory.map((edu) => (
                    <div
                      key={edu.id}
                      className="p-5 rounded-3xl bg-zinc-950/85 hover:bg-zinc-900/80 border border-zinc-850 hover:border-cyan-500/35 transition-all space-y-2"
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
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Achievements &amp; Awards</h3>
                    <p className="text-xs text-zinc-400">Recognition &amp; Creative Honors</p>
                  </div>
                </div>

                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-zinc-950 via-zinc-950 to-amber-950/15 border border-amber-500/20 space-y-4 shadow-xl">
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
      {/* 4. CERTIFICATES & CREDENTIALS SECTION                                     */}
      {/* ========================================================================= */}
      <section id="certificates" className="relative z-20 py-16 sm:py-24 border-t border-zinc-900 bg-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 space-y-7 sm:space-y-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A5F] flex items-center gap-2">
                <Award className="w-3.5 h-3.5" />
                Verified Credentials
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Certificates & Accreditations
              </h2>
              <p className="text-sm text-zinc-400 max-w-xl">
                Official certifications, coursework achievements, and verified credentials in
                Cybersecurity, AI-Driven Development, and Professional Career Leadership.
              </p>
            </div>

            {/* Compact Slide Counter & Swipe Cue */}
            <div className="inline-flex items-center gap-3 self-start md:self-auto px-3.5 py-2 rounded-full bg-zinc-950 border border-zinc-800/90 text-xs">
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

          {/* Horizontal Swipeable / Slideable Certificates Track */}
          <div className="space-y-5">
            <div
              ref={certSliderRef}
              onScroll={handleCertScroll}
              aria-label="Certificates carousel"
              className="relative flex items-stretch gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar -mx-6 px-6 scroll-pl-6 sm:-mx-10 sm:px-10 sm:scroll-pl-10 lg:mx-0 lg:px-0 lg:scroll-pl-0 pb-2"
            >
              {certificates.map((cert, idx) => (
                <div
                  key={cert.id}
                  ref={(el) => {
                    certCardRefs.current[idx] = el;
                  }}
                  onClick={() => setSelectedCertificate(cert)}
                  className="group relative snap-start shrink-0 w-[80vw] max-w-[360px] sm:w-[70vw] sm:max-w-[440px] md:w-[calc(50%-0.75rem)] lg:w-[calc(44%-0.75rem)] p-4 sm:p-5 rounded-3xl bg-zinc-950/80 hover:bg-zinc-900/90 border border-zinc-850 hover:border-[#FF5A5F]/60 transition-colors cursor-pointer shadow-lg hover:shadow-2xl flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    {/* Certificate Thumbnail Preview */}
                    <div
                      onContextMenu={(e) => e.preventDefault()}
                      className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 select-none"
                    >
                      <Image
                        src={cert.image}
                        alt={cert.title}
                        fill
                        unoptimized
                        draggable={false}
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/90 text-[10px] font-mono font-bold text-[#FF5A5F] border border-zinc-800">
                        {cert.badge}
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
                    {cert.pdfUrl ? (
                      <a
                        href={cert.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-zinc-400 hover:text-white text-[11px] font-medium inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3 h-3 text-[#FF5A5F]" />
                        <span>Original PDF</span>
                      </a>
                    ) : (
                      <span className="text-zinc-500 text-[11px] font-medium inline-flex items-center gap-1.5">
                        <Award className="w-3 h-3 text-[#FF5A5F]" />
                        <span>Verified Certificate</span>
                      </span>
                    )}
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
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-dashed border-zinc-800 text-center">
            <p className="text-xs text-zinc-400">
              📜 <strong>Verified Credentials:</strong> All 7 credentials above are officially awarded by Cisco Networking Academy, DICT Region VIII, AI Dev PH, Bestlink College of the Philippines, Jobs180, and Concentrix / Anthem. Swipe or use the arrows to browse, and click any card to preview the protected certificate.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FEATURED WEBSITES & PROJECTS SECTION ("yung ibang nagawa naming website")*/}
      {/* ========================================================================= */}
      <section id="projects" className="relative z-20 py-24 border-t border-zinc-900 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 space-y-12">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-2">
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
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-900/90 border border-zinc-800 self-start sm:self-auto overflow-x-auto">
              {(['ALL', 'WEB', 'PWA', 'UIUX'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === tab
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
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative rounded-3xl bg-zinc-950/70 border border-zinc-850 hover:border-[#FF5A5F]/60 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-rose-950/20 flex flex-col"
              >
                {/* Project Screenshot / Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/90 text-emerald-400 border border-emerald-500/30">
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
            ))}
          </div>

          {/* Featured Projects Note */}
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-dashed border-zinc-800 text-center">
            <p className="text-xs text-zinc-400">
              💡 <strong>Featured Work:</strong> Featuring Ar-jay&apos;s real platforms and systems, including the live <strong>EduScholar Scholarship System</strong> on Railway, <strong>Kusina Ordering App</strong>, <strong>Campus Navigator</strong>, and <strong>Sole Surgeon Atelier</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PHOTO EDITING & BEFORE/AFTER RETOUCHING SAMPLES                        */}
      {/* ========================================================================= */}
      <section id="edits" className="relative z-20 py-24 border-t border-zinc-900 bg-black overflow-hidden">
        {/* Subtle studio radial ambient (zero blur filter cost) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[820px] h-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,90,95,0.06)_0%,transparent_70%)]"
        />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 space-y-12">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
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
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-1 p-1.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 self-start lg:self-auto lg:shrink-0">
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
      <section id="skills" className="relative z-20 py-24 border-t border-zinc-900 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Frontend & Web Development */}
            <div className="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-850 space-y-4 hover:border-zinc-700 transition-colors">
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
            <div className="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-850 space-y-4 hover:border-zinc-700 transition-colors">
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
            <div className="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-850 space-y-4 hover:border-zinc-700 transition-colors">
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
            <div className="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-850 space-y-4 hover:border-zinc-700 transition-colors">
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
      <footer className="relative z-20 py-16 border-t border-zinc-900 bg-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
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
                className="hover:text-white transition-colors text-xs font-bold font-serif"
                aria-label="Facebook"
              >
                f
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
          onClick={closeChatModal}
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6"
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
                      href={buildMailtoHref()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-[11px] font-bold transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#FF5A5F]" />
                      <span>Open Pre-filled Email App Instead</span>
                    </a>
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={buildMailtoHref()}
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
      {/* 8. CERTIFICATE PREVIEW MODAL                                              */}
      {/* ========================================================================= */}
      {selectedCertificate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedCertificate(null)}
        >
          <div
            className="relative w-full max-w-3xl rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl space-y-5 my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              onContextMenu={(e) => e.preventDefault()}
              className="relative aspect-[4/3] sm:aspect-[16/10] max-h-[58vh] w-full bg-zinc-900/90 flex items-center justify-center p-3 select-none"
            >
              <Image
                src={selectedCertificate.image}
                alt={selectedCertificate.title}
                fill
                unoptimized
                className="object-contain p-2 pointer-events-none"
              />
              <button
                onClick={() => setSelectedCertificate(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 pt-0 space-y-4 overflow-y-auto">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-[#FF5A5F] px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                    {selectedCertificate.credentialId}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {selectedCertificate.badge}
                  </span>
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-white leading-snug">{selectedCertificate.title}</h4>
                <p className="text-xs text-zinc-400">{selectedCertificate.issuer} • Issued {selectedCertificate.date}</p>
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
                <div className="flex flex-wrap items-center gap-3">
                  {selectedCertificate.pdfUrl && (
                    <a
                      href={selectedCertificate.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF5A5F] to-[#FA5252] text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download / View PDF</span>
                    </a>
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
                  <a
                    href={selectedCertificate.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-400 hover:text-white transition-colors underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View Full Image</span>
                  </a>
                </div>

                <button
                  onClick={() => setSelectedCertificate(null)}
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
      {/* 9. PROJECT DETAILS MODAL                                                 */}
      {/* ========================================================================= */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-xl rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full bg-zinc-900">
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
    </div>
  );
}
