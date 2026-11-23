import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { GameLink } from "@/components/ui/game-button";
import { db } from "@/server/db";
import { listTeacherClassrooms } from "@/server/services/classroom";
import { getSession } from "@/server/session";
import { CreateClassroomForm } from "./create-classroom-form";

/** Accueil de l'espace enseignant : ses classes et la création d'une nouvelle classe. */
export async function TeacherHome() {
  const t = await getTranslations("teacher");
  const session = await getSession();

  if (!session) {
    return (
      <div className="paper mx-auto max-w-lg rounded-[2rem] p-8 text-center">
        <h1 className="font-display text-3xl font-bold">{t("signinTitle")}</h1>
        <p className="mt-2 text-muted">{t("signinBody")}</p>
        <div className="mt-6 flex flex-col gap-3">
          <GameLink href="/inscription?next=/prof">{t("signup")}</GameLink>
          <GameLink href="/connexion?next=/prof" variant="secondary">
            {t("signin")}
          </GameLink>
        </div>
      </div>
    );
  }

  const classrooms = await listTeacherClassrooms(db, session.user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold">{t("homeTitle", { name: session.user.name })}</h1>
        <p className="mt-1 max-w-2xl text-muted">{t("homeLede")}</p>
      </div>

      {classrooms.length > 0 && (
        <section aria-labelledby="classes-title">
          <h2 id="classes-title" className="font-display text-2xl font-bold">
            {t("myClasses")}
          </h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {classrooms.map((c) => (
              <li key={c.id}>
                <Link href={`/prof/classes/${c.id}`} className="paper block h-full rounded-3xl p-5 transition hover:-translate-y-0.5">
                  <p className="font-display text-2xl font-bold leading-tight">{c.name}</p>
                  {c.schoolYear && <p className="text-sm text-muted">{c.schoolYear}</p>}
                  <p className="mt-3 font-bold">{t("studentCount", { count: c.studentCount })}</p>
                  <p className="mt-1 text-sm text-muted">
                    {t("codeLabel")} <span className="font-mono font-semibold tracking-widest text-ink">{c.inviteCode}</span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="create-title" className="paper max-w-xl rounded-[2rem] p-6">
        <h2 id="create-title" className="font-display text-2xl font-bold">
          {classrooms.length ? t("createAnother") : t("createFirst")}
        </h2>
        <p className="mt-1 text-muted">{t("createLede")}</p>
        <div className="mt-5">
          <CreateClassroomForm />
        </div>
      </section>
    </div>
  );
}
