import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  createMatch,
  economy,
  oversFromBalls,
  strikeRate,
} from "@/lib/cricket";

export const Route = createFileRoute("/matches/$matchId/scorecard")({
  head: () => ({
    meta: [
      { title: "Scorecard — CricketScorer Pro" },
      { name: "description", content: "Full batting, bowling and fall-of-wickets scorecard." },
      { property: "og:title", content: "Scorecard — CricketScorer Pro" },
      { property: "og:description", content: "Full cricket match scorecard." },
    ],
  }),
  component: Scorecard,
});

function Scorecard() {
  const { matchId } = Route.useParams();
  const m = createMatch();

  return (
    <main className="min-h-screen bg-background pb-16">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Button asChild size="icon" variant="ghost" aria-label="Back to scoring">
          <Link to="/matches/$matchId/score" params={{ matchId }}>
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <h1 className="text-sm font-semibold">
          {m.battingTeam} vs {m.bowlingTeam}
        </h1>
      </header>

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-lg">
          <p className="font-bold uppercase">{m.battingTeam}</p>
          <p className="stat-num text-3xl font-extrabold text-cricket-400">
            {m.runs}/{m.wickets}
          </p>
          <p className="stat-num text-sm text-muted-foreground">
            {oversFromBalls(m.legalBalls)} overs
          </p>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
          <h2 className="border-b border-border p-4 font-bold">Batting</h2>
          <table className="w-full text-sm">
            <thead className="text-muted-foreground">
              <tr className="[&>th]:p-3 [&>th]:text-right [&>th:first-child]:text-left">
                <th>Batter</th>
                <th>R</th>
                <th>B</th>
                <th>4s</th>
                <th>6s</th>
                <th>SR</th>
              </tr>
            </thead>
            <tbody>
              {m.batsmen.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-border [&>td]:p-3 [&>td]:text-right [&>td:first-child]:text-left"
                >
                  <td className={b.out ? "text-muted-foreground" : "font-semibold text-cricket-400"}>
                    {b.name} {b.out ? "" : "*"}
                    <span className="block text-xs text-muted-foreground">
                      {b.dismissal ?? "not out"}
                    </span>
                  </td>
                  <td className="stat-num font-bold">{b.runs}</td>
                  <td className="stat-num">{b.balls}</td>
                  <td className="stat-num">{b.fours}</td>
                  <td className="stat-num">{b.sixes}</td>
                  <td className="stat-num">{strikeRate(b.runs, b.balls).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-border p-3 text-xs text-muted-foreground">
            Extras: {m.extras.wides + m.extras.noBalls + m.extras.byes + m.extras.legByes} (wd{" "}
            {m.extras.wides}, nb {m.extras.noBalls}, b {m.extras.byes}, lb {m.extras.legByes})
          </p>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
          <h2 className="border-b border-border p-4 font-bold">Bowling</h2>
          <table className="w-full text-sm">
            <thead className="text-muted-foreground">
              <tr className="[&>th]:p-3 [&>th]:text-right [&>th:first-child]:text-left">
                <th>Bowler</th>
                <th>O</th>
                <th>M</th>
                <th>R</th>
                <th>W</th>
                <th>Econ</th>
              </tr>
            </thead>
            <tbody>
              {m.bowlers.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-border [&>td]:p-3 [&>td]:text-right [&>td:first-child]:text-left"
                >
                  <td className="font-semibold">{b.name}</td>
                  <td className="stat-num">{oversFromBalls(b.balls)}</td>
                  <td className="stat-num">{b.maidens}</td>
                  <td className="stat-num">{b.runs}</td>
                  <td className="stat-num font-bold text-cricket-400">{b.wickets}</td>
                  <td className="stat-num">{economy(b.runs, b.balls).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-lg">
          <h2 className="font-bold">Fall of wickets</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {m.fallOfWickets.map((f) => (
              <li key={f.name} className="stat-num">
                {f.wickets}-{f.runs} ({f.name}, {f.over} ov)
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
