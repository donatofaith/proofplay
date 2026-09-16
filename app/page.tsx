"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Menu,
  Mic,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  X,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Pick a challenge",
    description:
      "Choose a short science, mathematics or reading challenge designed to reveal real understanding.",
    icon: Trophy,
    color: "bg-[#7857ff]",
  },
  {
    number: "02",
    title: "Explain it aloud",
    description:
      "Use your voice, an image or a demonstration to show how you reached your answer.",
    icon: Mic,
    color: "bg-[#29c7f5]",
  },
  {
    number: "03",
    title: "Create living proof",
    description:
      "ProofPlay turns the explanation into a Skill Card that records demonstrated understanding.",
    icon: Brain,
    color: "bg-[#ff9f43]",
  },
];

const proofPoints = [
  "What the learner demonstrated",
  "How clearly the idea was explained",
  "The level of support required",
  "Whether the learning was remembered later",
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#090a18] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-violet-600/25 blur-[140px]" />
        <div className="absolute -right-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-cyan-400/15 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-lime-300/10 blur-[140px]" />
        <div className="proof-grid absolute inset-0 opacity-[0.13]" />
      </div>

      <header className="relative z-40 border-b border-white/[0.07] bg-[#090a18]/75 backdrop-blur-xl">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="flex items-center gap-3 text-xl font-black tracking-tight text-white"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-300 text-[#090a18] shadow-[0_0_30px_rgba(190,242,100,0.2)]">
              <Sparkles size={20} strokeWidth={2.7} />
            </span>
            ProofPlay
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-sm font-bold text-slate-300 transition hover:text-white"
            >
              How it works
            </a>

            <a
              href="#proof-cards"
              className="text-sm font-bold text-slate-300 transition hover:text-white"
            >
              Skill Cards
            </a>

            <a
              href="#why-proofplay"
              className="text-sm font-bold text-slate-300 transition hover:text-white"
            >
              Why ProofPlay
            </a>
          </div>

          <div className="hidden md:block">
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-black text-white shadow-[0_12px_35px_rgba(124,58,237,0.28)] transition hover:-translate-y-0.5 hover:bg-violet-500"
            >
              Try ProofPlay
              <ArrowRight size={17} />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-label="Open navigation menu"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white md:hidden"
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="border-t border-white/[0.07] bg-[#101224] px-5 py-5 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-bold text-slate-200 hover:bg-white/[0.05]"
              >
                How it works
              </a>

              <a
                href="#proof-cards"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-bold text-slate-200 hover:bg-white/[0.05]"
              >
                Skill Cards
              </a>

              <a
                href="#why-proofplay"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-bold text-slate-200 hover:bg-white/[0.05]"
              >
                Why ProofPlay
              </a>

              <Link
                href="/dashboard"
                className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-black text-white"
              >
                Try ProofPlay
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        )}
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
            <Sparkles size={15} />
            Learning you can actually prove
          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[5.2rem]">
            Don’t just finish it.
            <span className="mt-2 block text-lime-300">
              Show you understand it.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            ProofPlay helps young learners explain, demonstrate and remember
            what they learn—then turns each learning moment into evidence that
            grows with them.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-7 text-base font-black text-white shadow-[0_18px_50px_rgba(124,58,237,0.32)] transition hover:-translate-y-1 hover:bg-violet-500"
            >
              Try ProofPlay
              <ArrowRight size={20} />
            </Link>

            <button
              type="button"
              onClick={() => setVideoOpen(true)}
              className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-white/12 bg-white/[0.05] px-7 text-base font-black text-white transition hover:border-cyan-300/35 hover:bg-white/[0.09]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300 text-[#090a18]">
                <Play size={14} fill="currentColor" />
              </span>
              See how it works
            </button>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-lime-300" />
              No account required
            </span>

            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-lime-300" />
              Voice-powered explanations
            </span>

            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-lime-300" />
              Memory checks
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[32rem]">
          <div className="absolute -left-8 top-14 h-24 w-24 rounded-full bg-[#ff9f43] opacity-60 blur-3xl" />
          <div className="absolute -right-8 bottom-16 h-24 w-24 rounded-full bg-cyan-400 opacity-60 blur-3xl" />

          <div className="relative rotate-2 rounded-[2.5rem] border border-white/10 bg-[#16182d] p-4 shadow-[0_35px_90px_rgba(0,0,0,0.4)] transition duration-500 hover:rotate-0">
            <div className="rounded-[2rem] border border-white/[0.08] bg-[#0d0f20] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-lime-300/12 px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.15em] text-lime-300">
                  Living Skill Card
                </span>

                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white">
                  <Star size={18} fill="currentColor" />
                </span>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 text-[#090a18] shadow-[0_15px_35px_rgba(34,211,238,0.2)]">
                  <Brain size={30} strokeWidth={2.3} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                    Science
                  </p>
                  <h2 className="mt-1 text-2xl font-black tracking-tight">
                    Water Cycle Explorer
                  </h2>
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-5">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-cyan-300">
                  Demonstrated understanding
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Clearly explained how water changes through evaporation,
                  condensation and precipitation using an original example.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-violet-600 p-4">
                  <p className="text-xs font-bold text-violet-100">
                    Explanation
                  </p>
                  <p className="mt-2 text-2xl font-black">Clear</p>
                </div>

                <div className="rounded-2xl bg-[#ff9f43] p-4 text-[#211307]">
                  <p className="text-xs font-bold opacity-70">
                    Support needed
                  </p>
                  <p className="mt-2 text-2xl font-black">Light</p>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Memory strength</span>
                  <span className="text-lime-300">Strong</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                  <div className="h-full w-[86%] rounded-full bg-lime-300" />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-7 -left-5 rounded-2xl border border-white/10 bg-[#1c1e35]/95 px-4 py-3 shadow-xl backdrop-blur-xl sm:-left-10">
            <p className="text-xs font-bold text-slate-400">Proof captured</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-black text-white">
              <ShieldCheck size={17} className="text-lime-300" />
              Understanding verified
            </p>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="relative z-10 border-y border-white/[0.07] bg-white/[0.025] py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
              How it works
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Learning becomes something you can see.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-400">
              ProofPlay focuses on how a learner thinks, explains and remembers,
              not only whether a task was completed.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="group rounded-[2rem] border border-white/[0.08] bg-[#14162a] p-6 transition duration-300 hover:-translate-y-2 hover:border-white/20 sm:p-8"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`flex h-13 w-13 h-[3.25rem] items-center justify-center rounded-2xl ${step.color}`}
                    >
                      <Icon size={23} />
                    </span>

                    <span className="text-sm font-black text-slate-600">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-8 text-2xl font-black tracking-tight">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="proof-cards"
        className="relative z-10 mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:items-center lg:px-10"
      >
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-lime-300">
            Living Skill Cards
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">
            Proof of understanding—not just proof of completion.
          </h2>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-400">
            Every Skill Card preserves the learner’s explanation and records
            what was demonstrated. It continues growing through future Memory
            Checks.
          </p>

          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center gap-2 text-sm font-black text-cyan-300 transition hover:gap-3 hover:text-cyan-200"
          >
            Create your first Skill Card
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid gap-4">
          {proofPoints.map((point, index) => (
            <div
              key={point}
              className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#14162a] p-5"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                  index === 0
                    ? "bg-violet-600"
                    : index === 1
                      ? "bg-cyan-300 text-[#090a18]"
                      : index === 2
                        ? "bg-[#ff9f43] text-[#211307]"
                        : "bg-lime-300 text-[#101607]"
                }`}
              >
                0{index + 1}
              </span>

              <p className="font-bold text-slate-200">{point}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="why-proofplay"
        className="relative z-10 mx-5 mb-20 overflow-hidden rounded-[2.5rem] border border-violet-400/20 bg-violet-600 px-6 py-16 sm:mx-8 sm:px-10 lg:mx-auto lg:max-w-7xl lg:px-16"
      >
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-300/25 blur-[80px]" />
        <div className="absolute -bottom-28 left-1/4 h-72 w-72 rounded-full bg-lime-300/20 blur-[90px]" />

        <div className="relative flex flex-col items-start justify-between gap-9 lg:flex-row lg:items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-100">
              Ready to prove what you know?
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] sm:text-5xl">
              Make learning visible.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-violet-100">
              Start with a short challenge, explain your thinking and watch
              ProofPlay transform the moment into evidence.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-2xl bg-lime-300 px-7 text-base font-black text-[#11150a] shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:bg-lime-200"
          >
            Start a challenge
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-black text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-lime-300 text-[#090a18]">
              <Sparkles size={16} />
            </span>
            ProofPlay
          </Link>

          <p className="text-sm text-slate-500">
            Learning evidence that grows with every challenge.
          </p>
        </div>
      </footer>

      {videoOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5 backdrop-blur-md"
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[#15172a] p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                  ProofPlay demo
                </p>

                <h2
                  id="demo-title"
                  className="mt-2 text-3xl font-black tracking-tight"
                >
                  Understanding becomes visible
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setVideoOpen(false)}
                aria-label="Close demonstration"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Challenge",
                  value: "The learner chooses something to explain.",
                  color: "bg-violet-600",
                },
                {
                  label: "Voice proof",
                  value: "Their spoken explanation becomes editable text.",
                  color: "bg-cyan-300 text-[#09141a]",
                },
                {
                  label: "Skill Card",
                  value: "The evidence becomes a living learning record.",
                  color: "bg-lime-300 text-[#11150a]",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-2xl p-5 ${item.color}`}
                >
                  <p className="text-sm font-black">{item.label}</p>
                  <p className="mt-3 text-sm leading-6 opacity-80">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard"
              className="mt-7 flex h-13 h-[3.25rem] w-full items-center justify-center gap-2 rounded-2xl bg-white text-sm font-black text-[#0b0c19] transition hover:bg-slate-100"
            >
              Try the live experience
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}