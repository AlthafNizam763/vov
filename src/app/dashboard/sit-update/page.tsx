"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Save, Plus, Trash2, Lock, Pencil, X } from "lucide-react";
import { useDashboardUser } from "../UserContext";
import { canEditContent } from "../../../lib/roles";

const NAV_ITEMS = [
  { key: "hero", label: "Hero Section" },
  { key: "campaign", label: "Our Campaign" },
  { key: "program", label: "Latest Program" },
  { key: "team", label: "Our Team" },
];

// Types for our data
interface Campaign {
  _id: string;
  title: string;
  passage: string;
  amount: string;
  detail: string;
  image?: string;
}

interface Program {
  _id: string;
  passage: string;
  date: string;
  image?: string;
}

interface TeamMember {
  _id: string;
  name: string;
  bio: string;
  image?: string;
}

export default function SiteUpdate() {
  const [activeSection, setActiveSection] = useState("hero");
  const { role } = useDashboardUser();
  const canEdit = canEditContent(role);

  // HERO SECTION
  const [heroHeading, setHeroHeading] = useState("");
  const [heroHeadline, setHeroHeadline] = useState("");
  const [heroPassage, setHeroPassage] = useState("");
  const [heroAmount, setHeroAmount] = useState("");

  // CAMPAIGNS
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    passage: "",
    amount: "",
    detail: "",
    image: null as File | null,
  });

  // PROGRAMS
  const [programs, setPrograms] = useState<Program[]>([]);
  const [newProgram, setNewProgram] = useState({
    passage: "",
    date: "",
    image: null as File | null,
  });

  // TEAM
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [newTeamMember, setNewTeamMember] = useState({
    name: "",
    bio: "",
    image: null as File | null,
  });

  // EDIT STATE — the record currently open in the edit modal, plus its draft.
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [campaignDraft, setCampaignDraft] = useState({
    title: "",
    passage: "",
    amount: "",
    detail: "",
    image: null as File | null,
  });

  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [programDraft, setProgramDraft] = useState({
    passage: "",
    date: "",
    image: null as File | null,
  });

  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [teamDraft, setTeamDraft] = useState({
    name: "",
    bio: "",
    image: null as File | null,
  });

  const [saving, setSaving] = useState(false);

  // 🔹 Fetch Hero Data
  useEffect(() => {
    fetch("/api/hero")
      .then((res) => res.json())
      .then((data) => {
        setHeroHeading(data.heading || "");
        setHeroHeadline(data.headline || "");
        setHeroPassage(data.passage || "");
        setHeroAmount(data.amount || "");
      })
      .catch(() => {});
  }, []);

  // 🔹 Fetch Campaigns
  useEffect(() => {
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => setCampaigns(data))
      .catch(() => {});
  }, []);

  // 🔹 Fetch Programs
  useEffect(() => {
    fetch("/api/programs")
      .then((res) => res.json())
      .then((data) => setPrograms(data))
      .catch(() => {});
  }, []);

  // 🔹 Fetch Team
  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => setTeam(data))
      .catch(() => {});
  }, []);

  // --- Hero Update ---
  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        heading: heroHeading,
        headline: heroHeadline,
        passage: heroPassage,
        amount: heroAmount,
      }),
    });
    alert("✅ Hero section updated!");
  };

  // --- Campaign Add ---
  const handleAddCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.title) return alert("Enter a title");

    const formData = new FormData();
    formData.append("title", newCampaign.title);
    formData.append("passage", newCampaign.passage);
    formData.append("amount", newCampaign.amount);
    formData.append("detail", newCampaign.detail);
    if (newCampaign.image) formData.append("image", newCampaign.image);

    const res = await fetch("/api/campaigns", {
      method: "POST",
      body: formData,
    });

    const added = await res.json();
    setCampaigns((prev) => [...prev, added]);
    setNewCampaign({ title: "", passage: "", amount: "", detail: "", image: null });
  };

  // --- Campaign Edit ---
  const openCampaignEditor = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setCampaignDraft({
      title: campaign.title || "",
      passage: campaign.passage || "",
      amount: campaign.amount || "",
      detail: campaign.detail || "",
      image: null,
    });
  };

  const handleUpdateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;
    if (!campaignDraft.title.trim()) return alert("Enter a title");

    const formData = new FormData();
    formData.append("id", editingCampaign._id);
    formData.append("title", campaignDraft.title);
    formData.append("passage", campaignDraft.passage);
    formData.append("amount", campaignDraft.amount);
    formData.append("detail", campaignDraft.detail);
    if (campaignDraft.image) formData.append("image", campaignDraft.image);

    setSaving(true);
    try {
      const res = await fetch("/api/campaigns", { method: "PUT", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || err.message || "Could not update the campaign.");
        return;
      }
      const updated: Campaign = await res.json();
      setCampaigns((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      setEditingCampaign(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm("Delete this campaign? This can't be undone.")) return;
    await fetch("/api/campaigns", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setCampaigns((prev) => prev.filter((c) => c._id !== id));
  };

  // --- Program Add ---
  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgram.passage) return alert("Enter program details");

    const formData = new FormData();
    formData.append("passage", newProgram.passage);
    formData.append("date", newProgram.date);
    if (newProgram.image) formData.append("image", newProgram.image);

    const res = await fetch("/api/programs", {
      method: "POST",
      body: formData,
    });

    const added = await res.json();
    setPrograms((prev) => [...prev, added]);
    setNewProgram({ passage: "", date: "", image: null });
  };

  // --- Program Edit ---
  const openProgramEditor = (program: Program) => {
    setEditingProgram(program);
    setProgramDraft({
      passage: program.passage || "",
      date: program.date || "",
      image: null,
    });
  };

  const handleUpdateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram) return;
    if (!programDraft.passage.trim()) return alert("Enter program details");

    const formData = new FormData();
    formData.append("id", editingProgram._id);
    formData.append("passage", programDraft.passage);
    formData.append("date", programDraft.date);
    if (programDraft.image) formData.append("image", programDraft.image);

    setSaving(true);
    try {
      const res = await fetch("/api/programs", { method: "PUT", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || err.message || "Could not update the program.");
        return;
      }
      const updated: Program = await res.json();
      setPrograms((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
      setEditingProgram(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm("Delete this program? This can't be undone.")) return;
    await fetch("/api/programs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPrograms((prev) => prev.filter((p) => p._id !== id));
  };

  // --- Team Add ---
  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamMember.name) return alert("Enter a name");

    const formData = new FormData();
    formData.append("name", newTeamMember.name);
    formData.append("bio", newTeamMember.bio);
    if (newTeamMember.image) formData.append("image", newTeamMember.image);

    const res = await fetch("/api/team", {
      method: "POST",
      body: formData,
    });

    const added = await res.json();
    setTeam((prev) => [...prev, added]);
    setNewTeamMember({ name: "", bio: "", image: null });
  };

  // --- Team Edit ---
  const openTeamEditor = (member: TeamMember) => {
    setEditingTeamMember(member);
    setTeamDraft({
      name: member.name || "",
      bio: member.bio || "",
      image: null,
    });
  };

  const handleUpdateTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeamMember) return;
    if (!teamDraft.name.trim()) return alert("Enter a name");

    const formData = new FormData();
    formData.append("id", editingTeamMember._id);
    formData.append("name", teamDraft.name);
    formData.append("bio", teamDraft.bio);
    if (teamDraft.image) formData.append("image", teamDraft.image);

    setSaving(true);
    try {
      const res = await fetch("/api/team", { method: "PUT", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || err.message || "Could not update the team member.");
        return;
      }
      const updated: TeamMember = await res.json();
      setTeam((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      setEditingTeamMember(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!confirm("Delete this team member? This can't be undone.")) return;
    await fetch("/api/team", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setTeam((prev) => prev.filter((t) => t._id !== id));
  };

  const fileInputClass =
    "w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-50 file:text-brand-700 file:font-semibold file:cursor-pointer hover:file:bg-brand-100 transition";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="dash-card p-6 md:p-8">
        <span className="eyebrow">Content Management</span>
        <h2 className="section-title text-2xl md:text-3xl mt-2 mb-6">
          Update Site Content
        </h2>

        {!canEdit && (
          <div className="mb-8 flex items-center gap-2.5 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
            <Lock className="w-4 h-4 shrink-0 text-slate-400" />
            You have <span className="font-semibold">read-only</span> access. You can
            view content but can&apos;t make changes.
          </div>
        )}

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap gap-1.5 mb-8 p-1.5 rounded-2xl bg-white/60 border border-black/5 w-fit">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeSection === item.key
                  ? "bg-gradient-to-r from-brand-600 to-accent-500 text-white shadow-md"
                  : "text-slate-600 hover:text-brand-700 hover:bg-brand-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* HERO SECTION */}
        {activeSection === "hero" && (
          <form onSubmit={handleHeroSubmit} className="space-y-4 max-w-2xl">
            <h3 className="font-display font-bold text-ink text-lg">Hero Section</h3>
            <fieldset disabled={!canEdit} className="space-y-4 border-0 p-0 m-0 disabled:opacity-70">
            <div>
              <label className="dash-label">Heading</label>
              <input type="text" placeholder="Heading" value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} className="dash-input" />
            </div>
            <div>
              <label className="dash-label">Headline</label>
              <input type="text" placeholder="Headline" value={heroHeadline} onChange={(e) => setHeroHeadline(e.target.value)} className="dash-input" />
            </div>
            <div>
              <label className="dash-label">Passage</label>
              <textarea placeholder="Passage" value={heroPassage} onChange={(e) => setHeroPassage(e.target.value)} className="dash-input" rows={3} />
            </div>
            <div>
              <label className="dash-label">Amount</label>
              <input type="text" placeholder="Amount" value={heroAmount} onChange={(e) => setHeroAmount(e.target.value)} className="dash-input" />
            </div>
            </fieldset>
            {canEdit && (
              <button className="btn btn-brand w-full">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            )}
          </form>
        )}

        {/* OUR CAMPAIGN SECTION */}
        {activeSection === "campaign" && (
          <section>
            <h3 className="font-display font-bold text-ink text-lg mb-4">Our Campaign</h3>
            {canEdit && (
            <form onSubmit={handleAddCampaign} className="space-y-3 mb-8 max-w-2xl">
              <input type="text" placeholder="Title" value={newCampaign.title} onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })} className="dash-input" />
              <textarea placeholder="Passage" value={newCampaign.passage} onChange={(e) => setNewCampaign({ ...newCampaign, passage: e.target.value })} className="dash-input" rows={2} />
              <input type="text" placeholder="Amount" value={newCampaign.amount} onChange={(e) => setNewCampaign({ ...newCampaign, amount: e.target.value })} className="dash-input" />
              <textarea placeholder="Detail" value={newCampaign.detail} onChange={(e) => setNewCampaign({ ...newCampaign, detail: e.target.value })} className="dash-input" rows={2} />
              <input type="file" accept="image/*" onChange={(e) => setNewCampaign({ ...newCampaign, image: e.target.files ? e.target.files[0] : null })} className={fileInputClass} />
              <button className="btn btn-primary w-full">
                <Plus className="w-4 h-4" /> Add Campaign
              </button>
            </form>
            )}

            <DataTable
              canModify={canEdit}
              headers={["Title", "Amount", "Image", ""]}
              rows={campaigns.map((c) => ({
                id: c._id,
                cells: [c.title, c.amount],
                image: c.image,
                imageAlt: c.title,
                onEdit: () => openCampaignEditor(c),
                onDelete: () => handleDeleteCampaign(c._id),
              }))}
            />
          </section>
        )}

        {/* PROGRAM SECTION */}
        {activeSection === "program" && (
          <section>
            <h3 className="font-display font-bold text-ink text-lg mb-4">Latest Program</h3>
            {canEdit && (
            <form onSubmit={handleAddProgram} className="space-y-3 mb-8 max-w-2xl">
              <textarea placeholder="Program Details" value={newProgram.passage} onChange={(e) => setNewProgram({ ...newProgram, passage: e.target.value })} className="dash-input" rows={2} />
              <input type="date" value={newProgram.date} onChange={(e) => setNewProgram({ ...newProgram, date: e.target.value })} className="dash-input" />
              <input type="file" accept="image/*" onChange={(e) => setNewProgram({ ...newProgram, image: e.target.files ? e.target.files[0] : null })} className={fileInputClass} />
              <button className="btn btn-primary w-full">
                <Plus className="w-4 h-4" /> Add Program
              </button>
            </form>
            )}

            <DataTable
              canModify={canEdit}
              headers={["Program", "Date", "Image", ""]}
              rows={programs.map((p) => ({
                id: p._id,
                cells: [p.passage, p.date],
                image: p.image,
                imageAlt: "Program",
                onEdit: () => openProgramEditor(p),
                onDelete: () => handleDeleteProgram(p._id),
              }))}
            />
          </section>
        )}

        {/* TEAM SECTION */}
        {activeSection === "team" && (
          <section>
            <h3 className="font-display font-bold text-ink text-lg mb-4">Our Team</h3>
            {canEdit && (
            <form onSubmit={handleAddTeamMember} className="space-y-3 mb-8 max-w-2xl">
              <input type="text" placeholder="Name" value={newTeamMember.name} onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })} className="dash-input" />
              <textarea placeholder="Bio" value={newTeamMember.bio} onChange={(e) => setNewTeamMember({ ...newTeamMember, bio: e.target.value })} className="dash-input" rows={2} />
              <input type="file" accept="image/*" onChange={(e) => setNewTeamMember({ ...newTeamMember, image: e.target.files ? e.target.files[0] : null })} className={fileInputClass} />
              <button className="btn btn-primary w-full">
                <Plus className="w-4 h-4" /> Add Team Member
              </button>
            </form>
            )}

            <DataTable
              canModify={canEdit}
              headers={["Name", "Bio", "Image", ""]}
              rows={team.map((t) => ({
                id: t._id,
                cells: [t.name, t.bio],
                image: t.image,
                imageAlt: t.name,
                onEdit: () => openTeamEditor(t),
                onDelete: () => handleDeleteTeamMember(t._id),
              }))}
            />
          </section>
        )}
      </div>

      {/* ---- Edit Campaign ---- */}
      <EditModal
        open={!!editingCampaign}
        title="Edit Campaign"
        saving={saving}
        currentImage={editingCampaign?.image}
        onClose={() => setEditingCampaign(null)}
        onSubmit={handleUpdateCampaign}
      >
        <div>
          <label className="dash-label">Title</label>
          <input type="text" value={campaignDraft.title} onChange={(e) => setCampaignDraft({ ...campaignDraft, title: e.target.value })} className="dash-input" />
        </div>
        <div>
          <label className="dash-label">Passage</label>
          <textarea value={campaignDraft.passage} onChange={(e) => setCampaignDraft({ ...campaignDraft, passage: e.target.value })} className="dash-input" rows={2} />
        </div>
        <div>
          <label className="dash-label">Amount</label>
          <input type="text" value={campaignDraft.amount} onChange={(e) => setCampaignDraft({ ...campaignDraft, amount: e.target.value })} className="dash-input" />
        </div>
        <div>
          <label className="dash-label">Detail</label>
          <textarea value={campaignDraft.detail} onChange={(e) => setCampaignDraft({ ...campaignDraft, detail: e.target.value })} className="dash-input" rows={2} />
        </div>
        <div>
          <label className="dash-label">Replace image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setCampaignDraft({ ...campaignDraft, image: e.target.files ? e.target.files[0] : null })} className={fileInputClass} />
        </div>
      </EditModal>

      {/* ---- Edit Program ---- */}
      <EditModal
        open={!!editingProgram}
        title="Edit Program"
        saving={saving}
        currentImage={editingProgram?.image}
        onClose={() => setEditingProgram(null)}
        onSubmit={handleUpdateProgram}
      >
        <div>
          <label className="dash-label">Program Details</label>
          <textarea value={programDraft.passage} onChange={(e) => setProgramDraft({ ...programDraft, passage: e.target.value })} className="dash-input" rows={3} />
        </div>
        <div>
          <label className="dash-label">Date</label>
          <input type="date" value={programDraft.date} onChange={(e) => setProgramDraft({ ...programDraft, date: e.target.value })} className="dash-input" />
        </div>
        <div>
          <label className="dash-label">Replace image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setProgramDraft({ ...programDraft, image: e.target.files ? e.target.files[0] : null })} className={fileInputClass} />
        </div>
      </EditModal>

      {/* ---- Edit Team Member ---- */}
      <EditModal
        open={!!editingTeamMember}
        title="Edit Team Member"
        saving={saving}
        currentImage={editingTeamMember?.image}
        onClose={() => setEditingTeamMember(null)}
        onSubmit={handleUpdateTeamMember}
      >
        <div>
          <label className="dash-label">Name</label>
          <input type="text" value={teamDraft.name} onChange={(e) => setTeamDraft({ ...teamDraft, name: e.target.value })} className="dash-input" />
        </div>
        <div>
          <label className="dash-label">Bio</label>
          <textarea value={teamDraft.bio} onChange={(e) => setTeamDraft({ ...teamDraft, bio: e.target.value })} className="dash-input" rows={3} />
        </div>
        <div>
          <label className="dash-label">Replace image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setTeamDraft({ ...teamDraft, image: e.target.files ? e.target.files[0] : null })} className={fileInputClass} />
        </div>
      </EditModal>
    </div>
  );
}

