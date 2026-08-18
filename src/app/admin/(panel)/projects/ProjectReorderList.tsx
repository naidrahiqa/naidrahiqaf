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
  Star,
  ExternalLink,
  FolderGit2,
} from "lucide-react";
import { cn, resolveImageUrl } from "@/lib/utils";
import type { Project } from "@/lib/types";
import { useToast } from "@/components/admin/Toast";
import { DeleteButton } from "@/components/admin/DeleteButton";

function SortableRow({ item, index }: { item: Project; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const cover = item.cover_image ? resolveImageUrl(item.cover_image) : null;

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
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <FolderGit2 size={18} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] uppercase",
              item.category === "school"
                ? "border-accent/30 text-accent"
                : "border-accent-2/30 text-accent-2"
            )}
          >
            {item.category}
          </span>
          {item.published ? (
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
              published
            </span>
          ) : (
            <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] font-bold text-muted">
              hidden
            </span>
          )}
          {item.featured && (
            <Star size={13} className="fill-accent text-accent" />
          )}
        </div>
        <p className="truncate font-display font-bold uppercase leading-tight tracking-tight">
          {item.title}
        </p>
        <p className="truncate text-[11px] text-muted">
          {item.class_level ? `kelas ${item.class_level} · ` : ""}
          {item.subject || "no subject"}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border-2 border-border bg-surface-2 px-2 py-1 text-[11px] font-bold uppercase text-muted transition-colors hover:text-accent"
            title="Open link"
          >
            <ExternalLink size={13} />
          </a>
        )}
        <Link
          href={`/admin/projects/${item.id}`}
          className="inline-flex items-center gap-1 rounded-md border-2 border-border bg-surface-2 px-2 py-1 text-[11px] font-bold uppercase text-muted transition-colors hover:text-accent"
          title="Edit"
        >
          <Pencil size={13} />
          Edit
        </Link>
        <DeleteButton entity="projects" id={item.id} name={item.title} />
      </div>
    </li>
  );
}

export function ProjectReorderList({ items }: { items: Project[] }) {
  const [ordered, setOrdered] = useState<Project[]>(items);
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

  async function persist(next: Project[]) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/projects/reorder", {
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
            {ordered.length} projects · drag to reorder
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
