import { describe, expect, it } from "vitest";
import { initShell, runLine, type ShellState } from "@/games/terminal/shell";
import { encounterSchema } from "@/games/schemas";
import { grade } from "@/games/grading";
import { toPublicEncounter } from "@/games/public";

const run = (st: ShellState, ...lines: string[]) => {
  let out = "";
  for (const l of lines) {
    const r = runLine(st, l);
    st = r.state;
    out = r.output;
  }
  return { st, out };
};
const base = () => initShell({ "/home/aya/notes.txt": "un\ndeux\nUn trois", "/home/aya/jeu/": "" });

describe("shell simulé", () => {
  it("se déplace et affiche", () => {
    expect(run(base(), "pwd").out).toBe("/home/aya");
    const { st, out } = run(base(), "cd jeu", "pwd");
    expect(out).toBe("/home/aya/jeu");
    expect(run(st, "cd ..", "cd ~", "pwd").out).toBe("/home/aya");
    expect(run(base(), "cd nope").out).toContain("No such file");
  });
  it("crée, copie, déplace, supprime", () => {
    const { st } = run(base(), "mkdir -p a/b", "touch a/b/x", "cp notes.txt a/n", "mv a/n a/b/n2", "rm notes.txt");
    expect(st.fs["/home/aya/a/b/x"]).toBe("");
    expect(st.fs["/home/aya/a/b/n2"]).toContain("deux");
    expect("/home/aya/notes.txt" in st.fs).toBe(false);
    expect(run(base(), "rm jeu").out).toContain("Is a directory");
  });
  it("redirections et pipes", () => {
    const { st } = run(base(), 'echo "bonjour monde" > a.txt', "echo suite >> a.txt");
    expect(st.fs["/home/aya/a.txt"]).toBe("bonjour monde\nsuite\n");
    expect(run(base(), "grep -i un notes.txt | wc -l").out).toBe("2");
    expect(run(base(), "cat notes.txt | head -n 1").out).toBe("un");
  });
  it("ne modifie jamais l'état précédent", () => {
    const st = base();
    runLine(st, "touch zzz");
    expect("/home/aya/zzz" in st.fs).toBe(false);
  });
  it("commande inconnue, guillemets non fermés", () => {
    expect(run(base(), "sudo rm -rf /").out).toContain("command not found");
    expect(run(base(), 'echo "oups').out).toContain("EOF");
  });
  it("refuse de supprimer le dossier courant", () => {
    expect(run(base(), "rm -r .").out).toContain("refusing");
  });
});

describe("terminal : correction par rejeu", () => {
  const e = encounterSchema.parse({
    id: "t", type: "terminal", prompt: "?", files: { "/home/aya/a.txt": "x" },
    goal: { files: { "/home/aya/b.txt": "x" }, absent: ["/home/aya/a.txt"] }, solution: ["mv a.txt b.txt"], explanation: ".",
  });
  it("accepte toute suite de commandes qui atteint l'objectif", () => {
    expect(grade(e, ["mv a.txt b.txt"])).toBe(true);
    expect(grade(e, ["cp a.txt b.txt", "rm a.txt"])).toBe(true);
    expect(grade(e, ["cp a.txt b.txt"])).toBe(false);
    expect(grade(e, [])).toBe(false);
  });
  it("refuse plus de 12 commandes et ne divulgue pas l'objectif", () => {
    expect(grade(e, Array(13).fill("pwd"))).toBe(false);
    const pub = JSON.stringify(toPublicEncounter(e));
    expect(pub).not.toContain("goal");
    expect(pub).not.toContain("mv a.txt");
  });
});
