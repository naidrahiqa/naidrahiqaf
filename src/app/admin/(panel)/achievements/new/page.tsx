import { AchievementForm } from "@/components/admin/AchievementForm";

export default function NewAchievementPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">New Achievement</h1>
      </header>
      <AchievementForm />
    </div>
  );
}
