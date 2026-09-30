"use client";

import { useState } from "react";
import { updateInquiryNotes, updateInquiryStatus, assignInquiry } from "../app/admin/inquiries/actions";

const statuses = ["new","contacted","visit_scheduled","visited","application_started","admitted","closed"] as const;

export function AdminInquiryPanel({ id, status, notes, assignedTo, assignees }: { id: string; status: string; notes: string | null; assignedTo: string | null; assignees: { user_id: string; display_name: string | null }[] }) {
  const [currentStatus,setCurrentStatus]=useState(status);
  const [noteText,setNoteText]=useState(notes||"");
  const [assignee,setAssignee]=useState(assignedTo||"");
  const [busy,setBusy]=useState("");
  const [message,setMessage]=useState("");

  async function run(kind:string, fn:()=>Promise<void>) {
    setBusy(kind); setMessage("");
    try { await fn(); setMessage("Saved."); } catch(e) { setMessage(e instanceof Error ? e.message : "Unable to save."); } finally { setBusy(""); }
  }

  return <div className="space-y-5">
    <div className="border border-brand-border bg-white p-6 shadow-card">
      <p className="form-label">Update stage</p>
      <select value={currentStatus} onChange={e=>{const value=e.target.value as typeof statuses[number]; setCurrentStatus(value); void run("status",()=>updateInquiryStatus(id,value));}} disabled={!!busy} className="form-input mt-3">
        {statuses.map(s=><option key={s} value={s}>{s.replaceAll("_"," ")}</option>)}
      </select>
    </div>
    <div className="border border-brand-border bg-white p-6 shadow-card">
      <p className="form-label">Assign owner</p>
      <select value={assignee} onChange={e=>{const value=e.target.value; setAssignee(value); void run("assign",()=>assignInquiry(id,value||null));}} disabled={!!busy} className="form-input mt-3">
        <option value="">Unassigned</option>
        {assignees.map(a=><option key={a.user_id} value={a.user_id}>{a.display_name||a.user_id}</option>)}
      </select>
    </div>
    <div className="border border-brand-border bg-white p-6 shadow-card">
      <p className="form-label">Internal notes</p>
      <textarea value={noteText} onChange={e=>setNoteText(e.target.value)} maxLength={5000} rows={7} className="form-input mt-3 resize-y"/>
      <div className="mt-3 flex items-center justify-between gap-4"><span className="text-xs text-brand-ink/40">{noteText.length}/5000</span><button type="button" disabled={!!busy} onClick={()=>void run("notes",()=>updateInquiryNotes(id,noteText))} className="rounded-xl bg-brand-navy px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{busy==="notes"?"Saving…":"Save notes"}</button></div>
    </div>
    {message && <p role="status" className="text-sm text-brand-ink/60">{message}</p>}
  </div>;
}
