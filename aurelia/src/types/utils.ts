type SettingsT = {
    // Theme State
    theme: "light" | "dark";
    is_light: boolean;

    // Editor State
    ligatures: boolean;
    word_wrap: boolean;
    line_numbers: boolean;

    // Accessibility
    font_size: boolean;
    colour_mode: "default" | "deuteranopia" | "protanopia" | "tritanopia";

    // Sidebar State
    side_closed: boolean;
    submenu: number;
}