import { Editor } from "solid-prism-editor";
import { basicSetup } from "solid-prism-editor/setups";

// FIXME: ...
import "solid-prism-editor/prism/languages/jsx";
import "solid-prism-editor/languages/jsx";
import "solid-prism-editor/layout.css";
import "solid-prism-editor/themes/github-dark.css";
import "solid-prism-editor/search.css";
import { useSettingsContext } from "~/stores/settings";

interface Props {
  initialValue?: string;
  readOnly: boolean;
}

export default (props: Props) => {
    const [settings, setSettings] = useSettingsContext();
    
  return <Editor class={settings.ligatures ? "ligatures" : ""} language="jsx" value={props.initialValue} readOnly={props.readOnly} extensions={basicSetup} />;
};
