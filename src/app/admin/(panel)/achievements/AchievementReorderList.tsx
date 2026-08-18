"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Pencil,
  Loader2,
  FileText,
  Award,
  ExternalLink,
} from "lucide-react";
import { cn, resolveImageUrl } from "@/lib/utils";
import type { Achievement } from "@/lib/types";
import { useToast } from "@/components/admin/Toast";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AchievementBadge } from "@/components/cards";

function previewUrl(url: string | null): { kind: "image" | "pdf" | "none"; src: string } {
  if (!url) return { kind: "none", src: "" };
  const isPdf = url.toLowerCase().includes(".pdf");
  if (isPdf) return { kind: "pdf", src: url };
  return { kind: "image", src: resolveImageUrl(url) };
}

function SortableRow({
  item,
  index,
}: {
  item: Achievement;
  index: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const preview = previewUrl(item.certificate_url);

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-xl border-2 border-foreground bg-surface p-3 hard-shadow-sm transition-shadow",
        isDragging && "z-10 opacity-80 ring-2 ring-accent"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none rounded-md p-1 text-muted transition-colors hover:text-accent active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical size={20} />
      </button>

      <span className="w-6 shrink-0 text-center font-display text-sm font-extrabold text-accent">
        {index + 1}
      </span>

      <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md border-2 border-foreground bg-surface-2">
        {preview.kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview.src}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : preview.kind === "pdf" ? (
          <div className="flex h-full w-full items-center justify-center text-accent">
            <FileText size={20} />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <Award size={18} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <AchievementBadge category={item.category} />
          <span className="font-display text-xs font-bold text-muted">
            {item.year}
          </span>
        </div>
        <p className="truncate font-display font-bold uppercase leading-tight tracking-tight">
          {item.title}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {item.certificate_url && (
          <a
            href={item.certificate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border-2 border-border bg-surface-2 px-2 py-1 text-[11px] font-bold uppercase text-muted transition-colors hover:text-accent"
            title="Open certificate"
          >
            <ExternalLink size={13} />
          </a>
        )}
        <Link
          href={`/admin/achievements/${item.id}`}
          className="inline-flex items-center gap-1 rounded-md border-2 border-border bg-surface-2 px-2 py-1 text-[11px] font-bold uppercase text-muted transition-colors hover:text-accent"
          title="Edit"
        >
          <Pencil size={13} />
          Edit
        </Link>
        <DeleteButton
          entity="achievements"
          id={item.id}
          name={item.title}
        />
      </div>
    </li>
  );
}

export function AchievementReorderList({ items }: { items: Achievement[] }) {
  const [ordered, setOrdered] = useState<Achievement[]>(items);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setOrdered(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrdered((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });

    const oldIndex = ordered.findIndex((i) => i.id === active.id);
    const newIndex = ordered.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    persist(arrayMove(ordered, oldIndex, newIndex));
  }

  async function persist(next: Achievement[]) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/achievements/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: next.map((i) => i.id) }),
      });
      if (!res.ok) throw new Error("reorder failed");
      toast("success", "Order saved");
    } catch {
      toast("error", "Failed to save order");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
        {saving ? (
          <>
            <Loader2 size={14} className="animate-spin text-accent" />
            Saving order…
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full bg-accent" />
            {ordered.length} achievements · drag to reorder
          </>
        )}
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={ordered.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="flex flex-col gap-2.5">
            {ordered.map((item, index) => (
              <SortableRow key={item.id} item={item} index={index} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
