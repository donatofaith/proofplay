"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Toaster, toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock3,
  Home,
  Lightbulb,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";

type SkillCard = {
  id: number;
  title: string;
  challenge: string;
  subject: string;
  transcript?: string;
  score: number;
  independence: string;
  createdAt: string;
  memoryCheck: string;
  memoryStatus?: "remembered" | "practice";
  memoryScore?: number;
  lastCheckedAt?: string;
};

type MemoryChallenge = {
  question: string;
  hint: string;
  keywords: string[];
};

function getMemoryChallenge(card: SkillCard): MemoryChallenge {
  const subject = card.subject.toLowerCase();

  if (subject.includes("science")) {
    return {
      question:
        "Without looking back, explain what happens after water evaporates and rises into the air.",
      hint: "Think about cooling, clouds and what happens next.",
      keywords: [
        "condensation",
        "condense",
        "cloud",
        "cool",
        "rain",
        "precipitation",
      ],
    };
  }

  if (subject.includes("math")) {
    return {
      question:
        "Imagine three equal groups with five objects in each group. Explain the multiplication and give the total.",
      hint: "Think about repeated addition and equal groups.",
      keywords: [
        "3 x 5",
        "3 × 5",
        "three times five",
        "fifteen",
        "15",
        "equal groups",
      ],
    };
  }

  return {
    question:
      "Explain how you can use clues from a passage to understand how a character is feeling.",
    hint: "Think about the character’s words, actions and the events in the passage.",
    keywords: [
      "words",
      "actions",
      "clues",
      "events",
      "feeling",
      "evidence",
    ],
  };
}

