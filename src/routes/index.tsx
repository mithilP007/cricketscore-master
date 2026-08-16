import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Radio,
  Share2,
  Trophy,
  Users,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CricketScorer Pro — Your Cricket Matters" },
      {
        name: "description",
        content:
          "Ball-by-ball live cricket scoring, scorecards, leaderboards and tournaments for grassroots teams.",
      },
      { property: "og:title", content: "CricketScorer Pro — Your Cricket Matters" },
      {
        property: "og:description",
        content: "Score matches like a pro. Live, offline-ready cricket scoring.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Radio, title: "Live Scoring", desc: "Ball-by-ball entry that feels instant." },
  { icon: Trophy, title: "Tournaments", desc: "Fixtures, points table and NRR handled." },
  { icon: BarChart3, title: "Player Stats", desc: "Career averages, SR, economy, milestones." },
  { icon: Activity, title: "Leaderboards", desc: "Most runs, wickets and best averages." },
  { icon: Users, title: "Team Profiles", desc: "Rosters, jerseys, captains and keepers." },
  { icon: Share2, title: "Share Scorecards", desc: "One-tap share to your team group." },
];

const liveMatches = [
  { a: "Royal Strikers", b: "Thunder Bolts", score: "142/3", overs: "15.2", need: "T20 · Match 12" },
  { a: "City Titans", b: "Harbour XI", score: "88/5", overs: "11.4", need: "T20 · Match 13" },
  { a: "Sunrise CC", b: "Old Boys", score: "201/6", overs: "20.0", need: "Innings break" },
];

function Landing() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="pitch-gradient relative isolate overflow-hidden">
        <div
          aria-hidden
          className="animate-ball-arc absolute bottom-24 left-6 size-6 rounded-full bg-gold-400 shadow-elevated"
        />
        <div className="mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center px-6 py-24">
          <span className="w-fit rounded-full border border-cricket-500/40 bg-cricket-950/60 px-4 py-1.5 text-xs font-semibold tracking-widest text-cricket-300 uppercase">
            CricketScorer Pro
          </span>
          <h1 className="mt-6 max-w-3xl text-5xl leading-[1.05] font-extrabold tracking-tight sm:text-7xl">
            Your Cricket <span className="text-gold-400">Matters</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Professional-grade scoring for local grounds. Every dot, boundary and wicket
            captured live — even when the signal drops.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-xl active:scale-95">
              <Link to="/matches/$matchId/score" params={{ matchId: "demo" }}>
                Start Scoring Free <ChevronRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl active:scale-95">
              <Link to="/matches/$matchId/scorecard" params={{ matchId: "demo" }}>
                View a scorecard
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-2xl font-bold">Live right now</h2>
        <div className="mt-6 flex snap-x gap-4 overflow-x-auto pb-4">
          {liveMatches.map((m) => (
            <article
              key={m.need}
              className="min-w-[280px] snap-start rounded-2xl border border-border bg-surface p-5 shadow-lg"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="size-2 animate-pulse rounded-full bg-destructive" />
                {m.need}
              </div>
              <p className="mt-4 font-semibold">{m.a}</p>
              <p className="stat-num text-3xl font-bold text-cricket-400">{m.score}</p>
              <p className="stat-num text-sm text-muted-foreground">{m.overs} overs</p>
              <p className="mt-3 text-sm text-muted-foreground">vs {m.b}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-2xl font-bold">Everything a scorer needs</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.title}
              className="rounded-2xl border border-border bg-surface p-6 shadow-lg transition-all duration-200 hover:border-cricket-600/60"
            >
              <f.icon className="size-6 text-cricket-400" aria-hidden />
              <h3 className="mt-4 font-bold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        Built with passion for grassroots cricket.
      </footer>
    </main>
  );
}
