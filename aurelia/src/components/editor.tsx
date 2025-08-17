// NOTE: For some odd reason
// importing the common languages as one does not play nicely, so they have all been added individually..
import "solid-prism-editor/prism/languages/bash";
import "solid-prism-editor/prism/languages/css";
import "solid-prism-editor/prism/languages/css-extras";
import "solid-prism-editor/prism/languages/ini";
import "solid-prism-editor/prism/languages/kotlin";
import "solid-prism-editor/prism/languages/xml";
import "solid-prism-editor/prism/languages/markup";
import "solid-prism-editor/prism/languages/markdown";
import "solid-prism-editor/prism/languages/php";
import "solid-prism-editor/prism/languages/php-extras";
import "solid-prism-editor/prism/languages/r";
import "solid-prism-editor/prism/languages/basic";
import "solid-prism-editor/prism/languages/vbnet";
import "solid-prism-editor/prism/languages/c";
import "solid-prism-editor/prism/languages/opencl";
import "solid-prism-editor/prism/languages/diff";
import "solid-prism-editor/prism/languages/java";
import "solid-prism-editor/prism/languages/less";
import "solid-prism-editor/prism/languages/objectivec";
import "solid-prism-editor/prism/languages/ruby";
import "solid-prism-editor/prism/languages/sql";
import "solid-prism-editor/prism/languages/wasm";
import "solid-prism-editor/prism/languages/cpp";
import "solid-prism-editor/prism/languages/go";
import "solid-prism-editor/prism/languages/javascript";
import "solid-prism-editor/prism/languages/js-templates";
import "solid-prism-editor/prism/languages/jsx";
import "solid-prism-editor/prism/languages/lua";
import "solid-prism-editor/prism/languages/perl";
import "solid-prism-editor/prism/languages/python";
import "solid-prism-editor/prism/languages/rust";
import "solid-prism-editor/prism/languages/swift";
import "solid-prism-editor/prism/languages/clike";
import "solid-prism-editor/prism/languages/csharp";
import "solid-prism-editor/prism/languages/graphql";
import "solid-prism-editor/prism/languages/json";
import "solid-prism-editor/prism/languages/makefile";
import "solid-prism-editor/prism/languages/scss";
import "solid-prism-editor/prism/languages/typescript";
import "solid-prism-editor/prism/languages/tsx";
import "solid-prism-editor/prism/languages/yaml";
import "solid-prism-editor/prism/languages/regex";
import "solid-prism-editor/prism/languages/toml";

import { Editor, PrismEditor } from "solid-prism-editor";
import { copyButton } from "solid-prism-editor/copy-button";
import { indentGuides } from "solid-prism-editor/guides";
import { useSettingsContext } from "~/stores/settings";
import { createMemo, JSX } from "solid-js";
import { usePasteContext } from "~/stores/paste";
import { produce } from "solid-js/store";
import { createOptions, Select } from "@thisbeyond/solid-select";
import "@thisbeyond/solid-select/style.css";
import "solid-prism-editor/layout.css";
import "solid-prism-editor/themes/github-dark.css";
import "solid-prism-editor/search.css";
import "solid-prism-editor/copy-button.css";

import TextIcon from "~/svg/langs/text";
import { LangObj } from "~/types/utils";
import { LANGS, EXTS } from "~/utils";

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

  const findLangByExt = (name: string): string => {
    let splat = name.split(".");
    let ext = splat[splat.length - 1];

    const lang: string | undefined = EXTS[`.${ext}`];
    return lang || "text";
  };

  const onNameUpdate: JSX.ChangeEventHandler<HTMLInputElement, Event> = (event) => {
    const inp = event.currentTarget;
    let val = inp.value;

    if (!paste.files[props.index]) {
      return;
    }

    if (!val) {
      val = "new_file.txt";
    }

    const lang = findLangByExt(val);

    setPaste(
      "files",
      props.index,
      produce((file) => {
        file.name = val;
        file.language = lang || file.language;
      })
    );
  };

  const onLangUpdate = (value: LangObj) => {
    if (!paste.files[props.index]) {
      return;
    }

    if (!value) {
      return;
    }

    setPaste(
      "files",
      props.index,
      produce((file) => {
        file.language = value.name;
      })
    );
  };

  const format = (value: LangObj, type: any, meta: any) => {
    return (
      <div class="langIn">
        {<value.icon />}
        <span>{value.name}</span>
      </div>
    );
  };

  const loadLangs = createOptions(LANGS, { format, extractText: (value: LangObj) => value.name });

  const findLang = (): LangObj => {
    const name = paste.files[props.index].language || "text";
    let lang = LANGS.find((l) => l.name === name);

    if (lang !== undefined) {
      return lang;
    }

    lang = LANGS.find((l) => l.name === findLangByExt(name));
    return lang || { name: "text", icon: TextIcon };
  };

  const unfocusInp: JSX.EventHandlerUnion<
    HTMLInputElement,
    KeyboardEvent,
    JSX.EventHandler<HTMLInputElement, KeyboardEvent>
  > = (event) => {
    if (event.key === "Enter") {
      event.currentTarget.blur();

      const editorTAs = document.querySelector<HTMLTextAreaElement>('textarea[class="pce-textarea"]');
      const editorTA = editorTAs;

      event.preventDefault();
      if (editorTA) {
        editorTA.focus({ preventScroll: true });
      }
    }
  };

  // onMount(() => {
  //   if (!props.initialValue) { return }

  //   const line = document.querySelector('[data-line="2"]');
  //   line?.classList.add("annotation");
  //   line.dataset.tooltip = "Kjashdfjkhsdfjkhasjkakledjwet783487tgh378ygb378b378gbg7ybudhvdjcvjhv aksfjhajkf 28372835y2835";

  // })

  return (
    <>
      <div class="metaHeader">
        <input
          type="text"
          value={paste.files[props.index].name}
          onchange={onNameUpdate}
          readOnly={props.readOnly}
          onkeydown={unfocusInp}
        ></input>
        <div>
          <Select
            class="langSelect"
            {...loadLangs}
            onChange={onLangUpdate}
            initialValue={findLang()}
            placeholder={paste.files[props.index].language || "Language..."}
          ></Select>
        </div>
      </div>

      <Editor
        wordWrap={settings.word_wrap}
        lineNumbers={settings.line_numbers}
        class={
          settings.ligatures
            ? `ligatures fontS-${settings.font_size} fontT-${settings.font}`
            : `fontS-${settings.font_size} fontT-${settings.font}`
        }
        language={paste.files[props.index] ? findLang().name || "" : ""}
        value={props.initialValue}
        readOnly={props.readOnly}
        extensions={extensions()}
        onUpdate={onUpdate}
      />
    </>
  );
};
