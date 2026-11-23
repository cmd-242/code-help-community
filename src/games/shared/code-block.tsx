/** Affichage d'une session de terminal : les lignes commençant par $ sont des commandes. */
export function CodeBlock({ code, className = "" }: { code: string; className?: string }) {
  const lines = code.split("\n");
  return (
    <pre
      className={`overflow-x-auto rounded-lg border border-stone-edge/50 bg-abyss-deep/90 px-4 py-3 font-mono text-[0.95rem] leading-relaxed shadow-[inset_0_2px_12px_rgba(0,0,0,0.6)] ${className}`}
    >
      <code>
        {lines.map((line, i) => {
          const prompt = line.match(/^(\S*\$ ?)(.*)$/);
          if (prompt) {
            const [cmd, comment] = splitComment(prompt[2]);
            return (
              <span key={i} className="block">
                <span className="text-moss-dim">{prompt[1]}</span>
                <span className="text-parchment">{cmd}</span>
                {comment && <span className="text-parchment-dim/70">{comment}</span>}
              </span>
            );
          }
          return (
            <span key={i} className="block text-torch-bright/85">
              {line || " "}
            </span>
          );
        })}
      </code>
    </pre>
  );
}

function splitComment(s: string): [string, string] {
  const i = s.indexOf("  #");
  return i >= 0 ? [s.slice(0, i), s.slice(i)] : [s, ""];
}
