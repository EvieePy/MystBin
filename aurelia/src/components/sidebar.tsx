import { createSignal, createEffect, Match, Switch, Suspense, createResource, onMount, createRenderEffect } from "solid-js";
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
  const [asideClosedCookie, setAsideClosedCookie] = createServerCookie("asideClosed");

  const initialAsideClosed = asideClosedCookie() === "true";
  const [asideClosed, setAsideClosed] = createSignal(initialAsideClosed);

  const [hideText, setHideText] = createSignal(initialAsideClosed);

  const [showAccessModal, setshowAccessModal] = createSignal(false);
  const [apiVersion] = createResource(fetchApiVersion);

  createRenderEffect(() => {
    setAsideClosed(asideClosedCookie() === "true");
  });

  onMount(() => {
    const localTheme = localStorage.getItem("theme") as "light" | "dark";
    const systemSettingDark = !window.matchMedia("(prefers-color-scheme: dark)")?.matches;
    const colourMode = localStorage.getItem("colour_mode") as CBModes;

    setSettings("is_light", localTheme ? localTheme === "light" : systemSettingDark);
    setSettings("theme", localTheme || (systemSettingDark ? "dark" : "light"));
    setSettings("colour_mode", colourMode || "default");
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

  // TODO: Mobile detection...

  return (
    <>
      {/* Modals */}
      <SettingsModal showModal={showAccessModal()} title="Accessibility Settings" onOutsideClick={handleOutsideModal}>
        <span class="settingsHeader">Colour Accessibility</span>
        <span class="settingsDesc">Settings to help with various colour deficiencies and colour blindness.</span>

        <div class="colourBlindGrid">
          <div
            class="colourBlindContainer"
            classList={{ activeSetting: settings.colour_mode === "default" }}
            onclick={() => handleColourBlindMode("default")}
          >
            <div class="colourBlindInner">
              <div class="colourBlindTitle">Default</div>

              <div class="colourBlindPreview">
                <div class="colourBlindSide">
                  <div style="border: 1px solid #ce75cc;"></div>
                  <div style="border: 1px solid #ce75cc;"></div>
                  <div style="border: 1px solid #ce75cc;"></div>
                  <div style="border: 1px solid #ce75cc;"></div>
                </div>
                <div class="colourBlindMain">
                  <div class="colourBlindMainInner">
                    <div class="colourBlindBox" style="background-color: #34af9b;"></div>
                    <div class="colourBlindBox" style="background-color: #f0e442;"></div>
                  </div>
                  <div style="border: 2px solid #34af9b;"></div>
                  <div style="border: 2px solid #f0e442;"></div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="colourBlindContainer"
            classList={{ activeSetting: settings.colour_mode === "deuteranopia" }}
            onclick={() => handleColourBlindMode("deuteranopia")}
          >
            <div class="colourBlindInner">
              <div class="colourBlindTitle">Deuteranopia</div>

              <div class="colourBlindPreview">
                <div class="colourBlindSide">
                  <div style="border: 1px solid #6288d1;"></div>
                  <div style="border: 1px solid #6288d1;"></div>
                  <div style="border: 1px solid #6288d1;"></div>
                  <div style="border: 1px solid #6288d1;"></div>
                </div>
                <div class="colourBlindMain">
                  <div class="colourBlindMainInner">
                    <div class="colourBlindBox" style="background-color: #1585fd;"></div>
                    <div class="colourBlindBox" style="background-color: #d69a00;"></div>
                  </div>
                  <div style="border: 2px solid #1585fd;"></div>
                  <div style="border: 2px solid #d69a00;"></div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="colourBlindContainer"
            classList={{ activeSetting: settings.colour_mode === "protanopia" }}
            onclick={() => handleColourBlindMode("protanopia")}
          >
            <div class="colourBlindInner">
              <div class="colourBlindTitle">Protanopia</div>

              <div class="colourBlindPreview">
                <div class="colourBlindSide">
                  <div style="border: 1px solid #ce75cc;"></div>
                  <div style="border: 1px solid #ce75cc;"></div>
                  <div style="border: 1px solid #ce75cc;"></div>
                  <div style="border: 1px solid #ce75cc;"></div>
                </div>
                <div class="colourBlindMain">
                  <div class="colourBlindMainInner">
                    <div class="colourBlindBox" style="background-color: #1585fd;"></div>
                    <div class="colourBlindBox" style="background-color: #E1EC1B;"></div>
                  </div>
                  <div style="border: 2px solid #1585fd;"></div>
                  <div style="border: 2px solid #E1EC1B;"></div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="colourBlindContainer"
            classList={{ activeSetting: settings.colour_mode === "tritanopia" }}
            onclick={() => handleColourBlindMode("tritanopia")}
          >
            <div class="colourBlindInner">
              <div class="colourBlindTitle">Tritanopia</div>

              <div class="colourBlindPreview">
                <div class="colourBlindSide">
                  <div style="border: 1px solid #1585fd;"></div>
                  <div style="border: 1px solid #1585fd;"></div>
                  <div style="border: 1px solid #1585fd;"></div>
                  <div style="border: 1px solid #1585fd;"></div>
                </div>
                <div class="colourBlindMain">
                  <div class="colourBlindMainInner">
                    <div class="colourBlindBox" style="background-color: #1585fd;"></div>
                    <div class="colourBlindBox" style="background-color: #fa4549;"></div>
                  </div>
                  <div style="border: 2px solid #1585fd;"></div>
                  <div style="border: 2px solid #fa4549;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SettingsModal>

      <nav id="sidebar" classList={{ sideClosed: Boolean(asideClosed()) }}>
        <ul>
          <li class="sideHeader" classList={{ sideHeaderClosed: Boolean(asideClosed()) }}>
            <Switch>
              <Match when={!Boolean(asideClosed())}>
                <span class="logo">
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

          <li>
            <a href="/">
              <HomeSVG />
              <span classList={{ hide: hideText() }}>Home</span>
            </a>
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
                <li>
                  <span classList={{ hide: hideText() }}>Tab 1</span>
                </li>
                <li>
                  <span classList={{ hide: hideText() }}>Tab 2</span>
                </li>
                <li class="active">
                  <span classList={{ hide: hideText() }}>Tab 3</span>
                </li>
                <li>
                  <span classList={{ hide: hideText() }}>Tab 4</span>
                </li>
                <li>
                  <span classList={{ hide: hideText() }}>Tab 5</span>
                </li>
              </div>
            </ul>
          </li>

          {/* Actions Submenu */}
          {/* <li class="noBack" classList={{ active: settings.submenu === 2 }}>
            <span class="sideButton" on:click={(e) => handleSubMenu(2, e)}>
              <ActionsSVG />
              <span classList={{ hide: hideText() }}>Manage</span>
              <Switch>
                <Match when={Boolean(asideClosed())}>{null}</Match>
                <Match when={settings.submenu === 2}>
                  <ChevronDownSVG />
                </Match>
                <Match when={settings.submenu !== 2}>
                  <ChevronRightSVG />
                </Match>
              </Switch>
            </span>
            <ul class={settings.submenu === 2 ? "subMenu showMenu" : "subMenu"}>
              <div>
                <li>
                  <span classList={{ hide: hideText() }}>Tab 1</span>
                </li>
                <li>
                  <span classList={{ hide: hideText() }}>Tab 2</span>
                </li>
                <li class="active">
                  <span classList={{ hide: hideText() }}>Tab 3</span>
                </li>
                <li>
                  <span classList={{ hide: hideText() }}>Tab 4</span>
                </li>
                <li>
                  <span classList={{ hide: hideText() }}>Tab 5</span>
                </li>
              </div>
            </ul>
          </li> */}

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
