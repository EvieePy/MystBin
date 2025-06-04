import { Editor } from "solid-prism-editor";
import { basicSetup } from "solid-prism-editor/setups";

// FIXME: ...
import "solid-prism-editor/prism/languages/jsx";
import "solid-prism-editor/languages/jsx";
import "solid-prism-editor/layout.css";
import "solid-prism-editor/themes/github-dark.css";
import "solid-prism-editor/search.css";

interface Props {
  initialValue?: string;
  readOnly: boolean;
}

export default (props: Props) => {
  return <Editor language="jsx" value={props.initialValue} readOnly={props.readOnly} extensions={basicSetup} />;
};
