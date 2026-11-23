/** Affichage d'une session de terminal : les lignes commençant par $ sont des commandes. */
export function CodeBlock({ code, className = "" }: { code: string; className?: string }) {
  const lines = code.split("\n");
  return (
    <pre className={`overflow-x-auto rounded-2xl bg-ink px-4 py-3.5 font-mono text-[0.98rem] leading-relaxed text-[#e9f7f5] ${className}`}>
      <code>
        {lines.map((line, i) => {
          const prompt = line.match(/^(\S*\$ ?)(.*)$/);
          if (prompt) {
            const [cmd, comment] = splitComment(prompt[2]);
            return (
              <span key={i} className="block">
                <span className="text-success">{prompt[1]}</span>
                <span>{cmd}</span>
                {comment && <span className="text-[#9fb6c4]">{comment}</span>}
              </span>
            );
          }
          return (
            <span key={i} className="block text-accent">
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
