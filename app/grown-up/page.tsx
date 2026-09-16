"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Brain,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Home,
  Lightbulb,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UserRound,
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

type SubjectSummary = {
  subject: string;
  count: number;
  average: number;
  color: string;
};

const subjectColors: Record<string, string> = {
  Science: "#47D7FF",
  Mathematics: "#FF9D4D",
  Reading: "#C8F36A",
};

export default function GrownUpPage() {
  const [cards, setCards] = useState<SkillCard[]>([]);
  const [loaded, setLoaded] = useState(false);

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

  const averageProofStrength = useMemo(() => {
    if (!cards.length) return 0;

    return Math.round(
      cards.reduce((total, card) => total + card.score, 0) /
        cards.length,
    );
  }, [cards]);

  const rememberedSkills = cards.filter(
    (card) => card.memoryStatus === "remembered",
  ).length;

  const practiceSkills = cards.filter(
    (card) => card.memoryStatus === "practice",
  ).length;

  const subjectSummaries = useMemo<SubjectSummary[]>(() => {
    const groupedCards = cards.reduce<
      Record<string, SkillCard[]>
    >((groups, card) => {
      if (!groups[card.subject]) {
        groups[card.subject] = [];
      }

      groups[card.subject].push(card);

      return groups;
    }, {});

    return Object.entries(groupedCards).map(
      ([subject, subjectCards]) => ({
        subject,
        count: subjectCards.length,
        average: Math.round(
          subjectCards.reduce(
            (total, card) => total + card.score,
            0,
          ) / subjectCards.length,
        ),
        color: subjectColors[subject] || "#7657FF",
      }),
    );
  }, [cards]);

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  }

  function downloadReport() {
    const report = [
      ["ProofPlay Learning Report"],
      ["Learner", "Maya"],
      ["Skills demonstrated", cards.length.toString()],
      ["Average proof strength", `${averageProofStrength}%`],
      ["Skills remembered", rememberedSkills.toString()],
      ["Skills needing practice", practiceSkills.toString()],
      [],
      [
        "Skill",
        "Subject",
        "Proof strength",
        "Independence",
        "Memory status",
        "Date",
      ],
      ...cards.map((card) => [
        card.title,
        card.subject,
        `${card.score}%`,
        card.independence,
        card.memoryStatus || "Not checked",
        formatDate(card.createdAt),
      ]),
    ];

    const csv = report
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "proofplay-learning-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#0e1020] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0e1020]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1450px] items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#7657ff]">
              <ScanLine size={23} />
            </span>

            <div>
              <p className="text-xl font-extrabold tracking-[-0.04em]">
                ProofPlay
              </p>

              <p className="hidden text-xs text-white/40 sm:block">
                Grown-up View
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {cards.length > 0 && (
              <button
                type="button"
                onClick={downloadReport}
                className="hidden items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-bold transition hover:bg-white/5 sm:flex"
              >
                <Download size={17} />
                Download report
              </button>
            )}

            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-bold transition hover:bg-white/5"
            >
              <ArrowLeft size={17} />
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute -left-40 top-10 h-[450px] w-[450px] rounded-full bg-[#7657ff]/20 blur-[140px]" />
        <div className="absolute -right-40 top-10 h-[430px] w-[430px] rounded-full bg-[#c8f36a]/10 blur-[140px]" />

        <div className="relative mx-auto max-w-[1450px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ff9d4d]/20 bg-[#ff9d4d]/10 px-4 py-2 text-xs font-extrabold text-[#ffc494]">
                <UserRound size={15} />
                LEARNING OVERVIEW
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                Maya&apos;s progress
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
                See what Maya has demonstrated, remembered and may need
                additional support with.
              </p>
            </div>

            <button
              type="button"
              onClick={downloadReport}
              disabled={cards.length === 0}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#c8f36a] px-6 py-4 font-extrabold text-[#10151e] disabled:cursor-not-allowed disabled:opacity-35 sm:hidden"
            >
              <Download size={18} />
              Download report
            </button>
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
              className="flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-white/45 hover:bg-white/5 hover:text-white"
            >
              <RotateCcw size={17} />
              Memory Checks
            </Link>

            <Link
              href="/grown-up"
              className="flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-extrabold text-[#111426]"
            >
              <BarChart3 size={17} />
              Grown-up View
            </Link>
          </nav>

          {!loaded ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-[160px] animate-pulse rounded-[24px] bg-white/[0.05]"
                />
              ))}
            </div>
          ) : cards.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 grid min-h-[470px] place-items-center rounded-[30px] border border-dashed border-white/15 bg-white/[0.025] p-7 text-center"
            >
              <div>
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-[28px] bg-[#7657ff]/15 text-[#a795ff]">
                  <BarChart3 size={43} />
                </div>

                <h2 className="mt-6 text-2xl font-black">
                  Progress will appear here
                </h2>

                <p className="mx-auto mt-3 max-w-md leading-7 text-white/45">
                  Once a learner completes a challenge, their demonstrated
                  skills and memory results will become visible here.
                </p>

                <Link
                  href="/dashboard"
                  className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#c8f36a] px-6 py-4 font-extrabold text-[#10151e]"
                >
                  Open learner dashboard
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    label: "Skills demonstrated",
                    value: cards.length.toString(),
                    icon: ShieldCheck,
                    color: "#47D7FF",
                  },
                  {
                    label: "Average proof strength",
                    value: `${averageProofStrength}%`,
                    icon: Target,
                    color: "#C8F36A",
                  },
                  {
                    label: "Skills remembered",
                    value: rememberedSkills.toString(),
                    icon: Brain,
                    color: "#A795FF",
                  },
                  {
                    label: "Needs practice",
                    value: practiceSkills.toString(),
                    icon: RotateCcw,
                    color: "#FF9D4D",
                  },
                ].map(({ label, value, icon: Icon, color }, index) => (
                  <motion.article
                    key={label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
                  >
                    <div
                      className="grid h-11 w-11 place-items-center rounded-xl"
                      style={{
                        backgroundColor: `${color}18`,
                        color,
                      }}
                    >
                      <Icon size={21} />
                    </div>

                    <p className="mt-5 text-sm text-white/40">
                      {label}
                    </p>

                    <p className="mt-1 text-3xl font-black">{value}</p>
                  </motion.article>
                ))}
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <section className="rounded-[28px] border border-white/10 bg-[#171a2e] p-5 sm:p-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold tracking-[0.14em] text-[#47d7ff]">
                        SUBJECT OVERVIEW
                      </p>

                      <h2 className="mt-2 text-2xl font-black">
                        Demonstrated understanding
                      </h2>
                    </div>

                    <BarChart3 className="text-white/25" />
                  </div>

                  {subjectSummaries.length > 0 ? (
                    <div className="mt-8 space-y-6">
                      {subjectSummaries.map((subject) => (
                        <div key={subject.subject}>
                          <div className="mb-3 flex items-center justify-between">
                            <div>
                              <p className="font-extrabold">
                                {subject.subject}
                              </p>

                              <p className="mt-1 text-xs text-white/35">
                                {subject.count} demonstrated{" "}
                                {subject.count === 1 ? "skill" : "skills"}
                              </p>
                            </div>

                            <span className="text-xl font-black">
                              {subject.average}%
                            </span>
                          </div>

                          <div className="h-3 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${subject.average}%`,
                              }}
                              transition={{ duration: 0.8 }}
                              className="h-full rounded-full"
                              style={{
                                backgroundColor: subject.color,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-8 text-white/40">
                      Subject progress will appear after challenges are
                      completed.
                    </p>
                  )}
                </section>

                <section className="rounded-[28px] border border-white/10 bg-[#171a2e] p-5 sm:p-7">
                  <p className="text-xs font-extrabold tracking-[0.14em] text-[#c8f36a]">
                    SUPPORT RECOMMENDATION
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    Suggested next step
                  </h2>

                  <div className="mt-7 rounded-[22px] bg-[#c8f36a] p-5 text-[#10231f]">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#10231f] text-[#c8f36a]">
                      <Lightbulb size={24} />
                    </div>

                    <h3 className="mt-5 text-xl font-black">
                      Encourage explanation before correction
                    </h3>

                    <p className="mt-3 leading-7 text-[#31483f]">
                      Ask Maya to explain how an answer was reached before
                      providing help. This gives clearer evidence of the exact
                      point where support is needed.
                    </p>
                  </div>

                  <div className="mt-4 rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-start gap-3">
                      <Clock3
                        size={20}
                        className="mt-0.5 shrink-0 text-[#47d7ff]"
                      />

                      <div>
                        <p className="font-extrabold">
                          Keep memory checks short
                        </p>

                        <p className="mt-2 text-sm leading-6 text-white/45">
                          A short recall activity after several days provides
                          stronger evidence than repeating the original task
                          immediately.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <section className="mt-6 rounded-[28px] border border-white/10 bg-[#171a2e] p-5 sm:p-7">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-extrabold tracking-[0.14em] text-[#ff9d4d]">
                      RECENT LEARNING EVIDENCE
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      Latest demonstrated skills
                    </h2>
                  </div>

                  <Link
                    href="/skills"
                    className="flex items-center gap-2 text-sm font-extrabold text-[#47d7ff]"
                  >
                    View all Skill Cards
                    <ArrowRight size={17} />
                  </Link>
                </div>

                <div className="mt-7 space-y-3">
                  {cards.slice(0, 5).map((card) => (
                    <article
                      key={card.id}
                      className="grid gap-4 rounded-[20px] border border-white/[0.07] bg-[#101222] p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                    >
                      <div className="flex items-start gap-4">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#7657ff]/15 text-[#a795ff]">
                          <ShieldCheck size={22} />
                        </div>

                        <div>
                          <p className="font-extrabold">{card.title}</p>

                          <p className="mt-1 text-sm text-white/40">
                            {card.subject} · {card.challenge}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/30">
                            <span className="flex items-center gap-1">
                              <CalendarDays size={14} />
                              {formatDate(card.createdAt)}
                            </span>

                            <span>
                              Independence: {card.independence}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-white/35">
                            Proof strength
                          </p>

                          <p className="mt-1 text-xl font-black text-[#c8f36a]">
                            {card.score}%
                          </p>
                        </div>

                        <div
                          className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${
                            card.memoryStatus === "remembered"
                              ? "bg-[#c8f36a]/10 text-[#dfff95]"
                              : card.memoryStatus === "practice"
                                ? "bg-[#ff9d4d]/10 text-[#ffc494]"
                                : "bg-white/[0.06] text-white/45"
                          }`}
                        >
                          {card.memoryStatus === "remembered"
                            ? "Remembered"
                            : card.memoryStatus === "practice"
                              ? "Practise"
                              : "Not checked"}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="mt-6 overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#6547dc,#856cff)] p-6 sm:p-8">
                <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-white/65">
                      <Sparkles size={17} />
                      ProofPlay insight
                    </div>

                    <h2 className="mt-4 max-w-2xl text-2xl font-black sm:text-3xl">
                      Completion shows participation. Demonstration shows
                      understanding.
                    </h2>

                    <p className="mt-3 max-w-2xl leading-7 text-white/65">
                      Continue encouraging original explanations and practical
                      demonstrations rather than focusing only on final answers.
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#c8f36a] px-6 py-4 font-extrabold text-[#10151e]"
                  >
                    New challenge
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </section>
            </>
          )}
        </div>
      </section>
    </main>
  );
}