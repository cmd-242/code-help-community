import { notFound, redirect } from "next/navigation";
import { getTrack, getTracks } from "@/features/catalog/queries";
import { db } from "@/server/db";
import { ForbiddenError } from "@/server/permissions";
import { getClassroomDashboard } from "@/server/services/classroom";
import { getSession } from "@/server/session";
import { ClassroomTabs } from "./classroom-tabs";
import { InviteCard } from "./invite-card";

/** Tableau de bord d'une classe. Un enseignant qui n'est pas de la classe obtient une page introuvable. */
export async function ClassroomDashboard({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, session] = await Promise.all([params, getSession()]);
  if (!session) redirect(`/connexion?next=/prof/classes/${id}`);

  let data;
  try {
    data = await getClassroomDashboard(db, session.user.id, id);
  } catch (e) {
    if (e instanceof ForbiddenError) notFound();
    throw e;
  }
  const tracks = data.classroom.trackSlugs.flatMap((slug) => getTrack(slug) ?? []).map((track) => ({
    slug: track.slug,
    title: track.title,
    notions: track.notions.map((n) => ({ slug: n.slug, place: n.place, position: n.position, concept: n.concept })),
  }));
  const available = getTracks()
    .filter((track) => !data.classroom.trackSlugs.includes(track.slug))
    .map((track) => ({ slug: track.slug, title: track.title }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold leading-tight">{data.classroom.name}</h1>
          <p className="text-muted">
            {tracks.map((track) => track.title).join(", ")}
            {data.classroom.schoolYear ? `, ${data.classroom.schoolYear}` : ""}
          </p>
        </div>
        <InviteCard code={data.classroom.inviteCode} />
      </div>
      <ClassroomTabs classroomId={data.classroom.id} students={data.students} tracks={tracks} available={available} releases={data.releases} />
    </div>
  );
}
