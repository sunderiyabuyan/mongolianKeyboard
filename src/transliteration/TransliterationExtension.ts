import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { transliterate } from "./engine";

export type TransliterationState = {
  buffer: string;
  bufferStartPos: number | null;
};

const pluginKey = new PluginKey<TransliterationState>("transliteration");

/** Reads the current in-progress Latin buffer (e.g. "s" while waiting to see if "h" follows). */
export function getPendingBuffer(state: import("@tiptap/pm/state").EditorState): string {
  return pluginKey.getState(state)?.buffer ?? "";
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    transliteration: {
      /** Feed one raw Latin character into the transliteration buffer. */
      pushTransliterationChar: (char: string) => ReturnType;
      /** Commit the current buffer, ending the active word. */
      flushTransliterationBuffer: () => ReturnType;
    };
  }
}

/**
 * Tracks the raw Latin characters typed for the "current word" and keeps the
 * document in sync with `transliterate(buffer)` as each character arrives.
 * Both real keystrokes and virtual-keyboard clicks call the same
 * `pushTransliterationChar` command, so they share identical behavior.
 */
export const TransliterationExtension = Extension.create({
  name: "transliteration",

  addProseMirrorPlugins() {
    return [
      new Plugin<TransliterationState>({
        key: pluginKey,
        state: {
          init: () => ({ buffer: "", bufferStartPos: null }),
          apply(tr, prev) {
            const meta = tr.getMeta(pluginKey) as Partial<TransliterationState> | undefined;
            if (meta) {
              return { ...prev, ...meta };
            }
            // Any transaction that isn't ours (e.g. clicking elsewhere,
            // undo, external content changes) invalidates the buffer so we
            // never try to replace text at a stale position.
            if (tr.docChanged || tr.selectionSet) {
              return { buffer: "", bufferStartPos: null };
            }
            return prev;
          },
        },
      }),
    ];
  },

  addCommands() {
    return {
      pushTransliterationChar:
        (char: string) =>
        ({ tr, state, dispatch }) => {
          const pluginState = pluginKey.getState(state);
          if (!pluginState) return false;

          const { selection } = state;
          const atBufferEnd =
            pluginState.bufferStartPos !== null &&
            selection.empty &&
            selection.from ===
              pluginState.bufferStartPos + transliterate(pluginState.buffer).length;

          const prevBuffer = atBufferEnd ? pluginState.buffer : "";
          const startPos = atBufferEnd ? pluginState.bufferStartPos! : selection.from;

          const oldText = transliterate(prevBuffer);
          const newBuffer = prevBuffer + char;
          const newText = transliterate(newBuffer);

          tr.insertText(newText, startPos, startPos + oldText.length);
          tr.setMeta(pluginKey, {
            buffer: newBuffer,
            bufferStartPos: startPos,
          } satisfies TransliterationState);
          tr.setMeta("addToHistory", true);

          if (dispatch) dispatch(tr);
          return true;
        },

      flushTransliterationBuffer:
        () =>
        ({ tr, dispatch }) => {
          tr.setMeta(pluginKey, { buffer: "", bufferStartPos: null } satisfies TransliterationState);
          if (dispatch) dispatch(tr);
          return true;
        },
    };
  },
});
