import { Editor } from "solid-prism-editor";
import { copyButton } from "solid-prism-editor/copy-button";
import { indentGuides } from "solid-prism-editor/guides";

// FIXME: ...
import "solid-prism-editor/prism/languages/jsx";
import "solid-prism-editor/languages/jsx";
import "solid-prism-editor/layout.css";
import "solid-prism-editor/themes/github-dark.css";
import "solid-prism-editor/search.css";
import "solid-prism-editor/copy-button.css";
import { useSettingsContext } from "~/stores/settings";
import { createEffect, createMemo, createSignal } from "solid-js";

interface Props {
  initialValue?: string;
  readOnly: boolean;
}

export default (props: Props) => {
  const [settings, _] = useSettingsContext();
  const extensions = createMemo(() => (settings.word_wrap ? [copyButton()] : [copyButton(), indentGuides()]));

  return (
    <Editor
      wordWrap={settings.word_wrap}
      lineNumbers={settings.line_numbers}
      class={settings.ligatures ? "ligatures" : ""}
      language="jsx"
      value={props.initialValue}
      readOnly={props.readOnly}
      extensions={extensions()}
    />
  );
};
