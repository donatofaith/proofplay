"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Brain,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  Medal,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

type StoredCard = Record<string, unknown>;

type SkillCard = {
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

function getText(
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

function getNumber(card: StoredCard, possibleKeys: string[]) {
  for (const key of possibleKeys) {
    const value = card[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim()) {
      const numberValue = Number(value);

      if (Number.isFinite(numberValue)) {
        return numberValue;
      }
    }
  }

  return null;
}

function normaliseCard(card: StoredCard, index: number): SkillCard {
  return {
    id: getText(card, ["id", "cardId"], `skill-card-${index}`),

    title: getText(
      card,
      ["title", "challengeTitle", "challenge", "skillTitle"],
      "Learning Challenge"
    ),

    subject: getText(
      card,
      ["subject", "category"],
      "General Learning"
    ),

    transcript: getText(
      card,
      ["transcript", "explanation", "learnerResponse", "response"],
      "No spoken explanation was saved for this challenge."
    ),

    demonstratedSkill: getText(
      card,
      [
        "demonstratedSkill",
        "skill",
        "summary",
        "understanding",
        "feedback",
      ],
      "The learner completed the challenge and demonstrated their understanding."
    ),

    explanationQuality: getText(
      card,
      ["explanationQuality", "clarity", "quality"],
      "Developing"
    ),

    supportLevel: getText(
      card,
      ["supportLevel", "support", "helpRequired"],
      "Light support"
    ),

    memoryStatus: getText(
      card,
      ["memoryStatus", "memoryStrength", "remembered"],
      "Not checked yet"
    ),

    memoryScore: getNumber(card, [
      "memoryScore",
      "score",
      "memoryCheckScore",
    ]),

    createdAt: getText(
      card,
      ["createdAt", "date", "completedAt"],
      new Date().toISOString()
    ),
  };
}

function formatDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getSubjectDesign(subject: string) {
  const lowerSubject = subject.toLowerCase();

  if (lowerSubject.includes("science")) {
    return {
      icon: FlaskConical,
      iconStyle: "bg-cyan-300 text-[#07151a]",
      badgeStyle:
        "border-cyan-300/20 bg-cyan-300/10 text-cyan-300",
      glowStyle: "group-hover:shadow-cyan-400/10",
    };
  }

  if (
    lowerSubject.includes("math") ||
    lowerSubject.includes("number")
  ) {
    return {
      icon: Brain,
      iconStyle: "bg-violet-600 text-white",
      badgeStyle:
        "border-violet-400/20 bg-violet-400/10 text-violet-300",
      glowStyle: "group-hover:shadow-violet-500/10",
    };
  }

  if (
    lowerSubject.includes("reading") ||
    lowerSubject.includes("english")
  ) {
    return {
      icon: BookOpen,
      iconStyle: "bg-[#ff9f43] text-[#211307]",
      badgeStyle:
        "border-[#ff9f43]/20 bg-[#ff9f43]/10 text-[#ffb66f]",
      glowStyle: "group-hover:shadow-orange-400/10",
    };
  }

  return {
    icon: GraduationCap,
    iconStyle: "bg-lime-300 text-[#101607]",
    badgeStyle:
      "border-lime-300/20 bg-lime-300/10 text-lime-300",
    glowStyle: "group-hover:shadow-lime-300/10",
  };
}

export default function SkillsPage() {
  const [cards, setCards] = useState<SkillCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<SkillCard | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  function loadCards() {
    try {
      const savedCards = localStorage.getItem("proofplay-skill-cards");

      if (!savedCards) {
        setCards([]);
        return;
      }

      const parsedCards: unknown = JSON.parse(savedCards);

      if (!Array.isArray(parsedCards)) {
        setCards([]);
        return;
      }

      const normalisedCards = parsedCards
        .filter(
          (card): card is StoredCard =>
            typeof card === "object" && card !== null
        )
        .map(normaliseCard)
        .sort((firstCard, secondCard) => {
          return (
            new Date(secondCard.createdAt).getTime() -
            new Date(firstCard.createdAt).getTime()
          );
        });

      setCards(normalisedCards);
    } catch {
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCards();
  }, []);

  const subjects = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(cards.map((card) => card.subject))),
    ];
  }, [cards]);

  const filteredCards = useMemo(() => {
    const cleanSearch = searchQuery.trim().toLowerCase();

    return cards.filter((card) => {
      const matchesSubject =
        subjectFilter === "All" || card.subject === subjectFilter;

      const matchesSearch =
        !cleanSearch ||
        card.title.toLowerCase().includes(cleanSearch) ||
        card.subject.toLowerCase().includes(cleanSearch) ||
        card.demonstratedSkill.toLowerCase().includes(cleanSearch);

      return matchesSubject && matchesSearch;
    });
  }, [cards, searchQuery, subjectFilter]);

  const completedMemoryChecks = cards.filter(
    (card) =>
      card.memoryScore !== null ||
      !card.memoryStatus.toLowerCase().includes("not checked")
  ).length;

  function deleteCard(cardId: string) {
    const confirmed = window.confirm(
      "Delete this Skill Card? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      const savedCards = localStorage.getItem("proofplay-skill-cards");
      const parsedCards: unknown = savedCards
        ? JSON.parse(savedCards)
        : [];

      if (Array.isArray(parsedCards)) {
        const updatedCards = parsedCards.filter((card, index) => {
          if (typeof card !== "object" || card === null) {
            return false;
          }

          const storedCard = card as StoredCard;
          const storedId = getText(
            storedCard,
            ["id", "cardId"],
            `skill-card-${index}`
          );

          return storedId !== cardId;
        });

        localStorage.setItem(
          "proofplay-skill-cards",
          JSON.stringify(updatedCards)
        );
      }

      setCards((currentCards) =>
        currentCards.filter((card) => card.id !== cardId)
      );

      setSelectedCard(null);
    } catch {
      window.alert("The Skill Card could not be deleted.");
    }
  }

  return (
    <main className="min-h-screen bg-[#090a18] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-violet-600/20 blur-[130px]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-300/15 blur-[130px]" />
        <div className="proof-grid absolute inset-0 opacity-[0.1]" />
      </div>

      <header className="relative z-20 border-b border-white/[0.07] bg-[#090a18]/80 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 text-xl font-black tracking-tight text-white"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-300 text-[#101607]">
              <Sparkles size={20} strokeWidth={2.7} />
            </span>
            ProofPlay
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm font-bold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              <LayoutDashboard size={16} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <Link
              href="/memory-checks"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm font-bold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              <Clock3 size={16} />
              <span className="hidden sm:inline">Memory Checks</span>
            </Link>

            <Link
              href="/proof-card"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-black text-white transition hover:bg-violet-500"
            >
              <Award size={16} />
              <span className="hidden sm:inline">Proof Card</span>
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to challenges
        </Link>

        <div className="mt-7 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-lime-300">
              Living learning evidence
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Your Skill Cards
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">
              Every card records what was demonstrated, how clearly it was
              explained and whether the learning was remembered.
            </p>
          </div>

          <Link
            href="/proof-card"
            className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-xl bg-lime-300 px-5 text-sm font-black text-[#11150a] transition hover:-translate-y-0.5 hover:bg-lime-200"
          >
            <Award size={18} />
            View downloadable proof
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.08] bg-[#14162a] p-5">
            <FileText size={21} className="text-cyan-300" />

            <p className="mt-4 text-3xl font-black">{cards.length}</p>

            <p className="mt-1 text-sm font-semibold text-slate-400">
              Skill Cards created
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#14162a] p-5">
            <Medal size={21} className="text-violet-300" />

            <p className="mt-4 text-3xl font-black">
              {Math.max(subjects.length - 1, 0)}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-400">
              Learning subjects
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#14162a] p-5">
            <CheckCircle2 size={21} className="text-lime-300" />

            <p className="mt-4 text-3xl font-black">
              {completedMemoryChecks}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-400">
              Memory checks completed
            </p>
          </div>
        </div>

        {cards.length > 0 && (
          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#14162a] p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search your learning evidence"
                className="h-12 w-full rounded-xl border border-white/10 bg-[#0d0f20] pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/50"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => setSubjectFilter(subject)}
                  className={`h-10 rounded-xl px-4 text-xs font-black transition ${
                    subjectFilter === subject
                      ? "bg-violet-600 text-white"
                      : "border border-white/10 bg-white/[0.04] text-slate-400 hover:text-white"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex min-h-72 items-center justify-center">
            <Sparkles
              size={30}
              className="animate-pulse text-lime-300"
            />
          </div>
        ) : cards.length === 0 ? (
          <div className="mt-9 rounded-[2rem] border border-dashed border-white/15 bg-[#14162a]/70 px-6 py-16 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/15 text-violet-300">
              <Award size={30} />
            </span>

            <h2 className="mt-6 text-2xl font-black">
              Your evidence library is waiting
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-400">
              Complete a challenge, explain your thinking and save your first
              Living Skill Card.
            </p>

            <Link
              href="/dashboard"
              className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 text-sm font-black text-white transition hover:bg-violet-500"
            >
              <GraduationCap size={18} />
              Start a challenge
            </Link>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="mt-9 rounded-2xl border border-white/[0.08] bg-[#14162a] px-6 py-12 text-center">
            <Search size={28} className="mx-auto text-slate-600" />

            <h2 className="mt-4 text-xl font-black">
              No matching Skill Cards
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Try another search or subject filter.
            </p>
          </div>
        ) : (
          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCards.map((card) => {
              const design = getSubjectDesign(card.subject);
              const SubjectIcon = design.icon;

              return (
                <article
                  key={card.id}
                  className={`group flex flex-col rounded-[1.75rem] border border-white/[0.08] bg-[#14162a] p-6 shadow-2xl shadow-transparent transition duration-300 hover:-translate-y-1 hover:border-white/15 ${design.glowStyle}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${design.iconStyle}`}
                    >
                      <SubjectIcon size={22} />
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.13em] ${design.badgeStyle}`}
                    >
                      {card.subject}
                    </span>
                  </div>

                  <h2 className="mt-6 text-2xl font-black leading-tight tracking-tight">
                    {card.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-400">
                    {card.demonstratedSkill}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/[0.04] p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-slate-500">
                        Explanation
                      </p>

                      <p className="mt-1 text-sm font-black text-slate-200">
                        {card.explanationQuality}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/[0.04] p-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-slate-500">
                        Memory
                      </p>

                      <p className="mt-1 text-sm font-black text-slate-200">
                        {card.memoryScore !== null
                          ? `${card.memoryScore}%`
                          : card.memoryStatus}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-white/[0.07] pt-5">
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <CalendarDays size={14} />
                      {formatDate(card.createdAt)}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedCard(card)}
                      className="inline-flex items-center gap-2 text-xs font-black text-cyan-300 transition hover:text-cyan-200"
                    >
                      <Eye size={16} />
                      View evidence
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {selectedCard && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="skill-card-title"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="my-8 w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[#15172a] p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.17em] text-lime-300">
                  Living Skill Card
                </p>

                <h2
                  id="skill-card-title"
                  className="mt-3 text-3xl font-black tracking-tight"
                >
                  {selectedCard.title}
                </h2>

                <p className="mt-2 text-sm font-bold text-cyan-300">
                  {selectedCard.subject}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCard(null)}
                aria-label="Close Skill Card"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-slate-400 transition hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-7 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-5">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-300">
                Demonstrated understanding
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-200">
                {selectedCard.demonstratedSkill}
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/[0.04] p-4">
                <p className="text-xs font-bold text-slate-500">
                  Explanation
                </p>

                <p className="mt-2 font-black">
                  {selectedCard.explanationQuality}
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.04] p-4">
                <p className="text-xs font-bold text-slate-500">
                  Support
                </p>

                <p className="mt-2 font-black">
                  {selectedCard.supportLevel}
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.04] p-4">
                <p className="text-xs font-bold text-slate-500">
                  Memory
                </p>

                <p className="mt-2 font-black">
                  {selectedCard.memoryScore !== null
                    ? `${selectedCard.memoryScore}%`
                    : selectedCard.memoryStatus}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/[0.08] bg-[#0d0f20] p-5">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                Learner’s explanation
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                “{selectedCard.transcript}”
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/proof-card"
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-lime-300 px-5 text-sm font-black text-[#11150a] transition hover:bg-lime-200"
              >
                <Award size={18} />
                Open Proof Card
              </Link>

              <button
                type="button"
                onClick={() => deleteCard(selectedCard.id)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-5 text-sm font-black text-red-300 transition hover:bg-red-400/15"
              >
                <Trash2 size={17} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}