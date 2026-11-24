/**
 * Shell Linux simulé : fonction pure, sans accès au vrai système (règle n°4).
 * Le même code tourne dans le navigateur (jeu) et sur le serveur (correction,
 * en rejouant les commandes tapées par l'apprenant).
 */

/** Chemin absolu → contenu du fichier, ou null pour un dossier. "/" est implicite. */
export type Fs = Record<string, string | null>;
export type ShellState = { fs: Fs; cwd: string };

export const HOME = "/home/aya";
const MAX_FILE = 4000;
const MAX_ENTRIES = 200;

export function initShell(files: Record<string, string>, cwd: string = HOME): ShellState {
  const fs: Fs = {};
  const mkParents = (p: string) => {
    const parts = p.split("/").filter(Boolean);
    for (let i = 1; i < parts.length; i++) fs["/" + parts.slice(0, i).join("/")] = null;
  };
  for (const [raw, content] of Object.entries(files)) {
    const path = resolve(raw, "/");
    mkParents(path);
    if (raw.endsWith("/")) fs[path] = null;
    else fs[path] = content;
  }
  mkParents(cwd + "/x");
  fs[resolve(cwd, "/")] ??= null;
  return { fs, cwd: resolve(cwd, "/") };
}

/** Résout `.`, `..` et `~` ; renvoie toujours un chemin absolu sans barre finale. */
export function resolve(path: string, cwd: string): string {
  let p = path === "~" || path.startsWith("~/") ? HOME + path.slice(1) : path;
  if (!p.startsWith("/")) p = `${cwd}/${p}`;
  const out: string[] = [];
  for (const part of p.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") out.pop();
    else out.push(part);
  }
  return "/" + out.join("/");
}

const isDir = (fs: Fs, p: string) => p === "/" || fs[p] === null;
const exists = (fs: Fs, p: string) => p === "/" || p in fs;
const parentOf = (p: string) => p.slice(0, p.lastIndexOf("/")) || "/";
const baseOf = (p: string) => p.slice(p.lastIndexOf("/") + 1);

function childrenOf(fs: Fs, dir: string): string[] {
  const prefix = dir === "/" ? "/" : dir + "/";
  const names = new Set<string>();
  for (const p of Object.keys(fs)) {
    if (p.startsWith(prefix) && p.length > prefix.length) names.add(p.slice(prefix.length).split("/")[0]);
  }
  return [...names].sort();
}

type Token = { text: string; quoted: boolean };

function tokenize(line: string): { tokens: Token[] } | null {
  const tokens: Token[] = [];
  let cur = "";
  let quoted = false;
  let has = false;
  let quote: "'" | '"' | null = null;
  const push = () => {
    if (has) tokens.push({ text: cur, quoted });
    cur = "";
    quoted = false;
    has = false;
  };
  const expand = (s: string) => s.replace(/\$(HOME|PWD|USER)\b/g, (m, v: string) => (v === "HOME" ? HOME : v === "USER" ? "aya" : m));
  let buf = "";
  const flushBuf = () => {
    cur += quote === "'" ? buf : expand(buf);
    buf = "";
  };
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quote) {
      if (c === quote) {
        flushBuf();
        quote = null;
      } else buf += c;
      continue;
    }
    if (c === "'" || c === '"') {
      flushBuf();
      quote = c;
      quoted = true;
      has = true;
      continue;
    }
    if (c === " " || c === "\t") {
      flushBuf();
      push();
      continue;
    }
    if (c === "|" || c === ">") {
      flushBuf();
      push();
      let op = c;
      if (c === ">" && line[i + 1] === ">") {
        op = ">>";
        i++;
      }
      tokens.push({ text: op, quoted: false });
      continue;
    }
    buf += c;
    has = true;
  }
  if (quote) return null;
  flushBuf();
  push();
  return { tokens };
}

type Out = { out: string; err: string };
const ok = (out = ""): Out => ({ out, err: "" });
const fail = (err: string): Out => ({ out: "", err });

