"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AtSign, BadgeCheck, Building2, Calendar, Filter, Mail, MapPin, Search, Sparkles, User, Users } from "lucide-react";

type Candidate = {
  id: string;
  name: string;
  title: string;
  location: string;
  experience: number; // years
  stage: "Applied" | "Screening" | "Interview" | "Offer" | "Hired";
  email: string;
};

const CANDIDATES: Candidate[] = [
  { id: "C-501", name: "Ava Thompson", title: "Frontend Engineer", location: "Remote - US", experience: 5, stage: "Interview", email: "ava.thompson@example.com" },
  { id: "C-502", name: "Noah Patel", title: "Data Scientist", location: "Toronto, CA", experience: 4, stage: "Screening", email: "noah.patel@example.com" },
  { id: "C-503", name: "Mia Garcia", title: "Product Designer", location: "NYC, NY", experience: 6, stage: "Offer", email: "mia.garcia@example.com" },
  { id: "C-504", name: "Liam Chen", title: "Backend Engineer", location: "Remote - EU", experience: 7, stage: "Applied", email: "liam.chen@example.com" },
  { id: "C-505", name: "Sophia Nguyen", title: "Talent Partner", location: "Austin, TX", experience: 8, stage: "Hired", email: "sophia.nguyen@example.com" },
];

const stageBadge: Record<Candidate["stage"], string> = {
  Applied: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  Screening: "bg-violet-100 text-violet-700 ring-1 ring-violet-200",
  Interview: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  Offer: "bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200",
  Hired: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
};

export default function CandidatesPage() {
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<"all" | Candidate["stage"]>("all");

  const stages = ["Applied", "Screening", "Interview", "Offer", "Hired"] as const;

  const filtered = useMemo(() => {
    return CANDIDATES.filter(c =>
      (stage === "all" || c.stage === stage) &&
      (q.trim() === "" || [c.name, c.title, c.location, c.id].join(" ").toLowerCase().includes(q.toLowerCase()))
    );
  }, [q, stage]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-7xl p-6">
        <header className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.div initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="grid h-12 w-12 place-items-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200">
                <Users className="h-6 w-6" />
              </motion.div>
              <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Candidates</h1>
              <p className="text-sm text-slate-500">Search profiles, track stages, and view enriched candidate data.</p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 pb-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, role, or location…" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
              <Filter className="h-3.5 w-3.5" /> Stage filter
            </div>
            <select className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" value={stage} onChange={e => setStage(e.target.value as any)}>
              <option value="all">All stages</option>
              {stages.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur">
            <div className="text-xs text-slate-500">Total candidates</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">{CANDIDATES.length}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur">
            <div className="text-xs text-slate-500">In interview / offers</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">{CANDIDATES.filter(c => ["Interview","Offer"].includes(c.stage)).length}</div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
            <div className="col-span-3">Candidate</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Location</div>
            <div className="col-span-2">Experience</div>
            <div className="col-span-3">Stage</div>
          </div>
          <ul className="divide-y divide-slate-100">
            {filtered.map((c, i) => (
              <motion.li key={c.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="grid grid-cols-12 items-center px-4 py-4 hover:bg-slate-50/60">
                <div className="col-span-3 flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-violet-50 text-violet-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{c.name}</div>
                    <div className="text-xs text-slate-500">{c.id} • <a className="text-violet-600 hover:underline" href={`mailto:${c.email}`}><AtSign className="mr-1 inline h-3 w-3" />{c.email}</a></div>
                  </div>
                </div>
                <div className="col-span-2 text-slate-700 flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-slate-400" /> {c.title}
                </div>
                <div className="col-span-2 text-slate-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" /> {c.location}
                </div>
                <div className="col-span-2 text-slate-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" /> {c.experience} yrs
                </div>
                <div className="col-span-3 flex items-center gap-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${stageBadge[c.stage]}`}>{c.stage}</span>
                  <a href={`/candidates/${c.id}`} className="group inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-violet-600 hover:bg-violet-50">
                    Profile
                  </a>
                  <a href={`mailto:${c.email}`} className="group inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-600 hover:bg-slate-50">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </a>
                </div>
              </motion.li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
