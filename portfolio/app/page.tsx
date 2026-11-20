'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
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
} from 'lucide-react';

export default function PortfolioPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'WEB' | 'PWA' | 'UIUX'>('ALL');
  const [selectedCertificate, setSelectedCertificate] = useState<any | null>(null);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // Projects data (Ready for user to customize & drop actual websites)
  const projects = [
    {
      id: 'proj-1',
      title: 'Sole Surgeon Atelier & Storefront',
      category: 'WEB',
      type: 'Full-Stack E-Commerce & Service Portal',
      description:
        'A precision footwear restoration atelier e-commerce and booking application with live Airtable integration, order intake, and dynamic cart.',
      tags: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Airtable API', 'Lucide'],
      image: '/images/thumb_photo-1542120178-984cbcccff94.jpg',
      link: '#',
      github: '#',
      status: 'Live & Operational',
    },
    {
      id: 'proj-2',
      title: 'Sole Surgeon Worker Portal (PCS)',
      category: 'PWA',
      type: 'Progressive Web App (PWA)',
      description:
        'A specialized shop-floor Production Control System for technicians to manage sequential restoration batches with strict backend locking guards.',
      tags: ['PWA', 'Next.js 15', 'TypeScript', 'Airtable REST', 'Web Manifest'],
      image: '/images/thumb_photo-1584125073721-71adc0702886.jpg',
      link: '#',
      github: '#',
      status: 'Exam Verified (100% Tests Passed)',
    },
    {
      id: 'proj-3',
      title: 'Dark Atelier UI / Design System',
      category: 'UIUX',
      type: 'Design System & Component Library',
      description:
        'A dark luxury glassmorphism design system inspired by editorial studio layouts, featuring micro-interactions, KaTeX math rendering, and vector icons.',
      tags: ['UI/UX', 'Figma', 'Tailwind v4', 'Glassmorphism'],
      image: '/images/thumb_photo-1521097472625-419f0a4bbb6d.jpg',
      link: '#',
      github: '#',
      status: 'Design Prototype',
    },
    {
      id: 'proj-4',
      title: 'SaaS Analytics & Client Portal',
      category: 'WEB',
      type: 'Web Application',
      description:
        'A modern responsive analytics portal with real-time data visualizers, role-based authentication, and automated reporting pipelines.',
      tags: ['React', 'Next.js', 'PostgreSQL', 'Prisma', 'Tailwind'],
      image: '/images/thumb_photo-1513350027966-f016e1adcecd.jpg',
      link: '#',
      github: '#',
      status: 'Client Production',
    },
  ];

  // Certificates placeholder data (Ready for user to drop their certificates)
  const certificates = [
    {
      id: 'cert-1',
      title: 'Full Stack Web Development & Modern Frameworks',
      issuer: 'Professional Technical Accreditation',
      date: '2026',
      credentialId: 'CERT-FS-2026-0914',
      badge: 'Verified Developer',
      description:
        'Comprehensive certification covering Next.js, React, TypeScript, state orchestration, serverless APIs, and relational databases.',
      skills: ['Next.js', 'React', 'TypeScript', 'RESTful APIs', 'Git'],
      image: '/images/thumb_photo-1606890542599-2ac4eb58c5f1.jpg',
    },
    {
      id: 'cert-2',
      title: 'User Interface & User Experience (UI/UX) Design',
      issuer: 'Human-Computer Interaction Institute',
      date: '2025',
      credentialId: 'CERT-UIUX-8842',
      badge: 'Certified UI/UX',
      description:
        'Specialization in wireframing, high-fidelity interactive prototyping, design systems, accessibility guidelines, and user psychology.',
      skills: ['Figma', 'Design Systems', 'Micro-Interactions', 'Prototyping'],
      image: '/images/thumb_photo-1517015901815-ad0932fb389e.jpg',
    },
    {
      id: 'cert-3',
      title: 'Database Architecture & Backend Systems',
      issuer: 'Software Engineering Council',
      date: '2025',
      credentialId: 'CERT-DB-5519',
      badge: 'Database Architect',
      description:
        'Database modeling, PostgreSQL schema optimization, query planning, ORM configurations, and third-party SaaS integrations.',
      skills: ['PostgreSQL', 'Prisma ORM', 'Database Normalization', 'API Security'],
      image: '/images/thumb_photo-1533145862815-f4059758ae5f.jpg',
    },
    {
      id: 'cert-4',
      title: 'Progressive Web Apps (PWA) & Mobile Engineering',
      issuer: 'Web Standards Organization',
      date: '2026',
      credentialId: 'CERT-PWA-3301',
      badge: 'PWA Specialist',
      description:
        'Building offline-capable, responsive mobile web applications utilizing Web App Manifests, service workers, and responsive breakpoints.',
      skills: ['PWA Manifest', 'Service Workers', 'Mobile-First Design'],
      image: '/images/thumb_photo-1623684225794-a8f1f5037f5c.jpg',
    },
  ];

  const filteredProjects =
    activeTab === 'ALL' ? projects : projects.filter((p) => p.category === activeTab);

  return (
    <div className="relative min-h-screen bg-[#000000] text-white selection:bg-[#FF5A5F]/30 selection:text-[#FF5A5F]">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER NAVIGATION (Matching the Reference Screenshot)             */}
      {/* ========================================================================= */}
      <header className="relative z-50 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-7 flex items-center justify-between">
        {/* Brand Logo & Email Link */}
        <div className="flex items-center gap-6 sm:gap-10">
          <a href="#" className="group flex items-center gap-1.5 text-xl sm:text-2xl font-bold tracking-tight text-white">
            <span>Ar-jay</span>
            {/* Playful accent dot/graphic matching reference */}
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A5F] group-hover:scale-150 transition-transform" />
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
              href="#projects"
              onClick={() => setIsMenuOpen(false)}
              className="block text-zinc-400 hover:text-[#FF5A5F] transition-colors"
            >
              Featured Websites
            </a>
            <a
              href="#certificates"
              onClick={() => setIsMenuOpen(false)}
              className="block text-zinc-400 hover:text-[#FF5A5F] transition-colors"
            >
              Certificates
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
        className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-4 pb-20 lg:min-h-[85vh] flex flex-col justify-between"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-20">
          {/* ----------------- LEFT COLUMN: HEADING & CTA ----------------- */}
          <div className="lg:col-span-4 space-y-6 text-left order-2 lg:order-1 pt-6 lg:pt-0">
            <div className="space-y-1">
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                Hi, <br />
                I&apos;m <span className="text-[#FF5A5F]">Ar-jay</span>
              </h1>
              <p className="text-zinc-300 text-lg sm:text-xl font-medium tracking-wide pt-2">
                User Interface Designer
              </p>
            </div>

            {/* Hire Me CTA Button matching the reference pill */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsChatModalOpen(true)}
                className="group inline-flex items-center gap-3 px-7 py-3 rounded-full bg-gradient-to-r from-[#FF5A5F] to-[#FA5252] text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-900/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Hire Me</span>
                <span className="p-1 rounded-full bg-white/20 group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </span>
              </button>
            </div>

            {/* Left Social Links */}
            <div className="pt-8 flex flex-col space-y-4">
              <div className="flex items-center gap-5 text-zinc-400">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-sm font-bold font-serif"
                  aria-label="Facebook"
                >
                  f
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-xs font-bold"
                  aria-label="Twitter"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
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

              {/* Dribbble Link with Pink Basketball Badge */}
              <a
                href="https://dribbble.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
              >
                <span className="w-4 h-4 rounded-full bg-[#EA4C89] flex items-center justify-center text-[10px] text-white">
                  🏀
                </span>
                <span>www.dribbble.com/arjay</span>
              </a>
            </div>
          </div>

          {/* ----------------- CENTER COLUMN: PORTRAIT IMAGE ----------------- */}
          <div className="lg:col-span-4 flex items-center justify-center order-1 lg:order-2 relative">
            {/* Ambient Shadow glow to blend with pure black */}
            <div className="absolute inset-0 bg-radial from-zinc-800/10 via-black/80 to-black pointer-events-none z-10" />

            <div className="relative w-72 sm:w-84 md:w-96 lg:w-[420px] aspect-[3/4] max-h-[580px] overflow-hidden">
              <Image
                src="/images/hero-portrait.jpg"
                alt="Developer & Designer Portrait"
                fill
                priority
                className="object-cover object-center filter contrast-105"
              />
              {/* Bottom & Edge Fade Mask so dark clothing seamlessly disappears into the black background */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
              <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black to-transparent z-10" />
              <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black to-transparent z-10" />
            </div>
          </div>

          {/* ----------------- RIGHT COLUMN: EXPERTISE & GEOMETRIC ACCENT ----------------- */}
          <div className="lg:col-span-4 space-y-6 text-left order-3 relative">
            {/* Geometric floating rings matching the reference */}
            <div className="relative h-20 w-44 mb-2">
              {/* Cyan / Teal glowing ring */}
              <div className="absolute top-0 right-16 w-14 h-14 rounded-full border-2 border-[#22D3EE] shadow-[0_0_20px_rgba(34,211,238,0.35)]" />
              {/* Coral smaller interlocking ring */}
              <div className="absolute top-2 right-12 w-8 h-8 rounded-full border-2 border-[#FF5A5F]" />
              {/* Cyan solid floating sphere */}
              <div className="absolute top-10 right-4 w-6 h-6 rounded-full bg-[#00E5FF] shadow-[0_0_16px_rgba(0,229,255,0.6)]" />
            </div>

            <div className="space-y-3">
              <span className="text-[#FF5A5F] text-xs font-bold uppercase tracking-wider block">
                Expert on
              </span>

              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Based in Philippines <br />
                i&apos;m developer and <br />
                UI/UX designer.
              </h2>

              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm pt-1">
                Hey are looking for designer to build your brand and grow your business? let&apos;s
                shake hands with me.
              </p>
            </div>

            {/* Download CV Link */}
            <div className="pt-2">
              <a
                href="#contact"
                onClick={() => setIsChatModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-[#FF5A5F] hover:text-rose-400 text-sm font-bold border-b border-[#FF5A5F] pb-0.5 transition-colors group cursor-pointer"
              >
                <span>Download CV</span>
                <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Floating "Let's Chat" Pill (Matching Reference) */}
        <div className="w-full flex justify-end pt-10 sm:pt-4">
          <button
            onClick={() => setIsChatModalOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800 text-xs font-bold text-white transition-all shadow-lg hover:border-[#FF5A5F]/50 cursor-pointer"
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
      {/* 3. FEATURED WEBSITES & PROJECTS SECTION ("yung ibang nagawa naming website")*/}
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab
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
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
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

          {/* Interactive Project Drop Note */}
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-dashed border-zinc-800 text-center">
            <p className="text-xs text-zinc-400">
              💡 <strong>Ready for your actual websites:</strong> Drop your live links, GitHub repos, or screenshots anytime. We will link your actual projects directly here!
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CERTIFICATES & CREDENTIALS SECTION ("mga certificates ko")             */}
      {/* ========================================================================= */}
      <section id="certificates" className="relative z-20 py-24 border-t border-zinc-900 bg-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 space-y-12">
          {/* Section Header */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A5F] flex items-center gap-2">
              <Award className="w-3.5 h-3.5" />
              Verified Credentials
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Certificates & Accreditations
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl">
              Official certifications, coursework achievements, and verified competencies in Full
              Stack Engineering, UI/UX architecture, and modern web frameworks.
            </p>
          </div>

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setSelectedCertificate(cert)}
                className="group relative p-6 rounded-3xl bg-zinc-950/80 hover:bg-zinc-900/90 border border-zinc-850 hover:border-[#FF5A5F]/60 transition-all cursor-pointer shadow-lg hover:shadow-2xl flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 rounded-2xl bg-zinc-900 text-[#FF5A5F] border border-zinc-800 group-hover:scale-110 transition-transform">
                      <Award className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {cert.date}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-[#FF5A5F] transition-colors leading-snug">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 font-medium">{cert.issuer}</p>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                    {cert.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-900/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-zinc-400">{cert.credentialId}</span>
                  <span className="text-[#FF5A5F] font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    Preview <Eye className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Certificate Drop Note */}
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-dashed border-zinc-800 text-center">
            <p className="text-xs text-zinc-400">
              📜 <strong>Ready for your actual certificates:</strong> Kapag na-drop mo na ang photos/PDFs ng certificates mo mamaya, agad nating ilalagay dito ang high-resolution previews at verified credential links!
            </p>
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
              applications from design to deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Frontend */}
            <div className="p-7 rounded-3xl bg-zinc-950/80 border border-zinc-850 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-[#FF5A5F] flex items-center justify-center border border-rose-500/20">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Frontend Architecture</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Responsive layouts, App Router, micro-interactions, client-side state, and mobile PWA
                performance optimization.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'PWA Manifest', 'HTML5/CSS3'].map(
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
            <div className="p-7 rounded-3xl bg-zinc-950/80 border border-zinc-850 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">UI/UX & Product Design</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                User research, high-fidelity wireframing, dark atelier aesthetics, typography
                hierarchy, and interactive user journeys.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  'Figma',
                  'Design Systems',
                  'Wireframing',
                  'Dark Theme UI',
                  'Prototyping',
                  'Accessibility',
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

            {/* Backend & Databases */}
            <div className="p-7 rounded-3xl bg-zinc-950/80 border border-zinc-850 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Backend & Integrations</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                RESTful API endpoints, strict backend validation guards, schema normalization, and
                cloud database synchronizations.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  'Node.js',
                  'PostgreSQL',
                  'Prisma ORM',
                  'Airtable REST API',
                  'Git / GitHub',
                  'Vercel',
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
            <div className="flex items-center justify-center sm:justify-start gap-2 text-lg font-bold text-white">
              <span>Ar-jay Tabangin</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A5F]" />
            </div>
            <p className="text-xs text-zinc-500">
              © 2026 Ar-jay Tabangin • Full Stack Developer & UI/UX Designer. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-4">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div
            className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF5A5F] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Direct Consultation
                </span>
                <h3 className="text-2xl font-bold text-white">Let&apos;s Build Together</h3>
                <p className="text-xs text-zinc-400">
                  Ready to collaborate on your brand, website, or custom application?
                </p>
              </div>
              <button
                onClick={() => setIsChatModalOpen(false)}
                className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you! Your message has been prepared. You can also reach out directly via email.');
                setIsChatModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div className="space-y-1 text-left">
                <label className="font-bold text-zinc-300">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF5A5F] transition-colors"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="font-bold text-zinc-300">Your Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@company.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF5A5F] transition-colors"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="font-bold text-zinc-300">Project Overview / Scope</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell me about the website, mobile app, or design you would like to build..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF5A5F] transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <a
                  href="mailto:tabanginarjay@gmail.com"
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#FF5A5F]" />
                  <span>tabanginarjay@gmail.com</span>
                </a>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5A5F] to-[#FA5252] text-white font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Send Message</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. CERTIFICATE PREVIEW MODAL                                              */}
      {/* ========================================================================= */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div
            className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full bg-zinc-900">
              <Image
                src={selectedCertificate.image}
                alt={selectedCertificate.title}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setSelectedCertificate(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 pt-0 space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold text-[#FF5A5F]">
                  Credential ID: {selectedCertificate.credentialId}
                </span>
                <h4 className="text-xl font-bold text-white">{selectedCertificate.title}</h4>
                <p className="text-xs text-zinc-400">{selectedCertificate.issuer} • Issued {selectedCertificate.date}</p>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                {selectedCertificate.description}
              </p>

              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="px-5 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
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
                <span className="text-xs text-zinc-500">
                  Ready to link your actual GitHub repo or live domain
                </span>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-colors"
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
