import { createSignal, createEffect, Match, Switch, Suspense, createResource, onMount, on } from "solid-js";
import ChevronRightSVG from "~/svg/ChevronRight";
import ChevronDownSVG from "~/svg/ChevronDown";
import HamburgerMenuSVG from "~/svg/HamburgerMenu";
import DiscordSVG from "~/svg/Discord";
import GitHubSVG from "~/svg/GitHub";
import MenuBookSVG from "~/svg/MenuBook";
import VSCodeSVG from "~/svg/VSCode";
import ActionsSVG from "~/svg/Actions";
import SettingsSVG from "~/svg/Settings";
import LogoSVG from "~/svg/Logo";
import ToggleSwitch from "./toggle";
import VerticalEllipsisSVG from "~/svg/VerticalEllipsis";
import SettingsModal from "./settingsModal";
import { useSettingsContext } from "~/stores/settings";
import HomeSVG from "~/svg/Home";
import FileSVG from "~/svg/File";

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
  const [hideText, setHideText] = createSignal(true);

  const [showAccessModal, setshowAccessModal] = createSignal(false);
  const [apiVersion] = createResource(fetchApiVersion);

  onMount(() => {
    const localTheme = localStorage.getItem("theme") as "light" | "dark";
    const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)")?.matches ? false : true;
    const side_closed = localStorage.getItem("side_closed") === "true";

    setSettings("is_light", localTheme ? localTheme === "light" : systemSettingDark);
    setSettings("theme", localTheme ? localTheme : systemSettingDark === true ? "dark" : "light");
    setSettings("side_closed", side_closed);
  });

  let hideTextTimeout: ReturnType<typeof setTimeout> | null = null;

  createEffect(() => {
    if (hideTextTimeout) {
      clearTimeout(hideTextTimeout);
      hideTextTimeout = null;
    }
    if (settings.side_closed) {
      hideTextTimeout = setTimeout(() => setHideText(true), 500);
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

    setSettings("side_closed", false);
    setSettings("submenu", data);
    localStorage.setItem("submenu", String(data));
  };

  const handleShowSide = () => {
    if (settings.side_closed === false) {
      setSettings("submenu", 0);
      localStorage.setItem("submenu", "0");
    }

    localStorage.setItem("side_closed", String(!settings.side_closed));
    setSettings("side_closed", !settings.side_closed);
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
  // TODO: Mobile detection...

  return (
    <>
      {/* Modals */}
      <SettingsModal showModal={showAccessModal()} title="Accessibility Settings" onOutsideClick={handleOutsideModal} />

      <nav
        id="sidebar"
        classList={{
          sideClosed: settings.side_closed,
        }}
      >
        <ul>
          <li
            class="sideHeader"
            classList={{
              sideHeaderClosed: settings.side_closed,
            }}
          >
            <Switch>
              <Match when={!settings.side_closed}>
                <span class="logo">
                  <LogoSVG /> MystBin
                </span>
              </Match>
              <Match when={settings.side_closed}>
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
              <span
                classList={{
                  hide: hideText(),
                }}
              >
                Home
              </span>
            </a>
          </li>

          {/* Files Submenu */}
          <li
            class="noBack"
            classList={{
              active: settings.submenu === 1,
            }}
          >
            <span class="sideButton" on:click={(e) => handleSubMenu(1, e)}>
              <FileSVG />
              <span
                classList={{
                  hide: hideText(),
                }}
              >
                Files
              </span>
              <Switch>
                <Match when={settings.side_closed}>{null}</Match>
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
                  <span
                    classList={{
                      hide: hideText(),
                    }}
                  >
                    Tab 1
                  </span>
                </li>
                <li>
                  <span
                    classList={{
                      hide: hideText(),
                    }}
                  >
                    Tab 2
                  </span>
                </li>
                <li class="active">
                  <span
                    classList={{
                      hide: hideText(),
                    }}
                  >
                    Tab 3
                  </span>
                </li>
                <li>
                  <span
                    classList={{
                      hide: hideText(),
                    }}
                  >
                    Tab 4
                  </span>
                </li>
                <li>
                  <span
                    classList={{
                      hide: hideText(),
                    }}
                  >
                    Tab 5
                  </span>
                </li>
              </div>
            </ul>
          </li>

          {/* Actions Submenu */}
          <li
            class="noBack"
            classList={{
              active: settings.submenu === 2,
            }}
          >
            <span class="sideButton" on:click={(e) => handleSubMenu(2, e)}>
              <ActionsSVG />
              <span
                classList={{
                  hide: hideText(),
                }}
              >
                Manage
              </span>
              <Switch>
                <Match when={settings.side_closed}>{null}</Match>
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
                  <span
                    classList={{
                      hide: hideText(),
                    }}
                  >
                    Tab 1
                  </span>
                </li>
                <li>
                  <span
                    classList={{
                      hide: hideText(),
                    }}
                  >
                    Tab 2
                  </span>
                </li>
                <li class="active">
                  <span
                    classList={{
                      hide: hideText(),
                    }}
                  >
                    Tab 3
                  </span>
                </li>
                <li>
                  <span
                    classList={{
                      hide: hideText(),
                    }}
                  >
                    Tab 4
                  </span>
                </li>
                <li>
                  <span
                    classList={{
                      hide: hideText(),
                    }}
                  >
                    Tab 5
                  </span>
                </li>
              </div>
            </ul>
          </li>

          {/* Settings Submenu */}
          <li
            class="noBack"
            classList={{
              active: settings.submenu === 3,
            }}
          >
            <span class="sideButton" on:click={(e) => handleSubMenu(3, e)}>
              <SettingsSVG />
              <span
                classList={{
                  hide: hideText(),
                }}
              >
                Settings
              </span>
              <Switch>
                <Match when={settings.side_closed}>{null}</Match>
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
                <li onclick={handleLightModeClick}>
                  <span
                    classList={{
                      hide: hideText(),
                    }}
                  >
                    <span>Light Theme </span>
                  </span>
                  <ToggleSwitch checked={settings.is_light} />
                </li>
                <li onclick={handleLigaturesClick}>
                  <span
                    classList={{
                      hide: hideText(),
                    }}
                  >
                    <span>Font Ligatures </span>
                  </span>
                  <ToggleSwitch checked={settings.ligatures} />
                </li>
                <li onclick={handleLineNumClick}>
                  <span
                    classList={{
                      hide: hideText(),
                    }}
                  >
                    <span>Show Line Numbers </span>
                  </span>
                  <ToggleSwitch checked={settings.line_numbers} />
                </li>
                <li onclick={handleWordWrapClick}>
                  <span
                    classList={{
                      hide: hideText(),
                    }}
                  >
                    <span>Word Wrap </span>
                  </span>
                  <ToggleSwitch checked={settings.word_wrap} />
                </li>
                <li onclick={() => setshowAccessModal(true)}>
                  <span
                    classList={{
                      hide: hideText(),
                    }}
                  >
                    Accessibility Menu
                  </span>
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
            <Match when={!settings.side_closed}>
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
            <Match when={settings.side_closed}>
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
