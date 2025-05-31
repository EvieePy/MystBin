type SettingsT = {
    theme: "light" | "dark";
    is_light: boolean;
    ligatures: boolean;
    word_wrap: boolean;
    line_numbers: boolean;
    font_size: boolean;
    colour_mode: "default" | "deuteranopia" | "protanopia" | "tritanopia";
    side_closed: boolean;
    submenu: number;
}