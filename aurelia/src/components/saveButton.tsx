import SettingsSVG from "~/svg/Settings";
import SettingsModal from "./settingsModal";
import { createSignal, Setter, Show, Signal } from "solid-js";
import { usePasteContext } from "~/stores/paste";
import { useNavigate } from "@solidjs/router";
import localforage from "localforage";
import { SecurityKey } from "~/types/utils";
import CrossIcon from "~/svg/Cross";

interface SaveError {
  message: string;
  timestamp: number;
}

export default function SaveButton() {
  const navigate = useNavigate();
  const [paste, setPaste] = usePasteContext();
  const [showModal, setShowModal] = createSignal(false);
  const [error, setError] = createSignal<SaveError | null>(null);

  const handleSettingsModal = (e: MouseEvent) => {
    e.stopPropagation();
    setShowModal(false);
  };

  const handleCloseError = () => {
    setError(null);
  };

  const showError = () => {
    const e = error();
    if (!e) {
      return;
    }

    setTimeout(() => {
      if (e.timestamp !== error()?.timestamp) {
        return;
      }
      setError(null);
    }, 4500);

    return (
      <div class="saveError" onclick={handleCloseError}>
        <span>{e.message}</span>
        <CrossIcon />
      </div>
    );
  };

  const handleSave = async () => {
    let resp: Response;
    let prepared: FileCreate[] = [];

    const files: FileCreate[] = paste.files as FileCreate[];
    for (let file of files) {
      if (!file.content) {
        continue;
      }
      if (!file.name) {
        file.name = "text";
      }

      if (!file.language) {
        // TODO: Highlight JS (Language Detection...)
        // ...
      }
      prepared.push(file);
    }

    if (prepared.length <= 0) {
      setError({ message: "Cannot save an empty paste.", timestamp: Date.now() });
      return;
    }

    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ files: prepared });

    try {
      resp = await fetch("http://localhost:8000/pastes", { method: "POST", headers: headers, body: body });
    } catch (error) {
      setError({ message: String(error), timestamp: Date.now() });
      return;
    }

    if (resp.status >= 500) {
      setError({
        message: `Internal Server Error: ${resp.status} ${resp.statusText}. Please try again later.`,
        timestamp: Date.now()
      });
      return;
    }

    const data: PasteResponse | ErrorResponse = await resp.json();

    if (resp.ok) {
      const id: string = (data as PasteResponse).id;
      const sec: string | null = (data as PasteResponse).security;

      const storage = (await localforage.getItem("sec_keys")) as SecurityKey[];
      const secKeys: SecurityKey[] = storage ? storage : [];

      if (sec) {
        secKeys.push({ id: id, key: sec });
        localforage.setItem("sec_keys", secKeys);
      }

      // Dumb
      window.location.href = `/${id}`;
      return;
    }

    const message: string = (data as ErrorResponse).message;
    setError({ message: message, timestamp: Date.now() });
  };

  const [pasteStore, setPasteStore] = usePasteContext();

  return (
    <div class="saveContainer">
      <SettingsModal showModal={showModal()} title="Save Options" onOutsideClick={handleSettingsModal}>
        sdsd
      </SettingsModal>

      <div class="saveButton" onclick={handleSave}>
        Save Paste
      </div>
      <div class="saveSettings" onclick={() => setShowModal(true)}>
        <SettingsSVG />
      </div>
      <Show when={error()}>{showError()}</Show>
    </div>
  );
}
