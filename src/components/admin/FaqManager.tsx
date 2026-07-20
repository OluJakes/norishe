"use client";
import { useState, useTransition } from "react";
import { Trash2, Plus, Eye, EyeOff, Pencil } from "lucide-react";
import { createFaqItem, updateFaqItem, toggleFaqVisible, deleteFaqItem } from "@/lib/actions/admin";

type Faq = { id: string; question: string; answer: string; visible: boolean };

export function FaqManager({ items }: { items: Faq[] }) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({ question: "", answer: "" });

  function submit() {
    if (!form.question || !form.answer) return;
    startTransition(async () => {
      await createFaqItem(form);
      setForm({ question: "", answer: "" });
    });
  }

  return (
    <div>
      <div className="card-ivory p-6">
        <h3 className="font-serif text-lg text-forest">Add Question</h3>
        <label className="mt-4 block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-forest/60">Question</span>
          <input value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} className="input" />
        </label>
        <label className="mt-4 block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-forest/60">Answer</span>
          <textarea value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} rows={3} className="input" />
        </label>
        <button onClick={submit} disabled={pending} className="btn-gold mt-5">
          <Plus className="h-4 w-4" /> Add to FAQ
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <FaqCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function FaqCard({ item }: { item: Faq }) {
  const [editing, setEditing] = useState(false);
  const [question, setQuestion] = useState(item.question);
  const [answer, setAnswer] = useState(item.answer);
  const [pending, startTransition] = useTransition();

  if (editing) {
    return (
      <div className="card-ivory p-5">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-forest/60">Question</span>
          <input value={question} onChange={(e) => setQuestion(e.target.value)} className="input" />
        </label>
        <label className="mt-3 block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-forest/60">Answer</span>
          <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={3} className="input" />
        </label>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() =>
              startTransition(async () => {
                await updateFaqItem(item.id, { question, answer });
                setEditing(false);
              })
            }
            disabled={pending}
            className="btn-outline-dark"
          >
            Save
          </button>
          <button onClick={() => setEditing(false)} className="text-sm text-charcoal/50 hover:text-charcoal">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-ivory p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="font-serif text-forest">{item.question}</p>
        <div className="flex flex-shrink-0 gap-2">
          <button onClick={() => setEditing(true)} className="text-charcoal/50 hover:text-forest" aria-label="Edit">
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => startTransition(() => toggleFaqVisible(item.id, !item.visible))}
            disabled={pending}
            className="text-charcoal/50 hover:text-forest"
            aria-label={item.visible ? "Hide" : "Show"}
          >
            {item.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          <button
            onClick={() => startTransition(() => deleteFaqItem(item.id))}
            disabled={pending}
            className="text-red-400 hover:text-red-600"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm text-charcoal/65">{item.answer}</p>
      <p className="mt-2 text-xs text-charcoal/40">{item.visible ? "Visible on site" : "Hidden"}</p>
    </div>
  );
}
