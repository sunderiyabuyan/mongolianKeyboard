import { useState } from "react";
import type { Editor } from "@tiptap/react";

const HEADINGS = [{ label: "Гарчиг 1", level: 2 as const }];

type ToolbarProps = {
  editor: Editor | null;
};

export function Toolbar({ editor }: ToolbarProps) {
  const [clipboardError, setClipboardError] = useState<string | null>(null);

  const run = (fn: (editor: Editor) => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (editor) fn(editor);
  };

  const handleCopy = async () => {
    if (!editor) return;
    const html = editor.getHTML();
    const text = editor.getText();

    // Write both representations so pasting into a rich-text target (this
    // editor, a doc, an email) keeps bold/italic/underline/headings, while a
    // plain-text target still gets sensible text.
    if (typeof ClipboardItem !== "undefined") {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([text], { type: "text/plain" }),
          }),
        ]);
        setClipboardError(null);
        return;
      } catch {
        // Some browsers/embeddings allow writeText() but block write() with
        // custom MIME types — fall through to the plain-text path below
        // rather than failing outright.
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setClipboardError(null);
    } catch {
      setClipboardError("Санах ойд хуулах боломжгүй байна. Ctrl/Cmd+C ашиглана уу.");
    }
  };

  const handlePaste = async () => {
    if (!editor) return;

    // Prefer text/html so formatting survives; some browsers/embeddings
    // allow readText() but block the general read() API, so fall through to
    // plain text rather than failing outright.
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        if (item.types.includes("text/html")) {
          const blob = await item.getType("text/html");
          const html = await blob.text();
          editor.chain().focus().insertContent(html).run();
          setClipboardError(null);
          return;
        }
      }
    } catch {
      // fall through to readText() below
    }

    try {
      const text = await navigator.clipboard.readText();
      editor.chain().focus().insertContent(text).run();
      setClipboardError(null);
    } catch {
      setClipboardError("Санах ойгоос буулгах боломжгүй байна. Ctrl/Cmd+V ашиглана уу.");
    }
  };

  return (
    <div className="tbar">
      <span className="tgrp">
        <button
          className="tb"
          type="button"
          style={{ fontWeight: 700 }}
          aria-label="Тод"
          aria-pressed={editor?.isActive("bold")}
          onMouseDown={run((e) => e.chain().focus().toggleBold().run())}
        >
          B
        </button>
        <button
          className="tb"
          type="button"
          style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}
          aria-label="Налуу"
          aria-pressed={editor?.isActive("italic")}
          onMouseDown={run((e) => e.chain().focus().toggleItalic().run())}
        >
          I
        </button>
        <button
          className="tb"
          type="button"
          style={{ textDecoration: "underline" }}
          aria-label="Доогуур зураас"
          onMouseDown={run((e) => e.chain().focus().toggleUnderline().run())}
        >
          U
        </button>
      </span>
      <span className="tgrp">
        {HEADINGS.map((h) => (
          <button
            key={h.level}
            className="tb tbw"
            type="button"
            aria-pressed={editor?.isActive("heading", { level: h.level })}
            onMouseDown={run((e) => e.chain().focus().toggleHeading({ level: h.level }).run())}
          >
            {h.label}
          </button>
        ))}
        <button
          className="tb tbw"
          type="button"
          aria-pressed={editor?.isActive("paragraph")}
          onMouseDown={run((e) => e.chain().focus().setParagraph().run())}
        >
          Энгийн
        </button>
      </span>
      <span className="tgrp">
        <button
          className="tb"
          type="button"
          aria-label="Цэгт жагсаалт"
          onMouseDown={run((e) => e.chain().focus().toggleBulletList().run())}
        >
          •—
        </button>
        <button
          className="tb"
          type="button"
          aria-label="Дугаарласан жагсаалт"
          onMouseDown={run((e) => e.chain().focus().toggleOrderedList().run())}
        >
          1—
        </button>
      </span>
      <span className="tgrp" style={{ marginLeft: "auto" }}>
        <button
          className="btn btn-secondary sans"
          type="button"
          style={{ background: "var(--color-bg)", fontSize: 13 }}
          onClick={handleCopy}
        >
          Copy
        </button>
        <button
          className="btn btn-secondary sans"
          type="button"
          style={{ background: "var(--color-bg)", fontSize: 13 }}
          onClick={handlePaste}
        >
          Paste
        </button>
      </span>
      {clipboardError && (
        <span className="sans" style={{ flexBasis: "100%", fontSize: 12, color: "var(--color-accent-700)" }}>
          {clipboardError}
        </span>
      )}
    </div>
  );
}
