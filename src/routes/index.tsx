import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/")({ component: Home });

const ONBOARD_KEY = "isabi_onboarding_done";
const HISTORY_KEY = "isabi_history";

type HistoryEntry = {
  id: string;
  type: "coin" | "lots";
  result: string;
  options: string[];
  timestamp: string;
};

type Mode = "home" | "coin" | "lots" | "history";

const slides = [
  {
    title: "Welcome to IsabiCasta",
    body: "A simple way to choose when you are stuck. It is inspired by the ancient practice of casting lots — used in Scripture for decisions, duties, and discovery.",
    verse: null as string | null,
  },
  {
    title: "Jonah and the sailors",
    body: "In a violent storm, the sailors cast lots to learn whose presence had brought the trouble. The lot fell on Jonah.",
    verse:
      "Jonah 1:7 — “Come, let us cast lots, that we may know on whose account this evil has come upon us.” So they cast lots, and the lot fell on Jonah.",
  },
  {
    title: "The Lord and the lot",
    body: "Lots were used for dividing land and choosing people for sacred duty. Scripture treats the outcome as under God’s sovereignty.",
    verse: "Proverbs 16:33 — “The lot is cast into the lap, but its every decision is from the Lord.”",
  },
  {
    title: "The Day of Atonement",
    body: "Two goats stood before Aaron. Lots decided which would be offered to the Lord and which would be sent away as the scapegoat.",
    verse:
      "Leviticus 16:8 — “And Aaron shall cast lots over the two goats, one lot for the Lord and the other lot for Azazel.”",
  },
  {
    title: "Choosing Matthias",
    body: "After Judas left the Twelve, the apostles prayed and cast lots between two qualified men. The lot fell on Matthias.",
    verse:
      "Acts 1:26 — “And they cast lots for them, and the lot fell on Matthias, and he was numbered with the eleven apostles.”",
  },
  {
    title: "A tool, not a prophecy",
    body: "IsabiCasta uses fair randomness to break a tie. It does not claim that a result reveals God’s specific will. Use it with prayer, counsel, and ordinary wisdom.",
    verse: null,
  },
];

function randomUnit() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0]! / 4294967296;
}

function randomIndex(length: number) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0]! % length;
}

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed.slice(0, 50) : [];
  } catch {
    return [];
  }
}

function Home() {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [slide, setSlide] = useState(0);
  const [mode, setMode] = useState<Mode>("home");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setOnboarded(localStorage.getItem(ONBOARD_KEY) === "true");
    setHistory(loadHistory());
    setReady(true);
  }, []);

  function finishOnboarding() {
    localStorage.setItem(ONBOARD_KEY, "true");
    setOnboarded(true);
  }

  function record(entry: Omit<HistoryEntry, "id" | "timestamp">) {
    const next: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    const list = [next, ...history].slice(0, 50);
    setHistory(list);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  }

  function clearHistory() {
    setHistory([]);
    localStorage.setItem(HISTORY_KEY, "[]");
  }

  if (!ready) {
    return <main className="min-h-screen bg-[#f3eee4]" />;
  }

  if (!onboarded) {
    return (
      <Onboarding
        slide={slide}
        onPrev={() => setSlide((n) => Math.max(0, n - 1))}
        onNext={() => {
          if (slide >= slides.length - 1) finishOnboarding();
          else setSlide((n) => n + 1);
        }}
        onSkip={finishOnboarding}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f3eee4] text-[#243028]">
      <header className="sticky top-0 z-10 border-b border-[#e2d8c6] bg-[#faf7f1]/95 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between px-5 py-3.5">
          <button type="button" className="flex items-center gap-2" onClick={() => setMode("home")}>
            <span className="text-[#b8954a]" aria-hidden>
              ✦
            </span>
            <span className="text-lg font-semibold tracking-tight text-[#2f4a38]">IsabiCasta</span>
          </button>
          {mode !== "home" ? (
            <button
              type="button"
              className="rounded-lg px-2 py-1 text-sm text-[#5c665d] hover:bg-black/5"
              onClick={() => setMode("home")}
            >
              ← Home
            </button>
          ) : null}
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-5 py-7">
        {mode === "home" ? (
          <HomeChoices
            historyCount={history.length}
            onCoin={() => setMode("coin")}
            onLots={() => setMode("lots")}
            onHistory={() => setMode("history")}
          />
        ) : null}
        {mode === "coin" ? <CoinFlip onResult={record} /> : null}
        {mode === "lots" ? <CastLots onResult={record} /> : null}
        {mode === "history" ? <HistoryPanel history={history} onClear={clearHistory} /> : null}
      </main>

      <footer className="px-5 pb-6 text-center text-xs text-[#6b726c]">
        Stays in this browser. Nothing you type is sent anywhere.
      </footer>
    </div>
  );
}

