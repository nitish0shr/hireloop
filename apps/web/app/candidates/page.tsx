"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AtSign,
  BadgeCheck,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  Filter,
  Mail,
  MapPin,
  Search,
  Sparkles,
  Star,
  User,
  Users,
} from "lucide-react";

// Types
type Stage = "Applied" | "Screening" | "Interview" | "Offer" | "Hired";

type Candidate = {
  id: string;
  name: string;
  title: string;
  location: string;
  experience: number; // years
  stage: Stage;
  email: string;
  score: number; // 0-100
  badges: string[]; // e.g., ["Top 5%", "Referral"]
  avatarColor: string; // tailwind bg-* color
};

// Demo data
const CANDIDATES: Candidate[] = [
  {
    id: "C-501",
    name: "Ava Thompson",
    title: "Frontend Engineer",
    location: "Remote - US",
    experience: 5,
    stage: "Interview",
    email: "ava.thompson@example.com",
    score: 92,
    badges: ["Top 5%", "Portfolio"],
    avatarColor: "bg-violet-500",
  },
  {
    id: "C-502",
    name: "Noah Patel",
    title: "Data Scientist",
    location: "Toronto, CA",
    experience: 4,
    stage: "Screening",
    email: "noah.patel@example.com",
    score: 86,
    badges: ["Referral"],
    avatarColor: "bg-rose-500",
  },
  {
    id: "C-503",
    name: "Mia Garcia",
    title: "Product Designer",
    location: "NYC, NY",
    experience: 6,
    stage: "Offer",
    email: "mia.garcia@example.com",
    score: 88,
    badges: ["Dribbble", "Case Study"],
    avatarColor: "bg-emerald-500",
  },
  {
    id: "C-504",
    name: "Liam Chen",
    title: "Backend Engineer",
    location: "Remote - EU",
    experience: 7,
    stage: "Applied",
    email: "liam.chen@example.com",
    score: 74,
    badges: ["OSS"],
    avatarColor: "bg-cyan-500",
  },
  {
    id: "C-505",
    name: "Sophia Nguyen",
    title: "Talent Partner",
    location: "Austin, TX",
    experience: 8,
    stage: "Hired",
    email: "sophia.nguyen@example.com",
    score: 95,
    badges: ["Internal"],
    avatarColor: "bg-amber-500",
  },
];

const stageBadge: Record<Stage, string> = {
  Applied: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  Screening: "bg-violet-100 text-violet-700 ring-1 ring-violet-200",
  Interview: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  Offer: "bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200",
  Hired: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
};

const scoreColor = (s: number) =>
  s >= 90 ? "text-emerald-600" : s >= 80 ? "text-amber-600" : "text-slate-600";

export default function CandidatesPage() {
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<"all" | Stage>("all");
  const [minScore, setMinScore] = useState(0);

  const stages = ["Applied", "Screening", "Interview", "Offer", "Hired"] as const;

  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return CANDIDATES.filter((c) => {
      const matchesQuery =
        c.name.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.badges.some((b) => b.toLowerCase().includes(query));
      const matchesStage = stage === "all" ? true : c.stage === stage;
      const matchesScore = c.score >= minScore;
      return matchesQuery && matchesStage && matchesScore;
    });
  }, [q, stage, minScore]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 ring-1 ring-violet-200">
            <Sparkles className="h-3.5 w-3.5" />
            Smart Candidate Hub
          </div>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Candidates</h1>
          <p className="text-sm text-slate-500">
            Manage applicants, track stages, and collaborate with your team.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow hover:bg-slate-800">
            <Users className="h-4 w-4" /> Bulk Actions
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
            <Building2 className="h-4 w-4" /> New Job Link
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, title, location, badge, email"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as any)}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm text-slate-900 shadow-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
            >
              <option value="all">All stages</option>
              {stages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
          </div>
          <div className="relative w-full">
            <input
              type="range"
              min={0}
              max={100}
              value={minScore}
              onChange={(e) => setMinScore(parseInt(e.target.value))}
              className="w-full accent-violet-500"
            />
            <div className="mt-1 text-xs text-slate-500">Min score: {minScore}</div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50">
            <Filter className="h-4 w-4" /> Advanced Filters
          </button>
          <button className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white shadow hover:bg-violet-500">
            <Sparkles className="h-4 w-4" /> AI Suggest
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <SummaryCard label="Total" value={CANDIDATES.length} icon={Users} color="text-slate-700" />
        <SummaryCard
          label="In Process"
          value={CANDIDATES.filter((c) => ["Interview", "Offer"].includes(c.stage)).length}
          icon={BadgeCheck}
          color="text-amber-600"
        />
        <SummaryCard label="Hired" value={CANDIDATES.filter((c) => c.stage === "Hired").length} icon={Check} color="text-emerald-600" />
        <SummaryCard label="Avg. Score" value={`${Math.round(CANDIDATES.reduce((a, c) => a + c.score, 0) / CANDIDATES.length)}`} icon={Star} color="text-violet-600" />
      </div>

      {/* Table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
          <div className="col-span-4">Candidate</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Location</div>
          <div className="col-span-1">Exp</div>
          <div className="col-span-1">Score</div>
          <div className="col-span-2">Stage</div>
        </div>
        <ul className="divide-y divide-slate-100">
          <AnimatePresence initial={false}>
            {filtered.map((c, i) => (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-12 items-center px-4 py-4 hover:bg-slate-50/60"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className={`grid h-10 w-10 place-items-center rounded-full ${c.avatarColor} text-white ring-2 ring-white shadow`}>
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-slate-900">{c.name}</div>
                      {c.badges.slice(0, 2).map((b) => (
                        <span key={b} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 ring-1 ring-slate-200">
                          <Sparkles className="h-3 w-3 text-violet-500" /> {b}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500">
                      {c.id} •
                      <a className="text-violet-600 hover:underline ml-1" href={`mailto:${c.email}`}>
                        <AtSign className="mr-1 inline h-3 w-3" />
                        {c.email}
                      </a>
                    </div>
                    <div className="mt-1 flex gap-2">
                      <a href={`/candidates/${c.id}`} className="group inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-violet-600 hover:bg-violet-50">
                        Profile
                      </a>
                      <a href={`mailto:${c.email}`} className="group inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-600 hover:bg-slate-50">
                        <Mail className="h-3.5 w-3.5" /> Email
                      </a>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 text-slate-700 flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-slate-400" /> {c.title}
                </div>
                <div className="col-span-2 text-slate-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" /> {c.location}
                </div>
                <div className="col-span-1 text-slate-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" /> {c.experience}y
                </div>

                <div className="col-span-1 font-semibold ${scoreColor(c.score)}">{c.score}</div>

                <div className="col-span-2 flex items-center gap-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${stageBadge[c.stage]}`}>
                    {c.stage}
                  </span>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </section>

      {/* Footer note */}
      <p className="mt-4 text-xs text-slate-500">
        Tip: Use search and filters to quickly find top candidates. Scores are AI-assisted.
      </p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Icon className={`h-4 w-4 ${color ?? "text-slate-500"}`} /> {label}
      </div>
      <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}