function glob(fs: Fs, cwd: string, arg: string): string[] {
  if (!arg.includes("*")) return [arg];
  const dirPart = arg.includes("/") ? arg.slice(0, arg.lastIndexOf("/") + 1) : "";
  const pattern = arg.slice(dirPart.length);
  const dir = resolve(dirPart || ".", cwd);
  const re = new RegExp("^" + pattern.split("*").map((s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*") + "$");
  const hits = childrenOf(fs, dir).filter((n) => re.test(n) && !n.startsWith("."));
  return hits.length ? hits.map((n) => dirPart + n) : [arg];
}

function splitFlags(args: string[]): { flags: Set<string>; rest: string[]; n?: number } {
  const flags = new Set<string>();
  const rest: string[] = [];
  let n: number | undefined;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "-n" && /^\d+$/.test(args[i + 1] ?? "")) {
      n = Number(args[++i]);
    } else if (/^-\d+$/.test(a)) {
      n = Number(a.slice(1));
    } else if (a.length > 1 && a.startsWith("-") && !/^-\d/.test(a)) {
      for (const ch of a.slice(1)) flags.add(ch);
    } else rest.push(a);
  }
  return { flags, rest, n };
}

const lines = (s: string) => (s === "" ? [] : s.replace(/\n$/, "").split("\n"));

function readFile(st: ShellState, cmd: string, arg: string): { text?: string; err?: string } {
  const p = resolve(arg, st.cwd);
  if (!exists(st.fs, p)) return { err: `${cmd}: ${arg}: No such file or directory` };
  if (isDir(st.fs, p)) return { err: `${cmd}: ${arg}: Is a directory` };
  return { text: st.fs[p] as string };
}

function runOne(st: ShellState, argv: string[], stdin: string | null): Out {
  const [cmd, ...raw] = argv;
  const args = raw.flatMap((a) => glob(st.fs, st.cwd, a));
  const { flags, rest, n } = splitFlags(args);
  const fs = st.fs;

  switch (cmd) {
    case "pwd":
      return ok(st.cwd);
    case "whoami":
      return ok("aya");
    case "clear":
      return ok();
    case "echo": {
      const noNl = raw[0] === "-n";
      return ok((noNl ? raw.slice(1) : raw).join(" "));
    }
    case "help":
      return ok("Commandes : pwd ls cd cat echo mkdir touch rm cp mv head tail wc grep sort uniq whoami clear");
    case "cd": {
      const target = resolve(rest[0] ?? "~", st.cwd);
      if (!exists(fs, target)) return fail(`cd: ${rest[0]}: No such file or directory`);
      if (!isDir(fs, target)) return fail(`cd: ${rest[0]}: Not a directory`);
      st.cwd = target;
      return ok();
    }
    case "ls": {
      const targets = rest.length ? rest : ["."];
      const blocks: string[] = [];
      let err = "";
      for (const t of targets) {
        const p = resolve(t, st.cwd);
        if (!exists(fs, p)) {
          err += `${err ? "\n" : ""}ls: cannot access '${t}': No such file or directory`;
          continue;
        }
        let names = isDir(fs, p) ? childrenOf(fs, p) : [baseOf(p)];
        if (!flags.has("a")) names = names.filter((x) => !x.startsWith("."));
        else if (isDir(fs, p)) names = [".", "..", ...names];
        const full = (x: string) => (isDir(fs, p) ? resolve(x, p) : p);
        const body = flags.has("l")
          ? names
              .map((x) => {
                const d = x === "." || x === ".." || isDir(fs, full(x));
                const size = d ? 4096 : (fs[full(x)] as string).length;
                return `${d ? "drwxr-xr-x" : "-rw-r--r--"} 1 aya aya ${size} ${x}`;
              })
              .join("\n")
          : names.join("  ");
        blocks.push(targets.length > 1 && isDir(fs, p) ? `${t}:\n${body}` : body);
      }
      return { out: blocks.filter((b) => b !== "").join("\n\n"), err };
    }
    case "cat": {
      if (!rest.length) return ok(stdin ?? "");
      let out = "";
      for (const a of rest) {
        const r = readFile(st, "cat", a);
        if (r.err) return { out, err: r.err };
        out += (out && !out.endsWith("\n") ? "\n" : "") + r.text;
      }
      return ok(out);
    }
    case "mkdir": {
      for (const a of rest) {
        const p = resolve(a, st.cwd);
        if (exists(fs, p) && !flags.has("p")) return fail(`mkdir: cannot create directory '${a}': File exists`);
        if (!flags.has("p") && !isDir(fs, parentOf(p))) return fail(`mkdir: cannot create directory '${a}': No such file or directory`);
        if (Object.keys(fs).length >= MAX_ENTRIES) return fail("mkdir: no space left on device");
        const parts = p.split("/").filter(Boolean);
        for (let i = 1; i <= parts.length; i++) fs["/" + parts.slice(0, i).join("/")] ??= null;
      }
      return ok();
    }
    case "touch": {
      for (const a of rest) {
        const p = resolve(a, st.cwd);
        if (!isDir(fs, parentOf(p))) return fail(`touch: cannot touch '${a}': No such file or directory`);
        if (!exists(fs, p)) {
          if (Object.keys(fs).length >= MAX_ENTRIES) return fail("touch: no space left on device");
          fs[p] = "";
        }
      }
      return ok();
    }
    case "rm": {
      for (const a of rest) {
        const p = resolve(a, st.cwd);
        if (!exists(fs, p)) {
          if (flags.has("f")) continue;
          return fail(`rm: cannot remove '${a}': No such file or directory`);
        }
        if (p === "/" || p === st.cwd || st.cwd.startsWith(p + "/")) return fail(`rm: refusing to remove '${a}'`);
        if (isDir(fs, p) && !flags.has("r") && !flags.has("R")) return fail(`rm: cannot remove '${a}': Is a directory`);
        for (const k of Object.keys(fs)) if (k === p || k.startsWith(p + "/")) delete fs[k];
      }
      return ok();
    }
    case "cp":
    case "mv": {
      if (rest.length < 2) return fail(`${cmd}: missing file operand`);
      const dest = rest[rest.length - 1];
      const dp = resolve(dest, st.cwd);
      const srcs = rest.slice(0, -1);
      if (srcs.length > 1 && !isDir(fs, dp)) return fail(`${cmd}: target '${dest}' is not a directory`);
      for (const s of srcs) {
        const sp = resolve(s, st.cwd);
        if (!exists(fs, sp)) return fail(`${cmd}: cannot stat '${s}': No such file or directory`);
        if (isDir(fs, sp) && cmd === "cp" && !flags.has("r") && !flags.has("R")) return fail(`cp: -r not specified; omitting directory '${s}'`);
        const target = isDir(fs, dp) ? resolve(baseOf(sp), dp) : dp;
        if (!isDir(fs, parentOf(target))) return fail(`${cmd}: cannot create '${dest}': No such file or directory`);
        if (target === sp || target.startsWith(sp + "/")) return fail(`${cmd}: cannot move '${s}' to a subdirectory of itself`);
        const moved: [string, string | null][] = Object.keys(fs)
          .filter((k) => k === sp || k.startsWith(sp + "/"))
          .map((k) => [target + k.slice(sp.length), fs[k]]);
        if (cmd === "mv") for (const k of Object.keys(fs)) if (k === sp || k.startsWith(sp + "/")) delete fs[k];
        for (const [k, v] of moved) fs[k] = v;
      }
      return ok();
    }
    case "head":
    case "tail": {
      const count = n ?? 10;
      const src = rest.length ? readFile(st, cmd, rest[0]) : { text: stdin ?? "" };
      if (src.err) return fail(src.err);
      const l = lines(src.text ?? "");
      return ok((cmd === "head" ? l.slice(0, count) : l.slice(Math.max(0, l.length - count))).join("\n"));
    }
    case "wc": {
      const src = rest.length ? readFile(st, "wc", rest[0]) : { text: stdin ?? "" };
      if (src.err) return fail(src.err);
      const text = src.text ?? "";
      const l = lines(text).length;
      const w = text.split(/\s+/).filter(Boolean).length;
      const c = text.length;
      const picked = [flags.has("l") && l, flags.has("w") && w, flags.has("c") && c].filter((v) => v !== false) as number[];
      const nums = picked.length ? picked : [l, w, c];
      return ok(nums.join(" ") + (rest.length ? ` ${rest[0]}` : ""));
    }
    case "sort":
    case "uniq": {
      const src = rest.length ? readFile(st, cmd, rest[0]) : { text: stdin ?? "" };
      if (src.err) return fail(src.err);
      let l = lines(src.text ?? "");
      if (cmd === "sort") {
        l = [...l].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
        if (flags.has("r")) l.reverse();
      } else l = l.filter((x, i) => i === 0 || x !== l[i - 1]);
      return ok(l.join("\n"));
    }
    case "grep": {
      if (!rest.length) return fail("grep: missing pattern");
      let pat = rest[0];
      const ci = flags.has("i");
      const anchorStart = pat.startsWith("^");
      const anchorEnd = pat.endsWith("$") && pat.length > 1;
      if (anchorStart) pat = pat.slice(1);
      if (anchorEnd) pat = pat.slice(0, -1);
      const norm = (s: string) => (ci ? s.toLowerCase() : s);
      const hit = (line: string) => {
        const a = norm(line);
        const b = norm(pat);
        if (anchorStart && anchorEnd) return a === b;
        if (anchorStart) return a.startsWith(b);
        if (anchorEnd) return a.endsWith(b);
        return a.includes(b);
      };
      const files = rest.slice(1);
      const sources = files.length ? files : [null];
      const out: string[] = [];
      for (const f of sources) {
        const src = f === null ? { text: stdin ?? "" } : readFile(st, "grep", f);
        if (src.err) return { out: out.join("\n"), err: src.err };
        const matched = lines(src.text ?? "")
          .map((text, i) => ({ text, i }))
          .filter(({ text }) => hit(text) !== flags.has("v"));
        if (flags.has("c")) out.push((files.length > 1 ? `${f}:` : "") + matched.length);
        else
          for (const m of matched) out.push(`${files.length > 1 ? `${f}:` : ""}${flags.has("n") ? `${m.i + 1}:` : ""}${m.text}`);
      }
      return ok(out.join("\n"));
    }
    default:
      return fail(`bash: ${cmd}: command not found`);
  }
}

export type LineResult = { output: string; state: ShellState };

/** Exécute une ligne (pipes et redirections `>` `>>` compris). L'état d'origine n'est pas modifié. */
export function runLine(prev: ShellState, line: string): LineResult {
  const st: ShellState = { fs: { ...prev.fs }, cwd: prev.cwd };
  const text = line.trim();
  if (!text) return { output: "", state: st };
  if (text.length > 300) return { output: "bash: line too long", state: st };
  const parsed = tokenize(text);
  if (!parsed) return { output: "bash: unexpected EOF while looking for matching quote", state: st };

  // Découpe en commandes séparées par | ; la dernière peut avoir une redirection
  const segments: Token[][] = [[]];
  for (const t of parsed.tokens) {
    if (!t.quoted && t.text === "|") segments.push([]);
    else segments[segments.length - 1].push(t);
  }
  let stdin: string | null = null;
  let last: Out = ok();
  let redirect: { op: string; target: string } | null = null;
  for (let i = 0; i < segments.length; i++) {
    let toks = segments[i];
    const r = toks.findIndex((t) => !t.quoted && (t.text === ">" || t.text === ">>"));
    if (r !== -1) {
      if (i !== segments.length - 1 || !toks[r + 1]) return { output: "bash: syntax error near unexpected token", state: st };
      redirect = { op: toks[r].text, target: toks[r + 1].text };
      toks = toks.slice(0, r);
    }
    if (!toks.length) return { output: "bash: syntax error near unexpected token `|'", state: st };
    last = runOne(st, toks.map((t) => t.text), stdin);
    stdin = last.out === "" ? "" : last.out + "\n";
    if (last.err && i < segments.length - 1) break;
  }
  if (redirect) {
    const p = resolve(redirect.target, st.cwd);
    if (isDir(st.fs, p)) return { output: `bash: ${redirect.target}: Is a directory`, state: st };
    if (!isDir(st.fs, parentOf(p))) return { output: `bash: ${redirect.target}: No such file or directory`, state: st };
    const body = last.out === "" ? "" : last.out + "\n";
    const next = redirect.op === ">>" ? ((st.fs[p] as string | undefined) ?? "") + body : body;
    st.fs[p] = next.slice(0, MAX_FILE);
    return { output: last.err, state: st };
  }
  return { output: [last.err, last.out].filter(Boolean).join("\n"), state: st };
}

export type TerminalGoal = {
  cwd?: string;
  /** chemin → contenu exact attendu (retour à la ligne final ignoré) */
  files?: Record<string, string>;
  dirs?: string[];
  absent?: string[];
  /** sorties acceptées de la dernière commande */
  lastOutput?: string[];
};

const trimNl = (s: string) => s.replace(/\n+$/, "");

/** Rejoue des commandes depuis l'état initial et vérifie l'objectif. */
export function replayAndCheck(initial: ShellState, commands: string[], goal: TerminalGoal, normalize: (s: string) => string): boolean {
  if (commands.length === 0 || commands.length > 12) return false;
  let state = initial;
  let output = "";
  for (const c of commands) {
    const r = runLine(state, c);
    state = r.state;
    output = r.output;
  }
  const home = (p: string) => resolve(p, "/");
  if (goal.cwd && state.cwd !== home(goal.cwd)) return false;
  for (const [p, content] of Object.entries(goal.files ?? {})) {
    const v = state.fs[home(p)];
    if (typeof v !== "string" || trimNl(v) !== trimNl(content)) return false;
  }
  for (const d of goal.dirs ?? []) if (!isDir(state.fs, home(d))) return false;
  for (const a of goal.absent ?? []) if (exists(state.fs, home(a))) return false;
  if (goal.lastOutput && !goal.lastOutput.some((o) => normalize(o) === normalize(output))) return false;
  return true;
}