export default function MemoryChecksPage() {
  const [cards, setCards] = useState<SkillCard[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeCard, setActiveCard] = useState<SkillCard | null>(null);
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [checking, setChecking] = useState(false);
  const [memoryResult, setMemoryResult] = useState<{
    score: number;
    status: "remembered" | "practice";
    feedback: string;
  } | null>(null);

  useEffect(() => {
    try {
      const savedCards = JSON.parse(
        window.localStorage.getItem("proofplay-skill-cards") || "[]",
      );

      setCards(Array.isArray(savedCards) ? savedCards : []);
    } catch {
      setCards([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  function openMemoryCheck(card: SkillCard) {
    setActiveCard(card);
    setAnswer("");
    setShowHint(false);
    setChecking(false);
    setMemoryResult(null);
  }

  function closeMemoryCheck() {
    setActiveCard(null);
    setAnswer("");
    setShowHint(false);
    setChecking(false);
    setMemoryResult(null);
  }

  function submitMemoryCheck(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeCard) return;

    if (answer.trim().length < 20) {
      toast.error("Add a little more detail to your answer.");
      return;
    }

    setChecking(true);

    window.setTimeout(() => {
      const challenge = getMemoryChallenge(activeCard);
      const normalizedAnswer = answer.toLowerCase();

      const matchedKeywords = challenge.keywords.filter((keyword) =>
        normalizedAnswer.includes(keyword.toLowerCase()),
      ).length;

      const detailPoints = Math.min(
        30,
        Math.floor(answer.trim().length / 4),
      );

      const keywordPoints = Math.min(60, matchedKeywords * 15);
      const score = Math.min(98, 20 + detailPoints + keywordPoints);
      const remembered = score >= 65;

      const updatedCard: SkillCard = {
        ...activeCard,
        memoryStatus: remembered ? "remembered" : "practice",
        memoryScore: score,
        memoryCheck: remembered ? "Remembered" : "Needs practice",
        lastCheckedAt: new Date().toISOString(),
      };

      const updatedCards = cards.map((card) =>
        card.id === activeCard.id ? updatedCard : card,
      );

      setCards(updatedCards);
      setActiveCard(updatedCard);

      window.localStorage.setItem(
        "proofplay-skill-cards",
        JSON.stringify(updatedCards),
      );

      setMemoryResult({
        score,
        status: remembered ? "remembered" : "practice",
        feedback: remembered
          ? "You remembered the main idea and explained it using your own words."
          : "You remembered part of the idea. Review the skill and try another version of the challenge.",
      });

      setChecking(false);
      toast.success("Memory check completed.");
    }, 1800);
  }

  function getDueDate(createdAt: string) {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + 3);

    return date;
  }

  function formatDate(date: Date | string) {
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  }

  const rememberedCards = cards.filter(
    (card) => card.memoryStatus === "remembered",
  ).length;

  const practiceCards = cards.filter(
    (card) => card.memoryStatus === "practice",
  ).length;

  return (
    <main className="min-h-screen bg-[#0e1020] text-white">
      <Toaster position="top-center" richColors />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0e1020]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#7657ff]">
              <ScanLine size={23} />
            </span>

            <div>
              <p className="text-xl font-extrabold tracking-[-0.04em]">
                ProofPlay
              </p>

              <p className="hidden text-xs text-white/40 sm:block">
                Memory Checks
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/5"
          >
            <ArrowLeft size={17} />
            Dashboard
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-[#47d7ff]/10 blur-[140px]" />
        <div className="absolute -right-40 top-0 h-[450px] w-[450px] rounded-full bg-[#7657ff]/20 blur-[140px]" />

        <div className="relative mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#47d7ff]/20 bg-[#47d7ff]/10 px-4 py-2 text-xs font-extrabold text-[#8ae7ff]">
                <RotateCcw size={15} />
                LONG-TERM LEARNING
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                Memory Checks
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
                Demonstrate the skill again through a different challenge to
                show that the knowledge was remembered.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 lg:w-[480px]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs text-white/40">Available</p>
                <p className="mt-2 text-2xl font-black">{cards.length}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs text-white/40">Remembered</p>
                <p className="mt-2 text-2xl font-black text-[#c8f36a]">
                  {rememberedCards}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs text-white/40">Practise</p>
                <p className="mt-2 text-2xl font-black text-[#ff9d4d]">
                  {practiceCards}
                </p>
              </div>
            </div>
          </div>

          <nav className="mt-10 flex gap-2 overflow-x-auto border-b border-white/10 pb-4">
            <Link
              href="/dashboard"
              className="flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-white/45 hover:bg-white/5 hover:text-white"
            >
              <Home size={17} />
              Challenges
            </Link>

            <Link
              href="/skills"
              className="flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-white/45 hover:bg-white/5 hover:text-white"
            >
              <Trophy size={17} />
              Skill Cards
            </Link>

            <Link
              href="/memory-checks"
              className="flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-extrabold text-[#111426]"
            >
              <RotateCcw size={17} />
              Memory Checks
            </Link>
          </nav>

          {!loaded ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-[300px] animate-pulse rounded-[28px] bg-white/[0.05]"
                />
              ))}
            </div>
          ) : cards.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 grid min-h-[450px] place-items-center rounded-[30px] border border-dashed border-white/15 bg-white/[0.025] p-7 text-center"
            >
              <div>
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-[28px] bg-[#47d7ff]/10 text-[#47d7ff]">
                  <Brain size={43} />
                </div>

                <h2 className="mt-6 text-2xl font-black">
                  No memory checks yet
                </h2>

                <p className="mx-auto mt-3 max-w-md leading-7 text-white/45">
                  Create a Living Skill Card first. ProofPlay will then create a
                  related challenge to check what you remember.
                </p>

                <Link
                  href="/dashboard"
                  className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#c8f36a] px-6 py-4 font-extrabold text-[#10151e]"
                >
                  Complete a challenge
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {cards.map((card, index) => {
                const dueDate = getDueDate(card.createdAt);

                return (
                  <motion.article
                    key={card.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="overflow-hidden rounded-[28px] border border-white/10 bg-[#171a2e]"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div
                          className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${
                            card.memoryStatus === "remembered"
                              ? "bg-[#c8f36a] text-[#10231f]"
                              : card.memoryStatus === "practice"
                                ? "bg-[#ff9d4d] text-[#28170b]"
                                : "bg-[#47d7ff]/15 text-[#47d7ff]"
                          }`}
                        >
                          {card.memoryStatus === "remembered" ? (
                            <CheckCircle2 size={27} />
                          ) : (
                            <Brain size={27} />
                          )}
                        </div>

                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${
                            card.memoryStatus === "remembered"
                              ? "bg-[#c8f36a]/10 text-[#dfff95]"
                              : card.memoryStatus === "practice"
                                ? "bg-[#ff9d4d]/10 text-[#ffc494]"
                                : "bg-white/[0.06] text-white/50"
                          }`}
                        >
                          {card.memoryStatus === "remembered"
                            ? "Remembered"
                            : card.memoryStatus === "practice"
                              ? "Needs practice"
                              : "Upcoming"}
                        </span>
                      </div>

                      <p className="mt-7 text-xs font-extrabold tracking-[0.14em] text-[#47d7ff]">
                        {card.subject.toUpperCase()}
                      </p>

                      <h2 className="mt-2 text-2xl font-black">
                        {card.title}
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-white/45">
                        A new version of “{card.challenge}” will check whether
                        the main idea was retained.
                      </p>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-white/[0.04] p-4">
                          <div className="flex items-center gap-2 text-xs text-white/35">
                            <CalendarClock size={15} />
                            Scheduled
                          </div>

                          <p className="mt-2 text-sm font-extrabold">
                            {formatDate(dueDate)}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white/[0.04] p-4">
                          <div className="flex items-center gap-2 text-xs text-white/35">
                            <ShieldCheck size={15} />
                            Latest result
                          </div>

                          <p className="mt-2 text-sm font-extrabold">
                            {card.memoryScore
                              ? `${card.memoryScore}%`
                              : "Not checked"}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => openMemoryCheck(card)}
                        className="mt-5 flex w-full items-center justify-between rounded-2xl bg-[#7657ff] px-5 py-4 font-extrabold transition hover:bg-[#846aff]"
                      >
                        {card.memoryStatus
                          ? "Try another memory check"
                          : "Preview memory check"}

                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {activeCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) {
                closeMemoryCheck();
              }
            }}
            className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.94, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-[650px] overflow-hidden rounded-[32px] border border-white/10 bg-[#171a2e] shadow-[0_40px_130px_rgba(0,0,0,0.65)]"
            >
              <div className="relative overflow-hidden bg-[linear-gradient(145deg,#6547dc,#856cff)] p-6 sm:p-8">
                <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#47d7ff]/25 blur-3xl" />

                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#c8f36a] text-[#10231f]">
                      <RotateCcw size={27} />
                    </div>

                    <button
                      type="button"
                      aria-label="Close memory check"
                      onClick={closeMemoryCheck}
                      className="grid h-10 w-10 place-items-center rounded-full bg-white/15"
                    >
                      <X size={19} />
                    </button>
                  </div>

                  <p className="mt-7 text-xs font-extrabold tracking-[0.15em] text-white/60">
                    MEMORY CHECK
                  </p>

                  <h2 className="mt-2 text-3xl font-black">
                    {activeCard.title}
                  </h2>

                  <p className="mt-2 text-white/65">
                    Demonstrate the idea again without returning to your
                    original explanation.
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {!memoryResult ? (
                  <form onSubmit={submitMemoryCheck}>
                    <div className="rounded-2xl border border-white/10 bg-[#101222] p-5">
                      <p className="text-xs font-extrabold tracking-[0.13em] text-[#47d7ff]">
                        YOUR NEW CHALLENGE
                      </p>

                      <p className="mt-3 text-lg font-bold leading-8">
                        {getMemoryChallenge(activeCard).question}
                      </p>
                    </div>

                    <div className="mt-5">
                      <label
                        htmlFor="memoryAnswer"
                        className="mb-2 block text-sm font-bold text-white/70"
                      >
                        Explain what you remember
                      </label>

                      <textarea
                        id="memoryAnswer"
                        value={answer}
                        onChange={(event) =>
                          setAnswer(event.target.value)
                        }
                        placeholder="Write your explanation in your own words..."
                        rows={6}
                        className="w-full resize-none rounded-2xl border border-white/10 bg-[#101222] p-4 leading-7 text-white placeholder:text-white/25 focus:border-[#7657ff] focus:outline-none"
                      />

                      <p className="mt-2 text-right text-xs text-white/30">
                        {answer.trim().length} characters
                      </p>
                    </div>

                    {showHint ? (
                      <div className="mt-4 flex gap-3 rounded-2xl border border-[#ff9d4d]/20 bg-[#ff9d4d]/10 p-4">
                        <Lightbulb
                          size={19}
                          className="mt-0.5 shrink-0 text-[#ff9d4d]"
                        />

                        <p className="text-sm leading-6 text-[#ffd3af]">
                          {getMemoryChallenge(activeCard).hint}
                        </p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowHint(true)}
                        className="mt-4 flex items-center gap-2 text-sm font-bold text-[#ffb77b]"
                      >
                        <Lightbulb size={17} />
                        Show a small hint
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={checking}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#c8f36a] px-6 py-4 font-extrabold text-[#10151e] disabled:opacity-50"
                    >
                      {checking ? (
                        <>
                          <Sparkles
                            size={19}
                            className="animate-spin"
                          />
                          Checking what you remember...
                        </>
                      ) : (
                        <>
                          Check my memory
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>

                    <p className="mt-3 text-center text-xs text-white/30">
                      Memory scoring is simulated in this prototype.
                    </p>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <div
                      className={`mx-auto grid h-24 w-24 place-items-center rounded-[28px] ${
                        memoryResult.status === "remembered"
                          ? "bg-[#c8f36a] text-[#10231f]"
                          : "bg-[#ff9d4d] text-[#28170b]"
                      }`}
                    >
                      {memoryResult.status === "remembered" ? (
                        <CheckCircle2 size={43} />
                      ) : (
                        <Brain size={43} />
                      )}
                    </div>

                    <p className="mt-6 text-xs font-extrabold tracking-[0.15em] text-[#47d7ff]">
                      MEMORY STRENGTH
                    </p>

                    <p className="mt-2 text-5xl font-black">
                      {memoryResult.score}%
                    </p>

                    <h3 className="mt-5 text-2xl font-black">
                      {memoryResult.status === "remembered"
                        ? "Knowledge remembered"
                        : "A little more practice"}
                    </h3>

                    <p className="mx-auto mt-3 max-w-md leading-7 text-white/50">
                      {memoryResult.feedback}
                    </p>

                    <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-white/[0.04] p-4 text-sm text-white/60">
                      <Check size={17} className="text-[#c8f36a]" />
                      Your Living Skill Card has been updated.
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <Link
                        href="/skills"
                        className="flex items-center justify-center rounded-2xl border border-white/15 px-5 py-3.5 font-extrabold"
                      >
                        View Skill Card
                      </Link>

                      <button
                        type="button"
                        onClick={closeMemoryCheck}
                        className="rounded-2xl bg-[#7657ff] px-5 py-3.5 font-extrabold"
                      >
                        Finish
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}