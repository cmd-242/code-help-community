"use client";

import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { PostgreSQL, sql } from "@codemirror/lang-sql";
import { bracketMatching, HighlightStyle, indentOnInput, syntaxHighlighting } from "@codemirror/language";
import { Compartment, EditorState, type Extension } from "@codemirror/state";
import { drawSelection, EditorView, highlightActiveLine, keymap, lineNumbers } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";
import { useEffect, useRef } from "react";

export type EditorLanguage = "javascript" | "python" | "sql";

type Props = {
  value: string;
  onChange: (value: string) => void;
  language: EditorLanguage;
  disabled?: boolean;
  /** Ctrl/Cmd + Entrée */
  onRun?: () => void;
  ariaLabel: string;
};

const languageExtension = (l: EditorLanguage): Extension => (l === "python" ? python() : l === "sql" ? sql({ dialect: PostgreSQL, upperCaseKeywords: true }) : javascript());

/** Couleurs par jetons de rôle : l'éditeur suit le thème de l'univers. */
const theme = EditorView.theme({
  "&": { backgroundColor: "var(--color-surface)", color: "var(--color-ink)", borderRadius: "1rem", fontSize: "1rem" },
  "&.cm-focused": { outline: "3px solid var(--color-info-deep)" },
  ".cm-scroller": { fontFamily: "inherit", lineHeight: "1.6", overflow: "auto", maxHeight: "22rem" },
  ".cm-content": { padding: "0.75rem 0", caretColor: "var(--color-ink)", minHeight: "7.5rem" },
  ".cm-line": { padding: "0 0.75rem" },
  ".cm-gutters": { backgroundColor: "var(--color-surface-sunk)", color: "var(--color-muted)", border: "none", borderRadius: "1rem 0 0 1rem" },
  ".cm-activeLine": { backgroundColor: "color-mix(in srgb, var(--color-accent) 22%, transparent)" },
  ".cm-activeLineGutter": { backgroundColor: "transparent", color: "var(--color-ink)", fontWeight: "700" },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": { backgroundColor: "color-mix(in srgb, var(--color-info-deep) 28%, transparent)" },
  ".cm-matchingBracket": { backgroundColor: "color-mix(in srgb, var(--color-success) 35%, transparent)", outline: "none" },
  ".cm-tooltip": { backgroundColor: "var(--color-surface)", border: "2px solid var(--color-line)", borderRadius: "0.75rem", color: "var(--color-ink)" },
  ".cm-tooltip-autocomplete ul li[aria-selected]": { backgroundColor: "var(--color-info-deep)", color: "var(--color-surface)" },
});

const highlight = HighlightStyle.define([
  { tag: [t.keyword, t.operatorKeyword, t.controlKeyword, t.definitionKeyword, t.moduleKeyword], color: "var(--color-info-deep)", fontWeight: "700" },
  { tag: [t.string, t.special(t.string)], color: "var(--color-success-deep)" },
  { tag: [t.number, t.bool, t.null], color: "var(--color-danger-text)" },
  { tag: [t.comment, t.lineComment, t.blockComment], color: "var(--color-muted)", fontStyle: "italic" },
  { tag: [t.function(t.variableName), t.function(t.propertyName), t.definition(t.variableName)], color: "var(--color-accent-deep)" },
  { tag: [t.typeName, t.className], color: "var(--color-info-deep)" },
]);

/** Éditeur de code CodeMirror 6 : coloration, indentation, parenthèses auto, accessible au clavier. */
export default function CodeEditor({ value, onChange, language, disabled = false, onRun, ariaLabel }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRun);
  const editable = useRef(new Compartment());

  useEffect(() => {
    onChangeRef.current = onChange;
    onRunRef.current = onRun;
  });

  useEffect(() => {
    if (!host.current) return;
    const view = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          history(),
          drawSelection(),
          indentOnInput(),
          bracketMatching(),
          closeBrackets(),
          autocompletion(),
          highlightActiveLine(),
          syntaxHighlighting(highlight),
          languageExtension(language),
          theme,
          EditorView.lineWrapping,
          EditorView.contentAttributes.of({ "aria-label": ariaLabel, autocapitalize: "off", autocorrect: "off", spellcheck: "false" }),
          editable.current.of([EditorView.editable.of(!disabled), EditorState.readOnly.of(disabled)]),
          keymap.of([
            { key: "Mod-Enter", run: () => (onRunRef.current?.(), true) },
            // Échap rend le focus : sans cela, Tab (indentation) piégerait les utilisateurs du clavier
            { key: "Escape", run: (v) => (v.contentDOM.blur(), true) },
            indentWithTab,
            ...closeBracketsKeymap,
            ...completionKeymap,
            ...historyKeymap,
            ...defaultKeymap,
          ]),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) onChangeRef.current(u.state.doc.toString());
          }),
        ],
      }),
    });
    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // L'éditeur est créé une fois par exercice ; les mises à jour passent par les effets ci-dessous
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, ariaLabel]);

  useEffect(() => {
    viewRef.current?.dispatch({ effects: editable.current.reconfigure([EditorView.editable.of(!disabled), EditorState.readOnly.of(disabled)]) });
  }, [disabled]);

  useEffect(() => {
    const v = viewRef.current;
    if (v && v.state.doc.toString() !== value) v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } });
  }, [value]);

  return <div ref={host} className="overflow-hidden rounded-2xl font-mono shadow-[0_0_0_2px_var(--color-line)]" />;
}
