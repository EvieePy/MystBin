import SettingsSVG from "~/svg/Settings";
import SettingsModal from "./settingsModal";
import { createSignal } from "solid-js";
import { usePasteContext } from "~/stores/paste";

interface Props {
  checked: boolean;
}

export default function SaveButton() {
  const [showModal, setShowModal] = createSignal(false);

  const handleSettingsModal = (e: MouseEvent) => {
    e.stopPropagation();
    setShowModal(false);
  };

  const [pasteStore, setPasteStore] = usePasteContext();

  return (
    <div class="saveContainer">
      <SettingsModal showModal={showModal()} title="Save Options" onOutsideClick={handleSettingsModal}>
        sdsd
      </SettingsModal>

      <div class="saveButton">Save Paste</div>
      <div class="saveSettings" onclick={() => setShowModal(true)}>
        <SettingsSVG />
      </div>
    </div>
  );
}
