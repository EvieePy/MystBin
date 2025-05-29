import { Suspense } from "solid-js";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";

import SideBar from "./components/sidebar";
import "./css/app.scss";
import { MetaProvider } from "@solidjs/meta";

const Layout = (props: { children: any; }) => {
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

      <Router root={(props) => <Suspense><Layout>{props.children}</Layout></Suspense>}>
        <FileRoutes />
      </Router>
    </MetaProvider>

  );
}
