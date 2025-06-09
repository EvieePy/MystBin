type SecurityKey = {
  id: string;
  key: string;
};

type SettingsT = {
  // Theme State
  theme: "light" | "dark";
  is_light: boolean;

  // Editor State
  ligatures: boolean;
  word_wrap: boolean;
  line_numbers: boolean;

  // Accessibility
  font_size: "default" | "small" | "large" | "larger";
  colour_mode: "default" | "deuteranopia" | "protanopia" | "tritanopia";

  // Sidebar State
  submenu: number;
  current_file: number;
  sec_keys: SecurityKey[];
};

type CBModes = "default" | "deuteranopia" | "protanopia" | "tritanopia";