function Onboarding({
  slide,
  onPrev,
  onNext,
  onSkip,
}: {
  slide: number;
  onPrev: () => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  const current = slides[slide]!;
  const last = slide === slides.length - 1;
  return (
    <div className="flex min-h-screen items-center bg-[linear-gradient(165deg,#f6f1e7,#e7dece)] px-5 py-10">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        <div className="flex justify-center gap-2" aria-hidden>
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === slide ? "scale-125 bg-[#2f4a38]" : i < slide ? "bg-[#b8954a]" : "bg-[#d8cfc0]"
              }`}
            />
          ))}
        </div>
        <article className="lot-rise rounded-2xl border border-[#e4d9c6] bg-white p-6 shadow-[0_8px_28px_rgba(47,74,56,0.08)]">
          <h1 className="text-2xl font-semibold leading-tight text-[#2f4a38]">{current.title}</h1>
          <p className="mt-3 text-[1.05rem] leading-relaxed">{current.body}</p>
          {current.verse ? (
            <blockquote className="mt-4 border-l-[3px] border-[#b8954a] pl-3 text-sm leading-relaxed text-[#5c665d] italic">
              {current.verse}
            </blockquote>
          ) : null}
        </article>
        <div className="flex flex-wrap items-center gap-2">
          {slide > 0 ? (
            <button type="button" className="rounded-lg px-3 py-2 text-sm text-[#5c665d]" onClick={onPrev}>
              Previous
            </button>
          ) : null}
          <span className="flex-1" />
          <button type="button" className="rounded-lg px-3 py-2 text-sm text-[#5c665d]" onClick={onSkip}>
            Skip
          </button>
          <button
            type="button"
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${
              last ? "bg-[#b8954a] text-[#1d1a14]" : "bg-[#2f4a38] text-white"
            }`}
            onClick={onNext}
          >
            {last ? "Get Started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

function HomeChoices({
  historyCount,
  onCoin,
  onLots,
  onHistory,
}: {
  historyCount: number;
  onCoin: () => void;
  onLots: () => void;
  onHistory: () => void;
}) {
  return (
    <div className="lot-rise">
      <p className="mx-auto mb-7 max-w-[34ch] text-center text-[#5c665d]">
        A quiet way to decide when you are stuck. Inspired by casting lots.
      </p>
      <div className="flex flex-col gap-3">
        <Choice title="Flip a Coin" detail="Heads or tails" mark="H / T" onClick={onCoin} />
        <Choice title="Cast Lots" detail="Choose among your own options" mark="···" onClick={onLots} />
      </div>
      {historyCount > 0 ? (
        <button
          type="button"
          className="mt-6 w-full py-2 text-sm text-[#5c665d] underline-offset-4 hover:underline"
          onClick={onHistory}
        >
          Recent activity ({historyCount})
        </button>
      ) : null}
    </div>
  );
}

function Choice({
  title,
  detail,
  mark,
  onClick,
}: {
  title: string;
  detail: string;
  mark: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl border border-[#e2d8c6] bg-white px-5 py-4 text-left shadow-[0_6px_18px_rgba(47,74,56,0.05)] transition hover:border-[#2f4a38]"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#f4ecda] text-sm font-semibold tracking-wide text-[#2f4a38]">
        {mark}
      </span>
      <span>
        <span className="block text-lg font-semibold text-[#2f4a38]">{title}</span>
        <span className="block text-sm text-[#5c665d]">{detail}</span>
      </span>
    </button>
  );
}

function CoinFlip({ onResult }: { onResult: (e: Omit<HistoryEntry, "id" | "timestamp">) => void }) {
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<"Heads" | "Tails" | null>(null);

  function flip() {
    if (flipping) return;
    setFlipping(true);
    setResult(null);
    window.setTimeout(() => {
      const outcome = randomUnit() < 0.5 ? "Heads" : "Tails";
      setResult(outcome);
      setFlipping(false);
      onResult({ type: "coin", result: outcome, options: ["Heads", "Tails"] });
    }, 1350);
  }

  return (
    <section className="text-center">
      <h2 className="text-2xl font-semibold text-[#2f4a38]">Flip a Coin</h2>
      <p className="mt-1 text-sm text-[#5c665d]">A fair heads or tails.</p>
      <div className="my-8 grid h-40 place-items-center" style={{ perspective: "800px" }}>
        <div
          className={`relative h-28 w-28 ${flipping ? "coin-flipping" : ""}`}
          style={{ transformStyle: "preserve-3d", transform: result === "Tails" && !flipping ? "rotateY(180deg)" : undefined }}
          aria-live="polite"
        >
          <Face label="H" className="bg-[linear-gradient(145deg,#f3e6c4,#d4b06a)]" />
          <Face label="T" className="bg-[linear-gradient(145deg,#efe6d4,#c9b48a)]" flipped />
        </div>
      </div>
      {result && !flipping ? (
        <div className="lot-rise mb-6 rounded-2xl border border-[#e2d8c6] bg-white px-4 py-5">
          <p className="text-sm text-[#5c665d]">The lot has fallen on</p>
          <p className="mt-1 text-3xl font-semibold text-[#2f4a38]">{result}</p>
        </div>
      ) : null}
      <button
        type="button"
        disabled={flipping}
        onClick={flip}
        className="rounded-xl bg-[#2f4a38] px-6 py-3 font-semibold text-white disabled:opacity-60"
      >
        {flipping ? "Flipping…" : result ? "Flip Again" : "Flip Coin"}
      </button>
    </section>
  );
}

function Face({ label, className, flipped }: { label: string; className: string; flipped?: boolean }) {
  return (
    <div
      className={`absolute inset-0 grid place-items-center rounded-full border-4 border-[#b8954a] text-4xl font-bold text-[#243628] shadow-md ${className}`}
      style={{ backfaceVisibility: "hidden", transform: flipped ? "rotateY(180deg)" : undefined }}
    >
      {label}
    </div>
  );
}

function CastLots({ onResult }: { onResult: (e: Omit<HistoryEntry, "id" | "timestamp">) => void }) {
  const [text, setText] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [casting, setCasting] = useState(false);
  const [error, setError] = useState("");

  const options = useMemo(
    () =>
      text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    [text],
  );

  function cast() {
    if (options.length < 2) {
      setError("Enter at least two options, one per line.");
      return;
    }
    setError("");
    setCasting(true);
    setSelected(null);
    const snapshot = [...options];
    window.setTimeout(() => {
      const pick = snapshot[randomIndex(snapshot.length)]!;
      setSelected(pick);
      setCasting(false);
      onResult({ type: "lots", result: pick, options: snapshot });
    }, 650);
  }

  return (
    <section>
      <h2 className="text-center text-2xl font-semibold text-[#2f4a38]">Cast Lots</h2>
      <p className="mt-1 mb-5 text-center text-sm text-[#5c665d]">One option per line. The lot chooses one.</p>
      {selected === null ? (
        <>
          <label className="sr-only" htmlFor="options">
            Options, one per line
          </label>
          <textarea
            id="options"
            rows={6}
            value={text}
            disabled={casting}
            onChange={(e) => setText(e.target.value)}
            placeholder={"Stay home\nGo out\nAsk a friend"}
            className="w-full resize-y rounded-xl border border-[#e2d8c6] bg-white px-4 py-3 text-base outline-none focus:border-[#2f4a38]"
          />
          <p className="mt-2 mb-3 text-sm text-[#5c665d]">
            {options.length} valid option{options.length === 1 ? "" : "s"}
            {options.length === 1 ? <span className="text-[#9a5b12]"> — need at least 2</span> : null}
          </p>
          {error ? (
            <p className="mb-3 text-sm text-[#9b2c2c]" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="button"
            disabled={casting || options.length < 2}
            onClick={cast}
            className="w-full rounded-xl bg-[#2f4a38] px-6 py-3 font-semibold text-white disabled:opacity-50"
          >
            {casting ? "Casting…" : "Cast Lots"}
          </button>
        </>
      ) : (
        <div className="text-center">
          <div className="lot-rise mb-6 rounded-2xl border border-[#e2d8c6] bg-white px-4 py-6">
            <p className="text-sm text-[#5c665d]">The lot has fallen on</p>
            <p className="mt-2 text-2xl font-semibold break-words text-[#2f4a38]">{selected}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button type="button" onClick={cast} className="rounded-xl bg-[#2f4a38] px-5 py-3 font-semibold text-white">
              Cast Again
            </button>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-xl border border-[#2f4a38] px-5 py-3 font-semibold text-[#2f4a38]"
            >
              Edit Options
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function HistoryPanel({ history, onClear }: { history: HistoryEntry[]; onClear: () => void }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-[#2f4a38]">Recent activity</h2>
        {history.length > 0 ? (
          <button type="button" className="text-sm text-[#9b2c2c]" onClick={onClear}>
            Clear all
          </button>
        ) : null}
      </div>
      {history.length === 0 ? (
        <p className="py-10 text-center text-[#5c665d]">Nothing yet. Flip a coin or cast lots.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {history.map((item) => (
            <li key={item.id} className="rounded-2xl border border-[#e2d8c6] bg-white px-4 py-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-xs font-semibold tracking-wide text-[#b8954a] uppercase">
                  {item.type === "coin" ? "Coin flip" : "Cast lots"}
                </span>
                <time className="text-xs text-[#6b726c]" dateTime={item.timestamp}>
                  {new Date(item.timestamp).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
              <p className="mt-1">
                The lot fell on <strong className="text-[#2f4a38]">{item.result}</strong>
              </p>
              {item.type === "lots" ? (
                <p className="mt-0.5 text-sm text-[#6b726c]">from {item.options.length} options</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
