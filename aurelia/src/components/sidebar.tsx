import { createSignal, createEffect, Match, Switch, Suspense, createResource, onMount } from "solid-js";
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

const HomeSvg = <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z" /></svg>
const FileSvg = <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520h200L520-800v200Z" /></svg>


const fetchApiVersion = async () => {
    let resp: Response;

    try {
        resp = await fetch("http://localhost:8000/version");
    } catch (error) {
        return "Unknown"
    }

    if (!resp.ok) { return "Unknown" }

    const data: VersionResponse = await resp.json();
    return data["version"];
}


export default function SideBar() {
    const [lightModeToggle, setLightModeToggle] = createSignal(false);

    const [showSubMenu, setSubMenu] = createSignal(0);
    const [showSideBar, setShowSideBar] = createSignal(false);
    const [hideText, setHideText] = createSignal(false);
    const [apiVersion] = createResource(fetchApiVersion);

    onMount(() => {
        const localTheme = localStorage.getItem("theme");
        const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)")?.matches ? false : true;
        setLightModeToggle(localTheme ? localTheme === "light" : systemSettingDark);
    });

    createEffect(() => {
        if (!showSideBar()) {
            setTimeout(() => setHideText(true), 500);
        } else {
            setHideText(false);
        }
    });

    const handleSubMenu = (data: number, e: MouseEvent) => {
        e.preventDefault();

        if (data === showSubMenu()) {
            setSubMenu(0);
            return;
        }

        setShowSideBar(true);
        setSubMenu(data);
    }

    const handleShowSide = () => {
        if (showSideBar() === true) {
            setSubMenu(0);
        }

        setShowSideBar(!showSideBar());
    }

    const handleLightModeClick = (e: MouseEvent) => {
        e.preventDefault();

        const flipped = !lightModeToggle();
        const theme = flipped ? "light" : "dark";

        localStorage.setItem("theme", theme);
        document.querySelector("html")!.setAttribute("data-theme", theme);
        setLightModeToggle(flipped);
    }

    // TODO: Mobile detection...


    return (
        <nav id="sidebar" classList={{ sideClosed: !showSideBar() }}>
            <ul>
                <li class="sideHeader" classList={{ sideHeaderClosed: !showSideBar() }}>
                    <Switch>
                        <Match when={showSideBar()}>
                            <span class="logo">
                                <LogoSVG /> MystBin
                            </span>
                        </Match>
                        <Match when={!showSideBar()}>
                            <span></span>
                        </Match>
                    </Switch>
                    <span class="sideClose" on:click={handleShowSide}><HamburgerMenuSVG /></span>
                </li>

                <li>
                    <a href="/">
                        {HomeSvg}
                        <span classList={{ hide: hideText() }}>Home</span>
                    </a>
                </li>

                {/* Files Submenu */}
                <li class="noBack" classList={{ active: showSubMenu() === 1 }}>
                    <span class="sideButton" on:click={(e) => handleSubMenu(1, e)}>
                        {FileSvg}
                        <span classList={{ hide: hideText() }}>Files</span>
                        <Switch>
                            <Match when={!showSideBar()}>{null}</Match>
                            <Match when={showSubMenu() === 1}><ChevronDownSVG /></Match>
                            <Match when={showSubMenu() !== 1}><ChevronRightSVG /></Match>
                        </Switch>
                    </span>
                    <ul class={showSubMenu() === 1 ? "subMenu showMenu" : "subMenu"}>
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
                <li class="noBack" classList={{ active: showSubMenu() === 2 }}>
                    <span class="sideButton" on:click={(e) => handleSubMenu(2, e)}>
                        <ActionsSVG />
                        <span classList={{ hide: hideText() }}>Manage</span>
                        <Switch>
                            <Match when={!showSideBar()}>{null}</Match>
                            <Match when={showSubMenu() === 2}><ChevronDownSVG /></Match>
                            <Match when={showSubMenu() !== 2}><ChevronRightSVG /></Match>
                        </Switch>
                    </span>
                    <ul class={showSubMenu() === 2 ? "subMenu showMenu" : "subMenu"}>
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

                {/* Settings Submenu */}
                <li class="noBack" classList={{ active: showSubMenu() === 3 }}>
                    <span class="sideButton" on:click={(e) => handleSubMenu(3, e)}>
                        <SettingsSVG />
                        <span classList={{ hide: hideText() }}>Settings</span>
                        <Switch>
                            <Match when={!showSideBar()}>{null}</Match>
                            <Match when={showSubMenu() === 3}><ChevronDownSVG /></Match>
                            <Match when={showSubMenu() !== 3}><ChevronRightSVG /></Match>
                        </Switch>
                    </span>
                    <ul class={showSubMenu() === 3 ? "subMenu showMenu" : "subMenu"}>
                        <div>
                            <li onclick={handleLightModeClick}>
                                <span classList={{ hide: hideText() }}><span>Light Theme </span></span>
                                <ToggleSwitch checked={lightModeToggle()} />
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
            </ul>

            {/* Sidebar Meta Data */}
            <div class="meta">
                <Switch>
                    <Match when={showSideBar()}>
                        <div class="socials">
                            <a href="https://discord.gg/RAKc3HF" title="Discord"><DiscordSVG /></a>
                            <a href="https://github.com/PythonistaGuild/mystbin" title="GitHub"><GitHubSVG /></a>
                            <a href="/" title="Documentation"><MenuBookSVG /></a>
                            <a href="/" title="Install on VSCode"><VSCodeSVG /></a>
                        </div>
                    </Match>
                    <Match when={!showSideBar()}>
                        <div class="socials">
                            <a href="/" title="Documentation"><MenuBookSVG /></a>
                        </div>
                    </Match>
                </Switch>
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
            </div>
        </nav>
    )
}