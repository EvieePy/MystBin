import {
  createSignal,
  createEffect,
  Match,
  Switch,
  Suspense,
  createResource,
  onMount,
  createRenderEffect,
  For,
  Show
} from "solid-js";
import ChevronRightSVG from "~/svg/ChevronRight";
import ChevronDownSVG from "~/svg/ChevronDown";
import HamburgerMenuSVG from "~/svg/HamburgerMenu";
import DiscordSVG from "~/svg/Discord";
import GitHubSVG from "~/svg/GitHub";
import MenuBookSVG from "~/svg/MenuBook";
import VSCodeSVG from "~/svg/VSCode";
import SettingsSVG from "~/svg/Settings";
import LogoSVG from "~/svg/Logo";
import ToggleSwitch from "./toggle";
import VerticalEllipsisSVG from "~/svg/VerticalEllipsis";
import SettingsModal from "./settingsModal";
import { useSettingsContext } from "~/stores/settings";
import HomeSVG from "~/svg/Home";
import FileSVG from "~/svg/File";
import { createServerCookie } from "@solid-primitives/cookies";
import HelpSVG from "~/svg/Help";
import { usePasteContext } from "~/stores/paste";
import localforage from "localforage";
import { CBModes, FontSizeT, FontT, SecurityKey } from "~/types/utils";
import ColourBlindCard from "./colourBlindCard";

import { LangObj } from "~/types/utils";
import { LANGS, EXTS } from "~/utils";
import TextIcon from "~/svg/langs/text";
import FontSelector from "./fontSelector";

const fetchApiVersion = async () => {
  let resp: Response;

  try {
    resp = await fetch("http://localhost:8000/version");
  } catch (error) {
    return "Unknown";
  }

  if (!resp.ok) {
    return "Unknown";
  }

  const data: VersionResponse = await resp.json();
  return data["version"];
};

