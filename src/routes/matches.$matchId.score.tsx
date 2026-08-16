import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, RotateCcw, Skull, Wifi } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  applyBall,
  createMatch,
  economy,
  oversFromBalls,
  runRate,
  strikeRate,
  type DismissalType,
  type MatchState,
  type ScoreInput,
} from "@/lib/cricket";

export const Route = createFileRoute("/matches/$matchId/score")({
  head: () => ({
    meta: [
      { title: "Live Scoring — CricketScorer Pro" },
      { name: "description", content: "Ball-by-ball live cricket scoring console." },
      { property: "og:title", content: "Live Scoring — CricketScorer Pro" },
      { property: "og:description", content: "Score every ball in real time." },
    ],
  }),
  component: ScoringScreen,
});

const DISMISSALS: DismissalType[] = [
  "Bowled",
  "Caught",
  "LBW",
  "Run Out",
  "Stumped",
  "Hit Wicket",
];

function BatsmanCard({
  name,
  runs,
  balls,
  onStrike,
}: {
  name: string;
  runs: number;
  balls: number;
  onStrike: boolean;
}) {
  const sr = strikeRate(runs, balls);
  return (
    <div
      className={`rounded-2xl border bg-surface p-4 shadow-lg ${onStrike ? "border-cricket-500" : "border-border"}`}
    >
      <p className="text-xs tracking-wider text-muted-foreground uppercase">
        {onStrike ? "Striker" : "Non-striker"}
      </p>
      <p className="mt-1 font-bold">{name}</p>
      <p className="stat-num text-2xl font-bold text-cricket-400">
        {runs}
        {onStrike ? "*" : ""} <span className="text-sm text-muted-foreground">({balls})</span>
      </p>
      <Progress value={Math.min(sr / 2, 100)} className="mt-3 h-1.5" />
      <p className="stat-num mt-2 text-xs text-muted-foreground">SR: {sr.toFixed(1)}</p>
    </div>
  );
}

