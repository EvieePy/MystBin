import Editor from "~/components/editor";
import SaveButton from "~/components/saveButton";

export default function Index() {
  return (
    <>
      <SaveButton />

      <main>
        <Editor readOnly={false} />
      </main>
    </>
  );
}
