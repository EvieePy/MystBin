import { Editor, PrismEditor } from "solid-prism-editor";
import { copyButton } from "solid-prism-editor/copy-button";
import { indentGuides } from "solid-prism-editor/guides";

// FIXME: ...
import "solid-prism-editor/prism/languages";
import "solid-prism-editor/languages/jsx";
import "solid-prism-editor/languages";
import "solid-prism-editor/layout.css";
import "solid-prism-editor/themes/github-dark.css";
import "solid-prism-editor/search.css";
import "solid-prism-editor/copy-button.css";
import { useSettingsContext } from "~/stores/settings";
import { createMemo } from "solid-js";
import { usePasteContext } from "~/stores/paste";
import { produce } from "solid-js/store";

interface Props {
  initialValue?: string;
  readOnly: boolean;
  index: number;
}

export default (props: Props) => {
  const [settings, _] = useSettingsContext();
  const [paste, setPaste] = usePasteContext();
  const extensions = createMemo(() => (settings.word_wrap ? [copyButton()] : [copyButton(), indentGuides()]));

  const onUpdate = (value: string, editor: PrismEditor) => {
    if (!paste.files[props.index]) {
      return;
    }

    setPaste(
      "files",
      props.index,
      produce((file) => {
        file.content = value;
      })
    );
  };

  // onMount(() => {
  //   if (!props.initialValue) { return }

  //   const line = document.querySelector('[data-line="2"]');
  //   line?.classList.add("annotation");
  //   line.dataset.tooltip = "Kjashdfjkhsdfjkhasjkakledjwet783487tgh378ygb378b378gbg7ybudhvdjcvjhv aksfjhajkf 28372835y2835";

  // })

  return (
    <Editor
      wordWrap={settings.word_wrap}
      lineNumbers={settings.line_numbers}
      class={settings.ligatures ? "ligatures" : ""}
      language={paste.files[props.index] ? paste.files[props.index].language || "" : ""}
      value={props.initialValue}
      readOnly={props.readOnly}
      extensions={extensions()}
      onUpdate={onUpdate}
    />
  );
};