function ScoringScreen() {
  const { matchId } = Route.useParams();
  const [history, setHistory] = useState<MatchState[]>([createMatch()]);
  const [wicketOpen, setWicketOpen] = useState(false);
  const [dismissal, setDismissal] = useState<DismissalType>("Bowled");
  const [flash, setFlash] = useState(0);

  const state = history[history.length - 1];
  const striker = state.batsmen.find((b) => b.id === state.strikerId)!;
  const nonStriker = state.batsmen.find((b) => b.id === state.nonStrikerId)!;
  const bowler = state.bowlers.find((b) => b.id === state.bowlerId)!;

  const currentOver = useMemo(
    () => state.timeline.slice(-Math.max(state.legalBalls % 6, 1) - 2).slice(-6),
    [state.timeline, state.legalBalls],
  );

  function score(input: ScoreInput) {
    setHistory((h) => [...h, applyBall(h[h.length - 1], input)]);
    setFlash((f) => f + 1);
    if (input.type === "run" && input.runs === 4) toast.success("FOUR! 🏏");
    if (input.type === "run" && input.runs === 6) toast.success("SIX! 🎉");
    if (input.type === "wicket") toast.error(`WICKET! ${input.dismissal}`);
  }

  function undo() {
    if (history.length === 1) return toast("Nothing to undo");
    setHistory((h) => h.slice(0, -1));
    toast("Last ball undone");
  }

  const progress = (state.legalBalls / (state.totalOvers * 6)) * 100;

  return (
    <main className="min-h-screen bg-background pb-10">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
        <Button asChild size="icon" variant="ghost" aria-label="Back to home">
          <Link to="/">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <p className="flex-1 truncate text-sm font-semibold">
          {state.battingTeam} vs {state.bowlingTeam}
        </p>
        <span className="flex items-center gap-1.5 rounded-full bg-destructive/15 px-2.5 py-1 text-xs font-semibold text-destructive">
          <span className="size-1.5 animate-pulse rounded-full bg-destructive" /> LIVE
        </span>
      </header>

      <div className="mx-auto max-w-5xl space-y-4 px-4 py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:space-y-0">
        <section className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-lg">
            <div className="flex items-end justify-between">
              <p className="font-bold tracking-wide uppercase">{state.battingTeam}</p>
              <p key={flash} className="stat-num animate-score-pop text-4xl font-extrabold">
                {state.runs}/{state.wickets}
              </p>
            </div>
            <p className="stat-num mt-2 text-sm text-muted-foreground">
              {oversFromBalls(state.legalBalls)} overs · CRR{" "}
              {runRate(state.runs, state.legalBalls).toFixed(2)}
            </p>
            <Progress value={progress} className="mt-3 h-2" />
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 text-sm shadow-lg">
            <p className="font-semibold text-muted-foreground">{state.bowlingTeam}</p>
            <p className="text-muted-foreground">Yet to bat</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <BatsmanCard {...striker} onStrike />
            <BatsmanCard {...nonStriker} onStrike={false} />
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 shadow-lg">
            <p className="font-bold">🎯 {bowler.name}</p>
            <p className="stat-num mt-1 text-sm text-muted-foreground">
              {oversFromBalls(bowler.balls)}-{bowler.maidens}-{bowler.runs}-{bowler.wickets} ·
              Econ {economy(bowler.runs, bowler.balls).toFixed(2)}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface p-4 shadow-lg">
            <span className="text-xs tracking-wider text-muted-foreground uppercase">
              This over
            </span>
            <div className="flex flex-wrap gap-2">
              {currentOver.length === 0 && (
                <span className="text-sm text-muted-foreground">—</span>
              )}
              {currentOver.map((b) => (
                <span
                  key={b.id}
                  className={`stat-num flex size-8 items-center justify-center rounded-full text-xs font-bold ${
                    b.type === "wicket"
                      ? "bg-destructive text-destructive-foreground"
                      : b.runs === 6
                        ? "bg-gold-500 text-background"
                        : b.runs === 4
                          ? "bg-cricket-600 text-primary-foreground"
                          : "bg-surface-elevated text-foreground"
                  }`}
                >
                  {b.type === "wicket" ? "W" : b.type === "wide" ? "wd" : b.runs}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 6].map((r) => (
              <button
                key={r}
                onClick={() => score({ type: "run", runs: r })}
                aria-label={`${r} runs`}
                className={`stat-num min-h-[72px] cursor-pointer rounded-xl border text-2xl font-bold transition-all duration-200 active:scale-95 ${
                  r === 6
                    ? "border-gold-500 bg-surface text-gold-400"
                    : r === 4
                      ? "border-cricket-500 bg-surface text-cricket-400"
                      : "border-border bg-surface-elevated"
                }`}
              >
                {r}
                {r === 4 && <span className="block text-[10px] tracking-widest">FOUR</span>}
                {r === 6 && <span className="block text-[10px] tracking-widest">SIX</span>}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {(
              [
                ["Wide", "wide"],
                ["NB", "noball"],
                ["Bye", "bye"],
                ["LB", "legbye"],
              ] as const
            ).map(([label, type]) => (
              <button
                key={type}
                onClick={() => score({ type, runs: 0 })}
                aria-label={label}
                className="min-h-[52px] cursor-pointer rounded-xl border border-border bg-surface text-sm font-semibold transition-all duration-200 active:scale-95 hover:bg-surface-elevated"
              >
                {label}
              </button>
            ))}
          </div>

          <Button
            variant="destructive"
            className="h-14 w-full rounded-xl text-base font-bold active:scale-95"
            onClick={() => setWicketOpen(true)}
          >
            <Skull className="size-5" /> WICKET
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 rounded-xl active:scale-95" onClick={undo}>
              <RotateCcw className="size-4" /> Undo
            </Button>
            <Button asChild variant="secondary" className="flex-1 rounded-xl active:scale-95">
              <Link to="/matches/$matchId/scorecard" params={{ matchId }}>
                Scorecard
              </Link>
            </Button>
          </div>

          <p className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
            <Wifi className="size-3.5" /> Synced
          </p>
        </section>
      </div>

      <Dialog open={wicketOpen} onOpenChange={setWicketOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>How was {striker.name} out?</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            {DISMISSALS.map((d) => (
              <button
                key={d}
                onClick={() => setDismissal(d)}
                className={`cursor-pointer rounded-xl border p-3 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                  dismissal === d ? "border-cricket-500 bg-cricket-950" : "border-border bg-surface"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button
              className="w-full rounded-xl active:scale-95"
              onClick={() => {
                score({ type: "wicket", runs: 0, dismissal });
                setWicketOpen(false);
              }}
            >
              Confirm wicket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
