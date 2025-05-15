import { Suspense } from "solid-js";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";

import SideBar from "./components/sidebar";
import "./app.scss";


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
    <Router root={(props) => <Suspense><Layout>{props.children}</Layout></Suspense>}>
      <FileRoutes />
    </Router>
  );
}
