import SettingsSVG from "~/svg/Settings";
import SettingsModal from "./settingsModal";
import { createSignal, Setter, Signal } from "solid-js";
import { usePasteContext } from "~/stores/paste";
import { useNavigate } from "@solidjs/router";
import localforage from "localforage";

export default function SaveButton() {
  const navigate = useNavigate();
  const [paste, setPaste] = usePasteContext();
  const [showModal, setShowModal] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const handleSettingsModal = (e: MouseEvent) => {
    e.stopPropagation();
    setShowModal(false);
  };

  const handleSave = async () => {
    let resp: Response;

    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ files: paste.files });

    try {
      resp = await fetch("http://localhost:8000/pastes", { method: "POST", headers: headers, body: body });
    } catch (error) {
      setError(String(error));
      return;
    }

    if (resp.status >= 500) {
      setError(`Internal Server Error: ${resp.status} ${resp.statusText}. Please try again later.`);
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
      return navigate(`/${id}`);
    }

    const message: string = (data as ErrorResponse).message;
    setError(message);
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
    </div>
  );
}
