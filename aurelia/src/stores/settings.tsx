import { createContext, JSX, useContext } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import { SettingsT } from "~/types/utils";

type SettingsStoreT = [SettingsT, SetStoreFunction<SettingsT>];

const SettingsContext = createContext<SettingsStoreT>();

function createSettingsStore(): SettingsStoreT {
  const [settingsState, setSettingsState] = createStore({
    side_closed: true,
    submenu: 0,
    ligatures: false,
    word_wrap: false,
    line_numbers: true,
    is_light: false,
    theme: "default",
    font_size: "default",
    font: "jetbrains",
    colour_mode: "default",
    current_file: 0,
    sec_keys: []
  });
  return [settingsState, setSettingsState] as SettingsStoreT;
}

interface SettingsProviderP {
  children: JSX.Element;
}

export function SettingsProvider(props: SettingsProviderP) {
  const store = createSettingsStore();
  return <SettingsContext.Provider value={store}>{props.children}</SettingsContext.Provider>;
}

export function useSettingsContext(): SettingsStoreT {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("SettingsContext can only be used within a SettingsStoreProvider.");
  }

  return context;
}
