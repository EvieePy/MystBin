import { clientOnly } from "@solidjs/start";
import SaveButton from "~/components/saveButton";

const Editor = clientOnly(() => import("~/components/editor"));

export default function Index() {
  return (
    <>
      <SaveButton />

      <main>
        <Editor readOnly={false} index={0} />
      </main>
    </>
  );
}
