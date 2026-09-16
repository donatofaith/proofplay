"use client";

import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
  type ElementType,
} from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Toaster, toast } from "sonner";
import {
  ArrowLeft,
  Beaker,
  BookOpen,
  Brain,
  Camera,
  Check,
  ChevronRight,
  Flame,
  Home,
  ImagePlus,
  Menu,
  Mic,
  RefreshCcw,
  RotateCcw,
  ScanLine,
  Shapes,
  ShieldCheck,
  Sparkles,
  Star,
  Square,
  Trash2,
  Trophy,
  UserRound,
  X,
} from "lucide-react";

type Challenge = {
  id: number;
  subject: string;
  level: string;
  title: string;
  skillTitle: string;
  description: string;
  instruction: string;
  icon: ElementType;
  accent: string;
  softAccent: string;
};

type AnalysisResult = {
  score: number;
  concept: string;
  explanation: string;
  independence: string;
  feedback: string;
};

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}

interface BrowserSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
}

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const challenges: Challenge[] = [
  {
    id: 1,
    subject: "Science",
    level: "Explorer",
    title: "Build a water cycle",
    skillTitle: "Water Cycle Explorer",
    description: "Show evaporation, clouds and rainfall.",
    instruction:
      "Draw or build the water cycle, then explain how water moves through each stage.",
    icon: Beaker,
    accent: "#47D7FF",
    softAccent: "rgba(71, 215, 255, 0.14)",
  },
  {
    id: 2,
    subject: "Mathematics",
    level: "Starter",
    title: "Make 4 × 3 visible",
    skillTitle: "Multiplication Builder",
    description: "Build four equal groups of three.",
    instruction:
      "Use objects around you to demonstrate what 4 × 3 means, then explain your arrangement.",
    icon: Shapes,
    accent: "#FF9D4D",
    softAccent: "rgba(255, 157, 77, 0.14)",
  },
  {
    id: 3,
    subject: "Reading",
    level: "Explorer",
    title: "Read with meaning",
    skillTitle: "Meaningful Reader",
    description: "Use your voice to demonstrate understanding.",
    instruction:
      "Read a short passage aloud and explain how the main character is feeling and why.",
    icon: BookOpen,
    accent: "#C8F36A",
    softAccent: "rgba(200, 243, 106, 0.14)",
  },
];

const navigation = [
  { label: "Challenges", icon: Home, href: "/dashboard" },
  { label: "My Skill Cards", icon: Trophy, href: "/skills" },
  { label: "Memory Checks", icon: RotateCcw, href: "/memory-checks" },
  { label: "Grown-up View", icon: UserRound, href: "/grown-up" },
];