export default function SideBar() {
  const [settings, setSettings] = useSettingsContext();
  const [paste, setPaste] = usePasteContext();
  const [asideClosedCookie, setAsideClosedCookie] = createServerCookie("asideClosed");

  const initialAsideClosed = asideClosedCookie() === "true";
  const [asideClosed, setAsideClosed] = createSignal(initialAsideClosed);

  const [hideText, setHideText] = createSignal(initialAsideClosed);

  const [showAccessModal, setshowAccessModal] = createSignal(false);
  const [apiVersion] = createResource(fetchApiVersion);
  const [extraButtons, setExtraButtons] = createSignal<string | null>(null);

  createRenderEffect(() => {
    setAsideClosed(asideClosedCookie() === "true");
  });

  onMount(async () => {
    const localTheme = localStorage.getItem("theme") as "light" | "dark";
    const systemSettingDark = !window.matchMedia("(prefers-color-scheme: dark)")?.matches;
    const colourMode = localStorage.getItem("colour_mode") as CBModes;
    const secKeys = (await localforage.getItem("sec_keys")) as SecurityKey[];
    const fontSize = (await localforage.getItem("font_size")) as FontSizeT;
    const font = (await localforage.getItem("font")) as FontT;

    setSettings("sec_keys", secKeys ? secKeys : []);
    setSettings("is_light", localTheme ? localTheme === "light" : systemSettingDark);
    setSettings("theme", localTheme || (systemSettingDark ? "dark" : "light"));
    setSettings("colour_mode", colourMode || "default");
    setSettings("font_size", fontSize || "default");
    setSettings("font", font || "jetbrains");

    if (!paste) {
      return;
    }
    if ((paste as PasteResponse).id) {
      const foundKey: SecurityKey | undefined = secKeys.find((obj) => (paste as PasteResponse).id === obj.id);
      setExtraButtons(foundKey?.key || null);
    }
  });

  let hideTextTimeout: ReturnType<typeof setTimeout> | null = null;

  createEffect(() => {
    if (hideTextTimeout) {
      clearTimeout(hideTextTimeout);
      hideTextTimeout = null;
    }
    if (Boolean(asideClosed())) {
      hideTextTimeout = setTimeout(() => setHideText(true), 350);
    } else {
      setHideText(false);
    }
  });

  const deletePaste = async (pasteId: string) => {
    let resp: Response;

    const storage = (await localforage.getItem("sec_keys")) as SecurityKey[];
    const secKeys: SecurityKey[] = storage ? storage : [];

    if (!secKeys || secKeys.length <= 0) {
      return;
    }
    const token = secKeys.find((k) => k.id === pasteId);

    if (!token) {
      return;
    }

    try {
      resp = await fetch(`http://localhost:8000/security/${token.key}`, { method: "DELETE" });
    } catch (error) {
      console.error(error);
      return;
    }

    // Dumb
    window.location.href = "/";
  };

  const handleSubMenu = (data: number, e: MouseEvent) => {
    e.preventDefault();

    if (data === settings.submenu) {
      setSettings("submenu", 0);
      localStorage.setItem("submenu", "0");
      return;
    }

    if (Boolean(asideClosed())) {
      setTimeout(() => setSettings("submenu", data), 350);
    } else {
      setSettings("submenu", data);
    }

    setAsideClosedCookie("false");
    localStorage.setItem("submenu", String(data));
  };

  const handleShowSide = () => {
    if (asideClosed() === false) {
      setSettings("submenu", 0);
      localStorage.setItem("submenu", "0");
    } else {
      setSettings("submenu", 1);
      localStorage.setItem("submenu", "1");
    }

    setAsideClosedCookie(String(!asideClosed()));
  };

  const handleLightModeClick = (e: MouseEvent) => {
    e.preventDefault();

    const flipped = !settings.is_light;
    const theme = flipped ? "light" : "dark";

    localStorage.setItem("theme", theme);
    document.querySelector("html")!.setAttribute("data-theme", theme);
    setSettings("is_light", flipped);
  };

  const handleLigaturesClick = (e: MouseEvent) => {
    e.preventDefault();

    const flipped = !settings.ligatures;

    localStorage.setItem("ligatures", String(flipped));
    setSettings("ligatures", flipped);
  };

  const handleLineNumClick = (e: MouseEvent) => {
    e.preventDefault();

    const flipped = !settings.line_numbers;

    localStorage.setItem("line_numbers", String(flipped));
    setSettings("line_numbers", flipped);
  };

  const handleWordWrapClick = (e: MouseEvent) => {
    e.preventDefault();

    const flipped = !settings.word_wrap;

    localStorage.setItem("word_wrap", String(flipped));
    setSettings("word_wrap", flipped);
  };

  const handleOutsideModal = (e: MouseEvent) => {
    e.stopPropagation();
    setshowAccessModal(false);
  };

  const handleColourBlindMode = (value: CBModes) => {
    localStorage.setItem("colour_mode", value);
    setSettings("colour_mode", value);
  };

  const findLangByExt = (name: string): LangObj => {
    let splat = name.split(".");
    let ext = splat[splat.length - 1];

    const lang: string | undefined = EXTS[`.${ext}`];
    return LANGS.find((l) => l.name === lang) || { name: "text", icon: TextIcon };
  };

  const handleHome = () => {
    // Dumb
    // Extra dumb
    window.location.href = "/";
  };

  // const findLang = (index: number): LangObj => {
  //   const name = paste.files[index].language || "text";
  //   let lang = LANGS.find((l) => l.name === name);

  //   if (lang !== undefined) {
  //     return lang;
  //   }

  //   lang = LANGS.find((l) => l.name === findLangByExt(name));
  //   return lang || { name: "text", icon: TextIcon };
  // };

  // TODO: Mobile detection...

  return (
    <>
      {/* Modals */}
      <SettingsModal showModal={showAccessModal()} title="Accessibility Settings" onOutsideClick={handleOutsideModal}>
        <span class="settingsHeader">Font Settings</span>
        <span class="settingsDesc">Settings to adjust the editor font size and style.</span>
        <div class="accessSettingContainer">
          <div>
            <span class="settingsDesc">Font Size</span>
            <FontSelector size_selector={true} />
          </div>

          <div>
            <span class="settingsDesc">Font Family</span>
            <FontSelector size_selector={false} />
          </div>
        </div>

        <hr />

        <span class="settingsHeader">Colour Accessibility</span>
        <span class="settingsDesc">Settings to help with various colour deficiencies and colour blindness.</span>

        <div class="colourBlindGrid">
          <div
            class="colourBlindContainer"
            classList={{ activeSetting: settings.colour_mode === "default" }}
            onclick={() => handleColourBlindMode("default")}
          >
            <ColourBlindCard box_one="#34af9b" box_two="#f0e442" line_one="#34af9b" line_two="#f0e442" border="#ce75cc;" />
          </div>

          <div
            class="colourBlindContainer"
            classList={{ activeSetting: settings.colour_mode === "deuteranopia" }}
            onclick={() => handleColourBlindMode("deuteranopia")}
          >
            <ColourBlindCard box_one="#1585fd;" box_two="#d69a00" line_one="#1585fd;" line_two="#d69a00" border="#6288d1;" />
          </div>

          <div
            class="colourBlindContainer"
            classList={{ activeSetting: settings.colour_mode === "protanopia" }}
            onclick={() => handleColourBlindMode("protanopia")}
          >
            <ColourBlindCard box_one="#1585fd" box_two="#E1EC1B" line_one="#1585fd" line_two="#E1EC1B" border="#ce75cc;" />
          </div>
          <div
            class="colourBlindContainer"
            classList={{ activeSetting: settings.colour_mode === "tritanopia" }}
            onclick={() => handleColourBlindMode("tritanopia")}
          >
            <ColourBlindCard box_one="#1585fd" box_two="#fa4549" line_one="#1585fd" line_two="#fa4549" border="#1585fd;" />
          </div>
        </div>
      </SettingsModal>

      <nav id="sidebar" classList={{ sideClosed: Boolean(asideClosed()) }}>
        <ul>
          <li class="sideHeader" classList={{ sideHeaderClosed: Boolean(asideClosed()) }}>
            <Switch>
              <Match when={!Boolean(asideClosed())}>
                <span class="logo" onclick={handleHome}>
                  <LogoSVG /> MystBin
                </span>
              </Match>
              <Match when={Boolean(asideClosed())}>
                <span></span>
              </Match>
            </Switch>
            <span class="sideClose" on:click={handleShowSide}>
              <HamburgerMenuSVG />
            </span>
          </li>

          <li onclick={handleHome}>
            <span class="sideButton">
              <HomeSVG />
              <span classList={{ hide: hideText() }}>Home</span>
            </span>
          </li>

          {/* Files Submenu */}
          <li class="noBack" classList={{ active: settings.submenu === 1 }}>
            <span class="sideButton" on:click={(e) => handleSubMenu(1, e)}>
              <FileSVG />
              <span classList={{ hide: hideText() }}>Files</span>
              <Switch>
                <Match when={Boolean(asideClosed())}>{null}</Match>
                <Match when={settings.submenu === 1}>
                  <ChevronDownSVG />
                </Match>
                <Match when={settings.submenu !== 1}>
                  <ChevronRightSVG />
                </Match>
              </Switch>
            </span>
            <ul class={settings.submenu === 1 ? "subMenu showMenu" : "subMenu"}>
              <div>
                <For each={paste.files}>
                  {(file, index) => (
                    <li
                      onclick={() => setSettings("current_file", index)}
                      classList={{ active: settings.current_file === index() }}
                    >
                      <span classList={{ fileName: true, hide: hideText() }}>
                        {findLangByExt(file.name || "text").icon}
                        {file.name || "new_file"}
                      </span>
                    </li>
                  )}
                </For>
              </div>
            </ul>
          </li>

          {/* Settings Submenu */}
          <li class="noBack" classList={{ active: settings.submenu === 3 }}>
            <span class="sideButton" on:click={(e) => handleSubMenu(3, e)}>
              <SettingsSVG />
              <span classList={{ hide: hideText() }}>Settings</span>
              <Switch>
                <Match when={Boolean(asideClosed())}>{null}</Match>
                <Match when={settings.submenu === 3}>
                  <ChevronDownSVG />
                </Match>
                <Match when={settings.submenu !== 3}>
                  <ChevronRightSVG />
                </Match>
              </Switch>
            </span>
            <ul class={settings.submenu === 3 ? "subMenu showMenu" : "subMenu"}>
              <div>
                {/* THEME TOGGLE */}
                <li onclick={handleLightModeClick}>
                  <span classList={{ hide: hideText() }}>
                    <span>Light Theme </span>
                  </span>
                  <ToggleSwitch checked={settings.is_light} />
                </li>
                {/* LIGATURES TOGGLE */}
                <li onclick={handleLigaturesClick}>
                  <span classList={{ hide: hideText() }}>
                    <span>Font Ligatures </span>
                  </span>
                  <ToggleSwitch checked={settings.ligatures} />
                </li>
                {/* LINE-NUMBER TOGGLE */}
                <li onclick={handleLineNumClick}>
                  <span classList={{ hide: hideText() }}>
                    <span>Show Line Numbers </span>
                  </span>
                  <ToggleSwitch checked={settings.line_numbers} />
                </li>
                {/* WORD WRAP TOGGLE */}
                <li onclick={handleWordWrapClick}>
                  <span classList={{ hide: hideText() }} class="toggleSetting">
                    <span>Word Wrap </span>
                    <div data-tooltip="Note: This setting will disable indent guidelines.">
                      <HelpSVG />
                    </div>
                  </span>
                  <ToggleSwitch checked={settings.word_wrap} />
                </li>
                {/* ACCESSIBILITY MENU */}
                <li onclick={() => setshowAccessModal(true)}>
                  <span classList={{ hide: hideText() }}>Accessibility Menu</span>
                  <VerticalEllipsisSVG />
                </li>
              </div>
            </ul>
          </li>
        </ul>

        {/* Sidebar Meta Data */}
        <div class="meta">
          <Show when={extraButtons()}>
            <div class="manageButtons">
              <div class="deleteButton" onclick={() => deletePaste((paste as PasteResponse).id)}>
                Delete
              </div>
              <div class="securityButton">Security Info</div>
            </div>
          </Show>
          <Suspense fallback={<span class="smallText">...</span>}>
            <Switch>
              <Match when={apiVersion.error}>
                <span class="smallText">...</span>
              </Match>
              <Match when={apiVersion()}>
                <span class="smallText">{apiVersion()}</span>
              </Match>
            </Switch>
          </Suspense>
          <Switch>
            <Match when={!Boolean(asideClosed())}>
              <div class="socials">
                <a href="https://discord.gg/RAKc3HF" title="Discord">
                  <DiscordSVG />
                </a>
                <a href="https://github.com/PythonistaGuild/mystbin" title="GitHub">
                  <GitHubSVG />
                </a>
                <a href="/" title="Documentation">
                  <MenuBookSVG />
                </a>
                <a href="/" title="Install on VSCode">
                  <VSCodeSVG />
                </a>
              </div>
            </Match>
            <Match when={Boolean(asideClosed())}>
              <div class="socials">
                <a href="/" title="Documentation">
                  <MenuBookSVG />
                </a>
              </div>
            </Match>
          </Switch>
        </div>
      </nav>
    </>
  );
}
