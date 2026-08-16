export type BallEventType = "run" | "wide" | "noball" | "bye" | "legbye" | "wicket";

export type DismissalType =
  | "Bowled"
  | "Caught"
  | "LBW"
  | "Run Out"
  | "Stumped"
  | "Hit Wicket";

export interface BallEvent {
  id: string;
  type: BallEventType;
  runs: number;
  dismissal?: DismissalType | undefined;
  batsmanId: string;
  bowlerId: string;
  over: number;
  ballInOver: number;
  ts: number;
}

export interface Batsman {
  id: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  out: boolean;
  dismissal?: string;
}

export interface Bowler {
  id: string;
  name: string;
  balls: number;
  runs: number;
  wickets: number;
  maidens: number;
}

export interface MatchState {
  matchId: string;
  battingTeam: string;
  bowlingTeam: string;
  totalOvers: number;
  runs: number;
  wickets: number;
  legalBalls: number;
  extras: { wides: number; noBalls: number; byes: number; legByes: number };
  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;
  batsmen: Batsman[];
  bowlers: Bowler[];
  bench: { id: string; name: string }[];
  timeline: BallEvent[];
  fallOfWickets: { runs: number; wickets: number; over: string; name: string }[];
}

export const isLegal = (t: BallEventType) => t !== "wide" && t !== "noball";

export const oversFromBalls = (balls: number) => `${Math.floor(balls / 6)}.${balls % 6}`;

export const runRate = (runs: number, balls: number) =>
  balls === 0 ? 0 : (runs / balls) * 6;

export const strikeRate = (runs: number, balls: number) =>
  balls === 0 ? 0 : (runs / balls) * 100;

export const economy = (runs: number, balls: number) =>
  balls === 0 ? 0 : (runs / balls) * 6;

export function createMatch(): MatchState {
  const batsmen: Batsman[] = [
    { id: "p1", name: "R Sharma", runs: 68, balls: 42, fours: 7, sixes: 3, out: false },
    { id: "p2", name: "V Kohli", runs: 12, balls: 8, fours: 1, sixes: 0, out: false },
  ];
  return {
    matchId: "demo",
    battingTeam: "Royal Strikers",
    bowlingTeam: "Thunder Bolts",
    totalOvers: 20,
    runs: 142,
    wickets: 3,
    legalBalls: 92,
    extras: { wides: 4, noBalls: 1, byes: 2, legByes: 3 },
    strikerId: "p1",
    nonStrikerId: "p2",
    bowlerId: "b1",
    batsmen,
    bowlers: [
      { id: "b1", name: "J Bumrah", balls: 14, runs: 18, wickets: 1, maidens: 0 },
      { id: "b2", name: "M Shami", balls: 24, runs: 34, wickets: 2, maidens: 1 },
    ],
    bench: [
      { id: "p4", name: "S Iyer" },
      { id: "p5", name: "R Pant" },
      { id: "p6", name: "H Pandya" },
    ],
    timeline: [],
    fallOfWickets: [
      { runs: 24, wickets: 1, over: "3.2", name: "S Gill" },
      { runs: 68, wickets: 2, over: "8.4", name: "Y Jaiswal" },
      { runs: 110, wickets: 3, over: "12.1", name: "S Samson" },
    ],
  };
}

export interface ScoreInput {
  type: BallEventType;
  runs: number;
  dismissal?: DismissalType;
  newBatsmanId?: string;
}

export function applyBall(state: MatchState, input: ScoreInput): MatchState {
  const next: MatchState = structuredClone(state);
  const striker = next.batsmen.find((b) => b.id === next.strikerId)!;
  const bowler = next.bowlers.find((b) => b.id === next.bowlerId)!;
  const legal = isLegal(input.type);

  let runsToTeam = input.runs;
  if (input.type === "wide") {
    runsToTeam += 1;
    next.extras.wides += 1 + input.runs;
  } else if (input.type === "noball") {
    runsToTeam += 1;
    next.extras.noBalls += 1;
  } else if (input.type === "bye") {
    next.extras.byes += input.runs;
  } else if (input.type === "legbye") {
    next.extras.legByes += input.runs;
  }

  next.runs += runsToTeam;
  bowler.runs += runsToTeam;

  if (input.type === "run" || input.type === "noball") {
    striker.runs += input.runs;
    if (input.runs === 4) striker.fours += 1;
    if (input.runs === 6) striker.sixes += 1;
  }
  if (legal) {
    striker.balls += 1;
    bowler.balls += 1;
    next.legalBalls += 1;
  }

  if (input.type === "wicket") {
    striker.out = true;
    striker.dismissal = `${input.dismissal ?? "Bowled"} b ${bowler.name}`;
    next.wickets += 1;
    if (input.dismissal !== "Run Out") bowler.wickets += 1;
    next.fallOfWickets.push({
      runs: next.runs,
      wickets: next.wickets,
      over: oversFromBalls(next.legalBalls),
      name: striker.name,
    });
    const incoming = input.newBatsmanId
      ? next.bench.find((p) => p.id === input.newBatsmanId)
      : next.bench[0];
    if (incoming) {
      next.bench = next.bench.filter((p) => p.id !== incoming.id);
      next.batsmen.push({
        id: incoming.id,
        name: incoming.name,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        out: false,
      });
      next.strikerId = incoming.id;
    }
  } else if (input.runs % 2 === 1 && input.type !== "wide") {
    const s = next.strikerId;
    next.strikerId = next.nonStrikerId;
    next.nonStrikerId = s;
  }

  if (legal && next.legalBalls % 6 === 0 && input.type !== "wicket") {
    const s = next.strikerId;
    next.strikerId = next.nonStrikerId;
    next.nonStrikerId = s;
  }

  next.timeline.push({
    id: crypto.randomUUID(),
    type: input.type,
    runs: input.runs,
    dismissal: input.dismissal,
    batsmanId: striker.id,
    bowlerId: bowler.id,
    over: Math.floor(next.legalBalls / 6),
    ballInOver: next.legalBalls % 6,
    ts: Date.now(),
  });

  return next;
}