/* ---- Reusable edit modal ---- */
function EditModal({
  open,
  title,
  saving,
  currentImage,
  onClose,
  onSubmit,
  children,
}: {
  open: boolean;
  title: string;
  saving: boolean;
  currentImage?: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />

      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-lg my-8 dash-card p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-ink text-lg">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid place-items-center w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-black/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {currentImage && (
          <div className="flex items-center gap-3 rounded-xl bg-white/60 border border-black/5 p-3">
            <Image
              src={currentImage}
              alt="Current"
              width={56}
              height={56}
              className="w-14 h-14 object-cover rounded-lg ring-1 ring-black/5"
            />
            <span className="text-xs text-slate-500">
              Current image — leave the file field empty to keep it.
            </span>
          </div>
        )}

        {children}

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn btn-outline flex-1">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn btn-brand flex-1">
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---- Reusable data table ---- */
type TableRow = {
  id: string;
  cells: string[];
  image?: string;
  imageAlt: string;
  onEdit: () => void;
  onDelete: () => void;
};

function DataTable({
  headers,
  rows,
  canModify = true,
}: {
  headers: string[];
  rows: TableRow[];
  canModify?: boolean;
}) {
  return (
    <div className="overflow-x-auto scroll-thin rounded-2xl border border-black/5 bg-white/60">
      <table className="w-full text-sm text-left text-slate-700">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-slate-400 border-b border-black/5">
            {headers.map((h, i) => (
              <th key={i} className={`px-5 py-3.5 font-semibold ${i === headers.length - 1 ? "text-right" : ""}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-5 py-8 text-center text-slate-400">
                No entries yet.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="border-b border-black/5 last:border-0 hover:bg-brand-50/40 transition-colors">
                {row.cells.map((cell, i) => (
                  <td key={i} className={`px-5 py-3.5 ${i === 0 ? "font-medium text-ink max-w-[220px] truncate" : "text-slate-500 max-w-[220px] truncate"}`}>
                    {cell}
                  </td>
                ))}
                <td className="px-5 py-3.5">
                  {row.image ? (
                    <Image
                      src={row.image}
                      alt={row.imageAlt}
                      width={44}
                      height={44}
                      className="w-11 h-11 object-cover rounded-lg ring-1 ring-black/5"
                    />
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">
                  {canModify ? (
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={row.onEdit}
                        aria-label="Edit"
                        className="grid place-items-center w-9 h-9 rounded-lg text-brand-600 hover:bg-brand-50 transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={row.onDelete}
                        aria-label="Delete"
                        className="grid place-items-center w-9 h-9 rounded-lg text-red-500 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