export default function DashboardPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  const [selectedChallenge, setSelectedChallenge] = useState(challenges[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [speechSupported, setSpeechSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  const [analysing, setAnalysing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [skillCardOpen, setSkillCardOpen] = useState(false);

  const SelectedIcon = selectedChallenge.icon;

  useEffect(() => {
    const RecognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    setSpeechSupported(Boolean(RecognitionConstructor));

    return () => {
      recognitionRef.current?.abort();

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function resetChallenge() {
    recognitionRef.current?.abort();

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setImagePreview(null);
    setTranscript("");
    setInterimTranscript("");
    setIsListening(false);
    setAnalysing(false);
    setAnalysisStage("");
    setResult(null);
  }

  function selectChallenge(challenge: Challenge) {
    if (isListening) {
      toast.error("Stop the voice explanation before changing challenges.");
      return;
    }

    setSelectedChallenge(challenge);
    resetChallenge();
  }

  function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("The image must be smaller than 8 MB.");
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(URL.createObjectURL(file));
    setResult(null);
    toast.success("Learning evidence added.");
  }

  function removeImage() {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function startListening() {
    const RecognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!RecognitionConstructor) {
      setSpeechSupported(false);
      toast.error(
        "Speech recognition is unavailable. Please type your explanation.",
      );
      return;
    }

    if (isListening) return;

    const recognition = new RecognitionConstructor();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setInterimTranscript("");
      setResult(null);
      toast.success("Listening started. Explain your thinking.");
    };

    recognition.onresult = (event) => {
      let finalWords = "";
      let temporaryWords = "";

      for (
        let index = event.resultIndex;
        index < event.results.length;
        index += 1
      ) {
        const recognisedWords = event.results[index][0]?.transcript || "";

        if (event.results[index].isFinal) {
          finalWords += recognisedWords;
        } else {
          temporaryWords += recognisedWords;
        }
      }

      if (finalWords.trim()) {
        setTranscript((current) =>
          `${current} ${finalWords}`.replace(/\s+/g, " ").trim(),
        );
      }

      setInterimTranscript(temporaryWords.trim());
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setInterimTranscript("");

      if (event.error === "not-allowed") {
        toast.error(
          "Microphone permission was denied. You can type instead.",
        );
        return;
      }

      if (event.error === "no-speech") {
        toast.error("No speech was detected. Please try again.");
        return;
      }

      if (event.error === "network") {
        toast.error(
          "Speech recognition needs an internet connection in this browser.",
        );
        return;
      }

      toast.error("Speech recognition stopped. Please try again.");
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      toast.error("Speech recognition could not start.");
    }
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
    setInterimTranscript("");

    if (transcript.trim()) {
      toast.success("Voice explanation captured.");
    }
  }

  function clearTranscript() {
    if (isListening) {
      recognitionRef.current?.stop();
    }

    setTranscript("");
    setInterimTranscript("");
    setIsListening(false);
    setResult(null);
  }

  function runAnalysis() {
    if (!imagePreview && transcript.trim().length < 15) {
      toast.error(
        "Add an image or provide an explanation of at least 15 characters.",
      );
      return;
    }

    if (isListening) {
      stopListening();
    }

    setResult(null);
    setAnalysing(true);
    setAnalysisStage("Reviewing your learning evidence...");

    window.setTimeout(() => {
      setAnalysisStage("Checking the explanation...");
    }, 900);

    window.setTimeout(() => {
      setAnalysisStage("Creating useful learning feedback...");
    }, 1800);

    window.setTimeout(() => {
      const explanationQuality =
        transcript.trim().length >= 40 ? "Clear" : "Developing";

      setResult({
        score: explanationQuality === "Clear" ? 92 : 78,
        concept: imagePreview || transcript.trim() ? "Proven" : "Developing",
        explanation: explanationQuality,
        independence: "Strong",
        feedback:
          explanationQuality === "Clear"
            ? "You demonstrated the main concept clearly and connected the important ideas in your own words."
            : "You showed the main idea. Add more detail to explain why each step happens.",
      });

      setAnalysing(false);
      setAnalysisStage("");
      toast.success("Proof analysis completed.");
    }, 2800);
  }

  function createSkillCard() {
    if (!result) return;

    const savedCards = JSON.parse(
      window.localStorage.getItem("proofplay-skill-cards") || "[]",
    );

    const skillCard = {
      id: Date.now(),
      title: selectedChallenge.skillTitle,
      challenge: selectedChallenge.title,
      subject: selectedChallenge.subject,
      transcript,
      score: result.score,
      independence: result.independence,
      createdAt: new Date().toISOString(),
      memoryCheck: "In 3 days",
    };

    window.localStorage.setItem(
      "proofplay-skill-cards",
      JSON.stringify([skillCard, ...savedCards]),
    );

    setSkillCardOpen(true);
  }

  const canAnalyse =
    Boolean(imagePreview) || transcript.trim().length >= 15;

  return (
    <main className="min-h-screen bg-[#0e1020] text-white">
      <Toaster position="top-center" richColors />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0e1020]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 lg:hidden"
            >
              <Menu size={21} />
            </button>

            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#7657ff]">
                <ScanLine size={23} />
              </span>

              <div>
                <p className="text-xl font-extrabold tracking-[-0.04em]">
                  ProofPlay
                </p>

                <p className="hidden text-xs text-white/45 sm:block">
                  Learner workspace
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold sm:flex">
              <Flame size={17} className="text-[#ff9d4d]" />
              4-day learning streak
            </div>

            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full bg-[#c8f36a] font-extrabold text-[#10151e]"
            >
              M
            </button>
          </div>
        </div>
      </header>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/65 lg:hidden"
        />
      )}

      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[280px_1fr]">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[285px] transform border-r border-white/10 bg-[#121426] p-5 transition-transform lg:sticky lg:top-[77px] lg:z-20 lg:h-[calc(100vh-77px)] lg:w-auto lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Link href="/" className="flex items-center gap-2 font-extrabold">
              <ArrowLeft size={18} />
              ProofPlay
            </Link>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10"
            >
              <X size={19} />
            </button>
          </div>

          <section className="relative mb-5 overflow-hidden rounded-[26px] bg-[#7657ff] p-6">
            <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#47d7ff]/25 blur-2xl" />

            <div className="relative">
              <p className="text-xs font-extrabold tracking-[0.14em] text-white/60">
                GOOD AFTERNOON
              </p>

              <h2 className="mt-2 text-xl font-extrabold">
                Maya&apos;s learning space
              </h2>

              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#e5ffad]">
                <Star size={17} fill="currentColor" />
                12 skills demonstrated
              </div>
            </div>
          </section>

          <nav className="space-y-2">
            {navigation.map(({ label, icon: Icon, href }, index) => (
              <Link
                key={label}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition ${
                  index === 0
                    ? "bg-white text-[#111426]"
                    : "text-white/55 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <Icon size={19} />
                {label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex gap-3">
              <Brain
                size={19}
                className="mt-0.5 shrink-0 text-[#c8f36a]"
              />

              <div>
                <p className="text-sm font-bold">Next memory check</p>

                <p className="mt-1 text-sm leading-6 text-white/45">
                  Plant life cycle is ready to practise tomorrow.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
          <div className="mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
            <div>
              <p className="text-xs font-extrabold tracking-[0.17em] text-[#47d7ff]">
                TODAY&apos;S PLAY LAB
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                Show what you know.
              </h1>

              <p className="mt-3 max-w-xl text-base leading-7 text-white/55 sm:text-lg">
                Choose a challenge, provide evidence and explain your thinking.
              </p>
            </div>

            <div className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 xl:w-[230px]">
              <div className="mb-3 flex items-center justify-between text-sm font-bold">
                <span>Weekly goal</span>
                <span className="text-[#c8f36a]">3 of 5</span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  className="h-full rounded-full bg-[#c8f36a]"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {challenges.map((challenge) => {
              const Icon = challenge.icon;
              const selected = selectedChallenge.id === challenge.id;

              return (
                <motion.button
                  key={challenge.id}
                  type="button"
                  whileHover={{ y: -4 }}
                  onClick={() => selectChallenge(challenge)}
                  className={`rounded-[25px] border p-5 text-left transition ${
                    selected
                      ? "border-[#7657ff] bg-[#191c33]"
                      : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-white/45">
                      {challenge.subject}
                    </span>

                    {selected && (
                      <span className="rounded-full bg-[#7657ff]/20 px-3 py-1 text-xs font-bold text-[#b8aaff]">
                        Selected
                      </span>
                    )}
                  </div>

                  <div
                    className="mt-6 grid h-14 w-14 place-items-center rounded-2xl"
                    style={{
                      backgroundColor: challenge.softAccent,
                      color: challenge.accent,
                    }}
                  >
                    <Icon size={25} />
                  </div>

                  <p className="mt-5 text-xs font-semibold text-white/40">
                    {challenge.level}
                  </p>

                  <h2 className="mt-1 text-lg font-extrabold">
                    {challenge.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-white/50">
                    {challenge.description}
                  </p>
                </motion.button>
              );
            })}
          </div>

          <section className="mt-6 grid overflow-hidden rounded-[30px] border border-white/10 bg-[#171a2e] xl:grid-cols-[1.2fr_0.8fr]">
            <div className="p-5 sm:p-7">
              <p className="text-xs font-extrabold tracking-[0.16em] text-[#47d7ff]">
                SELECTED CHALLENGE
              </p>

              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                {selectedChallenge.title}
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-white/55">
                {selectedChallenge.instruction}
              </p>

              <div className="mt-6 overflow-hidden rounded-[25px] border border-white/10 bg-[#101222]">
                {imagePreview ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Uploaded learning evidence"
                      className="h-[290px] w-full object-contain"
                    />

                    <button
                      type="button"
                      aria-label="Remove image"
                      onClick={removeImage}
                      className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-black/70"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="grid min-h-[270px] place-items-center p-6 text-center">
                    <div>
                      <div
                        className="mx-auto grid h-20 w-20 place-items-center rounded-[24px]"
                        style={{
                          backgroundColor: selectedChallenge.softAccent,
                          color: selectedChallenge.accent,
                        }}
                      >
                        <SelectedIcon size={35} />
                      </div>

                      <h3 className="mt-5 text-xl font-extrabold">
                        Add your learning evidence
                      </h3>

                      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">
                        Take a photo or upload your drawing, model or
                        demonstration.
                      </p>
                    </div>
                  </div>
                )}

                <div className="border-t border-white/10 p-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImage}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7657ff] px-5 py-3.5 font-extrabold"
                  >
                    {imagePreview ? (
                      <RefreshCcw size={18} />
                    ) : (
                      <ImagePlus size={18} />
                    )}

                    {imagePreview ? "Replace evidence" : "Show your work"}
                  </button>
                </div>
              </div>

              <div className="mt-5 rounded-[22px] border border-white/10 bg-[#101222] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold">Voice explanation</h3>

                    <p className="mt-1 text-sm text-white/40">
                      Your words will appear below while you speak.
                    </p>
                  </div>

                  {transcript && (
                    <button
                      type="button"
                      aria-label="Clear transcript"
                      onClick={clearTranscript}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/5 text-white/50"
                    >
                      <Trash2 size={17} />
                    </button>
                  )}
                </div>

                {!speechSupported && (
                  <div className="mt-4 rounded-2xl border border-[#ff9d4d]/25 bg-[#ff9d4d]/10 p-4 text-sm leading-6 text-[#ffd3af]">
                    Voice recognition is unavailable in this browser. You can
                    still type your explanation below.
                  </div>
                )}

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    disabled={!speechSupported}
                    className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-extrabold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      isListening
                        ? "bg-[#ff6b6b]"
                        : "border border-white/15 bg-white/[0.05]"
                    }`}
                  >
                    {isListening ? (
                      <Square size={18} fill="currentColor" />
                    ) : (
                      <Mic size={19} />
                    )}

                    {isListening
                      ? "Stop listening"
                      : transcript
                        ? "Continue speaking"
                        : "Start speaking"}
                  </button>

                  {isListening && (
                    <div className="flex items-center gap-2 rounded-2xl bg-[#ff6b6b]/10 px-4 py-3 text-sm font-bold text-[#ffadad]">
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#ff6b6b]" />
                      Listening now
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="transcript"
                    className="mb-2 block text-sm font-bold text-white/65"
                  >
                    Your explanation
                  </label>

                  <textarea
                    id="transcript"
                    value={
                      interimTranscript
                        ? `${transcript} ${interimTranscript}`.trim()
                        : transcript
                    }
                    onChange={(event) => {
                      setTranscript(event.target.value);
                      setInterimTranscript("");
                      setResult(null);
                    }}
                    placeholder="Start speaking or type your explanation here..."
                    rows={5}
                    className="w-full resize-none rounded-[18px] border border-white/10 bg-[#171a2e] p-4 leading-7 text-white placeholder:text-white/25 focus:border-[#47d7ff] focus:outline-none"
                  />

                  {interimTranscript && (
                    <p className="mt-2 text-xs text-[#47d7ff]">
                      Listening: the newest words may still change.
                    </p>
                  )}

                  <div className="mt-2 flex items-center justify-between text-xs text-white/30">
                    <span>You can correct the text before analysing it.</span>
                    <span>{transcript.trim().length} characters</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={!canAnalyse || analysing}
                onClick={runAnalysis}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#c8f36a] px-6 py-4 font-extrabold text-[#10151e] transition hover:bg-[#d8ff7b] disabled:cursor-not-allowed disabled:opacity-35"
              >
                <Sparkles size={19} />

                {analysing ? "Analysing your proof..." : "Analyse my proof"}
              </button>

              <p className="mt-3 text-center text-xs text-white/30">
                Speech recognition is provided by your browser. Proof scoring
                remains simulated in this prototype.
              </p>
            </div>

            <aside className="relative overflow-hidden bg-[#7657ff] p-6 sm:p-8">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#47d7ff]/25 blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold">Proof meter</h3>

                  <span className="flex items-center gap-2 text-xs font-semibold text-white/70">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        result
                          ? "bg-[#c8f36a]"
                          : analysing
                            ? "animate-pulse bg-[#ff9d4d]"
                            : "bg-white/35"
                      }`}
                    />

                    {result ? "Completed" : analysing ? "Analysing" : "Ready"}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  {analysing ? (
                    <motion.div
                      key="analysing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="my-12 text-center"
                    >
                      <motion.div
                        animate={{
                          rotate: 360,
                          scale: [1, 1.08, 1],
                        }}
                        transition={{
                          rotate: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          },
                          scale: {
                            duration: 1.2,
                            repeat: Infinity,
                          },
                        }}
                        className="mx-auto grid h-32 w-32 place-items-center rounded-[40%_60%_55%_45%] bg-[linear-gradient(135deg,#47d7ff,#c8f36a)] text-[#10231f]"
                      >
                        <Brain size={45} />
                      </motion.div>

                      <p className="mt-7 font-extrabold">{analysisStage}</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={result ? "result" : "waiting"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="mx-auto my-8 grid h-36 w-36 place-items-center rounded-full border-[11px] border-white/15">
                        <div className="text-center">
                          <p className="text-3xl font-black">
                            {result ? `${result.score}%` : "—"}
                          </p>

                          <p className="mt-1 text-xs text-white/55">
                            {result ? "Proof strength" : "Awaiting proof"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {[
                          [
                            "Concept demonstrated",
                            result?.concept || "Waiting",
                          ],
                          [
                            "Explanation is clear",
                            result?.explanation || "Waiting",
                          ],
                          [
                            "Used independently",
                            result?.independence || "Waiting",
                          ],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="flex items-center justify-between border-b border-white/15 pb-3 text-sm"
                          >
                            <span>{label}</span>

                            <span
                              className={
                                result
                                  ? "font-bold text-[#e1ff9c]"
                                  : "text-white/50"
                              }
                            >
                              {result && (
                                <Check className="mr-1 inline" size={14} />
                              )}

                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {result ? (
                  <>
                    <div className="mt-7 rounded-2xl bg-[#101222]/25 p-4 backdrop-blur">
                      <p className="text-sm font-extrabold text-[#e1ff9c]">
                        Feedback
                      </p>

                      <p className="mt-2 text-sm leading-6 text-white/70">
                        {result.feedback}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={createSkillCard}
                      className="mt-5 flex w-full items-center justify-between rounded-2xl bg-[#c8f36a] px-5 py-4 text-sm font-extrabold text-[#111426]"
                    >
                      Create Living Skill Card
                      <ChevronRight size={18} />
                    </button>
                  </>
                ) : (
                  <div className="mt-7 rounded-2xl bg-[#101222]/25 p-4 text-sm leading-6 text-white/65">
                    Add evidence and explain your thinking to begin the proof
                    analysis.
                  </div>
                )}
              </div>
            </aside>
          </section>
        </section>
      </div>

      <AnimatePresence>
        {skillCardOpen && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) {
                setSkillCardOpen(false);
              }
            }}
            className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.92, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-[570px] rounded-[32px] bg-[#f8f4e9] p-6 text-[#14221f] shadow-[0_40px_130px_rgba(0,0,0,0.6)] sm:p-8"
            >
              <div className="flex items-start justify-between">
                <div className="grid h-16 w-16 place-items-center rounded-[20px] bg-[#1c5d4d] text-[#c8f36a]">
                  <ShieldCheck size={31} />
                </div>

                <button
                  type="button"
                  aria-label="Close Skill Card"
                  onClick={() => setSkillCardOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full bg-[#14221f]/10"
                >
                  <X size={19} />
                </button>
              </div>

              <p className="mt-7 text-xs font-extrabold tracking-[0.16em] text-[#7657ff]">
                LIVING SKILL CARD
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.045em]">
                {selectedChallenge.skillTitle}
              </h2>

              <p className="mt-4 leading-7 text-[#65716d]">
                Maya demonstrated understanding of{" "}
                {selectedChallenge.title.toLowerCase()} using learning evidence
                and an original explanation.
              </p>

              {transcript && (
                <div className="mt-5 rounded-2xl border border-[#dde1d9] bg-white p-4">
                  <p className="text-xs font-extrabold text-[#7657ff]">
                    LEARNER EXPLANATION
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#52605b]">
                    “{transcript}”
                  </p>
                </div>
              )}

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  ["Understanding", `${result.score}%`],
                  ["Independence", result.independence],
                  ["Memory check", "In 3 days"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-[#dde1d9] bg-white p-3"
                  >
                    <p className="text-xs text-[#7a8581]">{label}</p>
                    <p className="mt-1 text-sm font-black">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setSkillCardOpen(false);
                    resetChallenge();
                  }}
                  className="rounded-2xl border border-[#14221f]/15 px-5 py-3.5 font-extrabold"
                >
                  New challenge
                </button>

                <Link
                  href="/skills"
                  className="flex items-center justify-center rounded-2xl bg-[#7657ff] px-5 py-3.5 font-extrabold text-white"
                >
                  View my Skill Cards
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}