export type SecurityKey = {
  id: string;
  key: string;
};

export type FontSizeT = "default" | "small" | "large";
export type FontT = "jetbrains" | "fira" | "ibmplex" | "notosans" | "roboto" | "sourcecodepro";

export type SettingsT = {
  // Theme State
  theme: "light" | "dark";
  is_light: boolean;

  // Editor State
  ligatures: boolean;
  word_wrap: boolean;
  line_numbers: boolean;

  // Accessibility
  font_size: FontSizeT;
  font: FontT;
  colour_mode: "default" | "deuteranopia" | "protanopia" | "tritanopia";

  // Sidebar State
  submenu: number;
  current_file: number;
  sec_keys: SecurityKey[];
};

export type CBModes = "default" | "deuteranopia" | "protanopia" | "tritanopia";

export interface LangObj {
  name: string;
  icon: any;
}
