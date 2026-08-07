import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AchievementForm } from "@/components/admin/AchievementForm";

export default async function EditAchievementPage({
  params,
}: PageProps<"/admin/achievements/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: achievement } = await supabase
    .from("achievements")
    .select("*")
    .eq("id", id)
    .single();

  if (!achievement) notFound();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Edit Achievement</h1>
      </header>
      <AchievementForm initial={achievement} />
    </div>
  );
}
