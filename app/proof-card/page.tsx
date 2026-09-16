"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Brain,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Download,
  FileText,
  Lightbulb,
  Mic,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
} from "lucide-react";

type StoredCard = Record<string, unknown>;

type ProofCard = {
  id: string;
  title: string;
  subject: string;
  transcript: string;
  demonstratedSkill: string;
  explanationQuality: string;
  supportLevel: string;
  memoryStatus: string;
  memoryScore: number | null;
  createdAt: string;
};

function textValue(
  card: StoredCard,
  possibleKeys: string[],
  fallback: string
) {
  for (const key of possibleKeys) {
    const value = card[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return fallback;
}

function numberValue(card: StoredCard, possibleKeys: string[]) {
  for (const key of possibleKeys) {
    const value = card[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim()) {
      const convertedValue = Number(value);

      if (Number.isFinite(convertedValue)) {
        return convertedValue;
      }
    }
  }

  return null;
}

function normaliseCard(card: StoredCard, index: number): ProofCard {
  return {
    id: textValue(
      card,
      ["id", "cardId"],
      `proof-card-${index}-${Date.now()}`
    ),

    title: textValue(
      card,
      ["title", "challengeTitle", "challenge", "skillTitle"],
      "Learning Challenge"
    ),

    subject: textValue(
      card,
      ["subject", "category"],
      "General Learning"
    ),

    transcript: textValue(
      card,
      ["transcript", "explanation", "learnerResponse", "response"],
      "The learner completed the challenge and demonstrated their understanding."
    ),

    demonstratedSkill: textValue(
      card,
      [
        "demonstratedSkill",
        "skill",
        "summary",
        "understanding",
        "feedback",
      ],
      "The learner explained the main idea using their own words and examples."
    ),

    explanationQuality: textValue(
      card,
      ["explanationQuality", "clarity", "quality"],
      "Developing"
    ),

    supportLevel: textValue(
      card,
      ["supportLevel", "support", "helpRequired"],
      "Light support"
    ),

    memoryStatus: textValue(
      card,
      ["memoryStatus", "memoryStrength", "remembered"],
      "Not checked yet"
    ),

    memoryScore: numberValue(card, [
      "memoryScore",
      "score",
      "memoryCheckScore",
    ]),

    createdAt: textValue(
      card,
      ["createdAt", "date", "completedAt"],
      new Date().toISOString()
    ),
  };
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently completed";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getSubjectColor(subject: string) {
  const lowerSubject = subject.toLowerCase();

  if (lowerSubject.includes("science")) {
    return {
      badge: "bg-cyan-300/10 text-cyan-300 border-cyan-300/25",
      icon: "bg-cyan-300 text-[#07151a]",
      gradient: "from-cyan-300 to-blue-500",
    };
  }

  if (
    lowerSubject.includes("math") ||
    lowerSubject.includes("number")
  ) {
    return {
      badge: "bg-violet-400/10 text-violet-300 border-violet-400/25",
      icon: "bg-violet-600 text-white",
      gradient: "from-violet-500 to-purple-700",
    };
  }

  if (
    lowerSubject.includes("reading") ||
    lowerSubject.includes("english")
  ) {
    return {
      badge: "bg-[#ff9f43]/10 text-[#ffb66f] border-[#ff9f43]/25",
      icon: "bg-[#ff9f43] text-[#211307]",
      gradient: "from-[#ff9f43] to-[#ff6b5f]",
    };
  }

  return {
    badge: "bg-lime-300/10 text-lime-300 border-lime-300/25",
    icon: "bg-lime-300 text-[#101607]",
    gradient: "from-lime-300 to-emerald-400",
  };
}

export default function ProofCardPage() {
  const [cards, setCards] = useState<ProofCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedCards = localStorage.getItem("proofplay-skill-cards");

      if (!savedCards) {
        setCards([]);
        setIsLoading(false);
        return;
      }

      const parsedCards: unknown = JSON.parse(savedCards);

      if (!Array.isArray(parsedCards)) {
        setCards([]);
        setIsLoading(false);
        return;
      }

      const normalisedCards = parsedCards
        .filter(
          (card): card is StoredCard =>
            typeof card === "object" && card !== null
        )
        .map(normaliseCard)
        .reverse();

      setCards(normalisedCards);

      if (normalisedCards.length > 0) {
        setSelectedCardId(normalisedCards[0].id);
      }
    } catch {
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectedCard = useMemo(() => {
    return (
      cards.find((card) => card.id === selectedCardId) ??
      cards[0] ??
      null
    );
  }, [cards, selectedCardId]);

  function handleDownload() {
    window.print();
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090a18] text-white">
        <div className="text-center">
          <Sparkles
            size={30}
            className="mx-auto animate-pulse text-lime-300"
          />
          <p className="mt-4 text-sm font-bold text-slate-400">
            Preparing your Proof Card...
          </p>
        </div>
      </main>
    );
  }

  if (!selectedCard) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090a18] px-5 text-white">
        <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#15172a] p-8 text-center shadow-2xl">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/15 text-violet-300">
            <Award size={30} />
          </span>

          <h1 className="mt-6 text-3xl font-black tracking-tight">
            No Proof Card yet
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            Complete a challenge and save its Skill Card first. Your
            downloadable proof will then appear here automatically.
          </p>

          <Link
            href="/dashboard"
            className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 text-sm font-black text-white transition hover:bg-violet-500"
          >
            <RotateCcw size={17} />
            Complete a challenge
          </Link>
        </div>
      </main>
    );
  }

  const colors = getSubjectColor(selectedCard.subject);

  return (
    <main className="min-h-screen bg-[#090a18] text-white print:bg-white print:text-[#111827]">
      <div className="pointer-events-none fixed inset-0 print:hidden">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-violet-600/20 blur-[130px]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-300/15 blur-[130px]" />
        <div className="proof-grid absolute inset-0 opacity-[0.12]" />
      </div>

      <header className="relative z-10 border-b border-white/[0.07] bg-[#090a18]/80 backdrop-blur-xl print:hidden">
        <div className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <Link
            href="/skills"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Skill Cards
          </Link>

          <div className="flex items-center gap-3">
            {cards.length > 1 && (
              <div className="relative">
                <select
                  aria-label="Select a Proof Card"
                  value={selectedCard.id}
                  onChange={(event) =>
                    setSelectedCardId(event.target.value)
                  }
                  className="h-11 appearance-none rounded-xl border border-white/10 bg-[#15172a] pl-4 pr-10 text-sm font-bold text-white outline-none transition focus:border-cyan-300/50"
                >
                  {cards.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.title}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            )}

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-lime-300 px-4 text-sm font-black text-[#11150a] transition hover:bg-lime-200"
            >
              <Download size={17} />
              Save as PDF
            </button>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16 print:max-w-none print:p-0">
        <div className="mb-7 print:hidden">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
            Demonstrated learning evidence
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Your Proof Card
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            Download or print this card as evidence of what was understood,
            explained and remembered.
          </p>
        </div>

        <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#14162a] shadow-[0_35px_100px_rgba(0,0,0,0.4)] print:rounded-none print:border-2 print:border-slate-200 print:bg-white print:shadow-none">
          <div
            className={`h-3 bg-gradient-to-r ${colors.gradient}`}
          />

          <div className="p-6 sm:p-9 lg:p-11 print:p-10">
            <div className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-start sm:justify-between print:border-slate-200">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-300 text-[#101607]">
                    <Sparkles size={21} strokeWidth={2.7} />
                  </span>

                  <div>
                    <p className="text-xl font-black tracking-tight print:text-slate-950">
                      ProofPlay
                    </p>

                    <p className="text-xs font-semibold text-slate-500">
                      Living learning evidence
                    </p>
                  </div>
                </div>
              </div>

              <div className="sm:text-right">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] ${colors.badge}`}
                >
                  <ShieldCheck size={14} />
                  Proof of understanding
                </span>

                <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500 sm:justify-end">
                  <CalendarDays size={14} />
                  {formatDate(selectedCard.createdAt)}
                </p>
              </div>
            </div>

            <div className="mt-9">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <span
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${colors.icon}`}
                >
                  <Brain size={30} strokeWidth={2.2} />
                </span>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.17em] text-slate-500">
                    {selectedCard.subject}
                  </p>

                  <h2 className="mt-2 text-3xl font-black tracking-[-0.035em] sm:text-4xl print:text-slate-950">
                    {selectedCard.title}
                  </h2>
                </div>
              </div>
            </div>

            <div className="mt-9 rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.06] p-6 print:border-cyan-200 print:bg-cyan-50">
              <div className="flex items-center gap-2 text-cyan-300 print:text-cyan-700">
                <Target size={18} />

                <h3 className="text-xs font-black uppercase tracking-[0.16em]">
                  Demonstrated understanding
                </h3>
              </div>

              <p className="mt-4 text-base font-semibold leading-8 text-slate-200 print:text-slate-800">
                {selectedCard.demonstratedSkill}
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 print:border-slate-200 print:bg-slate-50">
                <Lightbulb
                  size={20}
                  className="text-violet-300 print:text-violet-600"
                />

                <p className="mt-4 text-xs font-bold uppercase tracking-[0.13em] text-slate-500">
                  Explanation
                </p>

                <p className="mt-2 text-lg font-black print:text-slate-950">
                  {selectedCard.explanationQuality}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 print:border-slate-200 print:bg-slate-50">
                <Star
                  size={20}
                  className="text-[#ffad5c] print:text-orange-500"
                />

                <p className="mt-4 text-xs font-bold uppercase tracking-[0.13em] text-slate-500">
                  Support
                </p>

                <p className="mt-2 text-lg font-black print:text-slate-950">
                  {selectedCard.supportLevel}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 print:border-slate-200 print:bg-slate-50">
                <CheckCircle2
                  size={20}
                  className="text-lime-300 print:text-emerald-600"
                />

                <p className="mt-4 text-xs font-bold uppercase tracking-[0.13em] text-slate-500">
                  Memory
                </p>

                <p className="mt-2 text-lg font-black print:text-slate-950">
                  {selectedCard.memoryScore !== null
                    ? `${selectedCard.memoryScore}%`
                    : selectedCard.memoryStatus}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-white/[0.08] bg-[#0d0f20] p-6 print:border-slate-200 print:bg-white">
              <div className="flex items-center gap-2">
                <Mic
                  size={18}
                  className="text-cyan-300 print:text-cyan-700"
                />

                <h3 className="text-xs font-black uppercase tracking-[0.16em] text-slate-400 print:text-slate-600">
                  Learner’s explanation
                </h3>
              </div>

              <blockquote className="mt-4 border-l-2 border-cyan-300 pl-5 text-sm leading-7 text-slate-300 print:text-slate-700">
                “{selectedCard.transcript}”
              </blockquote>
            </div>

            <div className="mt-9 flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-end sm:justify-between print:border-slate-200">
              <div className="flex items-center gap-3">
                <Award
                  size={26}
                  className="text-lime-300 print:text-emerald-600"
                />

                <div>
                  <p className="text-sm font-black print:text-slate-950">
                    Evidence generated by ProofPlay
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    This card records demonstrated learning, not attendance.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <FileText size={15} />
                Card ID: {selectedCard.id.slice(0, 12)}
              </div>
            </div>
          </div>
        </article>

        <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-5 py-4 text-sm leading-6 text-slate-400 print:hidden">
          <strong className="text-white">To download:</strong> select{" "}
          <strong className="text-white">Save as PDF</strong>, then choose{" "}
          <strong className="text-white">Save as PDF</strong> in your browser’s
          print window.
        </div>
      </section>
    </main>
  );
}