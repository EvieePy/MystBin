import { createEffect, onMount, Suspense } from "solid-js";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";

import SideBar from "./components/sidebar";
import "./css/app.scss";
import { MetaProvider } from "@solidjs/meta";
import { PasteProvider } from "./stores/paste";
import { SettingsProvider, useSettingsContext } from "./stores/settings";

const Layout = (props: { children: any; }) => {

  onMount(() => {
    const [, setState] = useSettingsContext();

    const ligatures = localStorage.getItem("ligatures");
    setState("ligatures", ligatures === "true");
  });

  return (
    <>
      <SideBar />
      {props.children}
    </>
  );
};

export default function App() {
  return (
    <MetaProvider>
      <script src="theme.js"></script>

      <SettingsProvider>
        <PasteProvider>
          <Router root={(props) => <Suspense><Layout>{props.children}</Layout></Suspense>}>
            <FileRoutes />
          </Router>
        </PasteProvider>
      </SettingsProvider>

    </MetaProvider>
  );
}
