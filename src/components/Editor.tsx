import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { TRANSLITERATION_RULES } from "../transliteration/map";
import { getPendingBuffer, TransliterationExtension } from "../transliteration/TransliterationExtension";
import { Toolbar } from "./Toolbar";
import { TopBar } from "./TopBar";
import { VirtualKeyboard } from "./VirtualKeyboard";
import { RulesRail } from "./RulesRail";
import { Footer } from "./Footer";

// Keys we intercept and route through the transliteration buffer: any single
// key that appears as a rule's Latin input (letters plus symbols like "[" for
// ы). Anything else (space, enter, backspace, arrows, punctuation with no
// rule, ...) is left to ProseMirror's default handling and flushes the
// current buffer.
const INTERCEPTED_KEYS = new Set(
  TRANSLITERATION_RULES.filter(([latin]) => latin.length === 1).map(([latin]) => latin),
);

const INITIAL_CONTENT = `
  <h2>Гарчиг</h2>
  <p>текст</p>
  <p></p>
`;

export function Editor() {
  const [pending, setPending] = useState("");
  const [shiftActive, setShiftActive] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, TransliterationExtension],
    content: INITIAL_CONTENT,
    onTransaction({ editor }) {
      setPending(getPendingBuffer(editor.state));
    },
    editorProps: {
      attributes: { class: "doc" },
      handleKeyDown(_view, event) {
        if (event.metaKey || event.ctrlKey || event.altKey) return false;

        if (INTERCEPTED_KEYS.has(event.key.toLowerCase())) {
          event.preventDefault();
          editor?.commands.pushTransliterationChar(event.key);
          return true;
        }

        editor?.commands.flushTransliterationBuffer();
        return false;
      },
    },
  });

  function handleVirtualKeyPress(latinKey: string) {
    const char = shiftActive ? latinKey.toUpperCase() : latinKey;
    editor?.chain().focus().pushTransliterationChar(char).run();
    if (shiftActive) setShiftActive(false);
  }

  function handleVirtualShift() {
    setShiftActive((active) => !active);
  }

  function handleVirtualSpace() {
    editor?.chain().focus().flushTransliterationBuffer().insertContent(" ").run();
  }

  function handleVirtualEnter() {
    editor?.chain().focus().flushTransliterationBuffer().splitBlock().run();
  }

  function handleVirtualBackspace() {
    if (!editor) return;
    // Our buffer's transliterated text is already live in the document (not
    // a separate ghost preview), so backspace always just deletes the last
    // character; flushing first stops it from trying to re-transliterate a
    // stale buffer against the now-shorter text.
    const { from } = editor.state.selection;
    editor
      .chain()
      .focus()
      .flushTransliterationBuffer()
      .deleteRange({ from: Math.max(0, from - 1), to: from })
      .run();
  }

  return (
    <div className="editor-card">
      <TopBar />
      <div className="editor-body">
        <div className="editor-main">
          <Toolbar editor={editor} />
          <div className="doc-scroll">
            <EditorContent editor={editor} />
          </div>
          <VirtualKeyboard
            pending={pending}
            shiftActive={shiftActive}
            onKeyPress={handleVirtualKeyPress}
            onShift={handleVirtualShift}
            onSpace={handleVirtualSpace}
            onEnter={handleVirtualEnter}
            onBackspace={handleVirtualBackspace}
          />
        </div>
        <RulesRail pending={pending} />
      </div>
      <Footer />
    </div>
  );
}
