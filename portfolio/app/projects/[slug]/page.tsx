import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowLeft,
  ExternalLink,
  Code2,
  Layers,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Calendar,
  Briefcase,
  Globe,
} from 'lucide-react';
import { PROJECTS_DATA } from '@/data/projectsData';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return PROJECTS_DATA.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS_DATA.find((p) => p.slug === slug);
  if (!project) return { title: 'Project Case Study | Ar-jay Tabangin' };

  return {
    title: `${project.title} - Case Study | Ar-jay Tabangin`,
    description: project.overview,
  };
}

export default async function ProjectCaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = PROJECTS_DATA.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Related projects (excluding current)
  const relatedProjects = PROJECTS_DATA.filter((p) => p.slug !== slug);

  return (
    <div className="min-h-screen bg-black text-zinc-100 antialiased selection:bg-[#FF5A5F]/30 selection:text-[#FF5A5F]">
      {/* Top Floating Navigation Bar */}
      <header className="sticky top-0 z-50 bg-black/85 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#FF5A5F]" />
            <span>Back to Portfolio</span>
          </Link>

          <div className="flex items-center gap-3">
            {project.link && project.link !== '#' && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FF5A5F] to-[#FA5252] text-white text-xs font-bold transition-all shadow-md hover:scale-105 active:scale-95"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Case Study Article */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
        {/* Header Hero */}
        <section className="space-y-4 sm:space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-900 text-[#FF5A5F] border border-zinc-800">
              {project.category} CASE STUDY
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
              {project.status}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 max-w-3xl leading-relaxed">
            {project.subtitle}
          </p>

          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-900">
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-850">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block">My Role</span>
              <span className="text-xs sm:text-sm font-semibold text-white mt-1 block">
                {project.role}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-850">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block">Timeline</span>
              <span className="text-xs sm:text-sm font-semibold text-white mt-1 block">
                {project.period}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-850">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block">Category</span>
              <span className="text-xs sm:text-sm font-semibold text-white mt-1 block">
                {project.type}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-850">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block">Live Platform</span>
              <span className="text-xs sm:text-sm font-semibold text-emerald-400 mt-1 block truncate">
                {project.status}
              </span>
            </div>
          </div>
        </section>

        {/* Hero Screenshot Showcase */}
        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl relative aspect-[16/10] w-full">
          <Image
            src={project.image}
            alt={`${project.title} live interface preview`}
            fill
            priority
            className="object-cover"
          />
        </section>

        {/* Problem vs Solution Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-850 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-[#FF5A5F]" />
              <span>The Problem</span>
            </div>
            <h2 className="text-xl font-bold text-white">Challenge Statement</h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {project.problemStatement}
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-850 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>The Solution</span>
            </div>
            <h2 className="text-xl font-bold text-white">Engineered Outcome</h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {project.solutionSummary}
            </p>
          </div>
        </section>

        {/* Key Features */}
        <section className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5A5F]">
              Capabilities
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Key Engineered Features
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.features.map((feat, idx) => (
              <div
                key={feat.title}
                className="p-5 sm:p-6 rounded-3xl bg-zinc-950 border border-zinc-850 space-y-2 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#FF5A5F]/10 text-[#FF5A5F] flex items-center justify-center text-xs font-bold font-mono">
                    {idx + 1}
                  </span>
                  <h3 className="text-base font-bold text-white">{feat.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pl-8">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture & Tech Stack */}
        <section className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5A5F]">
              Engineering Architecture
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              System Layers &amp; Tech Stack
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.architecture.map((arch) => (
              <div
                key={arch.layer}
                className="p-5 rounded-3xl bg-zinc-950 border border-zinc-850 space-y-2"
              >
                <span className="text-[11px] font-mono font-bold uppercase text-[#FF5A5F]">
                  {arch.layer}
                </span>
                <h3 className="text-base font-bold text-white">{arch.tech}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{arch.purpose}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Decisions */}
        <section className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5A5F]">
              Technical Rationale
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Architectural Decisions
            </h2>
          </div>

          <div className="space-y-4">
            {project.technicalDecisions.map((item) => (
              <div
                key={item.decision}
                className="p-5 sm:p-6 rounded-3xl bg-zinc-950 border border-zinc-850 space-y-1.5"
              >
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{item.decision}</span>
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pl-6">
                  {item.rationale}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Engineering Challenges & Solutions */}
        <section className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5A5F]">
              Problem Solving
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Challenges &amp; Solutions
            </h2>
          </div>

          <div className="space-y-4">
            {project.challengesAndSolutions.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-zinc-950 border border-zinc-850 space-y-3"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-rose-400">
                    Challenge
                  </span>
                  <h3 className="text-base font-bold text-white">{item.challenge}</h3>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">
                    Solution Implemented
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {item.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Learnings */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" />
            <span>Key Takeaways</span>
          </div>
          <h2 className="text-xl font-bold text-white">What I Learned From Building This System</h2>
          <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
            {project.keyLearnings.map((learn, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A5F] mt-2 shrink-0" />
                <span>{learn}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA Bar */}
        <section className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF5A5F]" />
            <span>Explore Other Projects</span>
          </Link>

          <div className="flex items-center gap-3">
            {project.link && project.link !== '#' && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF5A5F] to-[#FA5252] text-white text-xs font-bold shadow-lg shadow-rose-950/40 hover:scale-105 active:scale-95 transition-all"
              >
                <span>Launch Live System</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <Link
              href="/#contact"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold border border-zinc-800 transition-colors"
            >
              <span>Discuss This Project</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
