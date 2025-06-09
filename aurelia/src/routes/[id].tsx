import { redirect, useNavigate, useParams } from "@solidjs/router";
import { createEffect, createResource, Show } from "solid-js";
import { clientOnly } from "@solidjs/start";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ReportSVG from "~/svg/Report";
import ShareSVG from "~/svg/Share";
import DownloadSVG from "~/svg/Download";
import RawSVG from "~/svg/Raw";
import TimeSVG from "~/svg/Time";
import HourglassSVG from "~/svg/Hourglass";
import EyeSVG from "~/svg/Eye";
import { PasteRStoreT, usePasteContext } from "~/stores/paste";
import { useSettingsContext } from "~/stores/settings";

dayjs.extend(relativeTime);

const Editor = clientOnly(() => import("~/components/editor"));

export default function PastePage() {
  const navigate = useNavigate();
  const params = useParams();
  const [paste, setPaste] = usePasteContext() as PasteRStoreT;
  const [settings, setSettings] = useSettingsContext();

  const [pasteR] = createResource(async () => {
    let resp: Response;

    try {
      resp = await fetch(`http://localhost:8000/pastes/${params.id}`);
    } catch (error) {
      throw redirect(`/error?id=${params.id}&status=500`);
    }

    if (resp.ok) {
      const data: PasteResponse = await resp.json();
      return data;
    }

    if (resp.status === 401) {
      navigate(`/authenticate/${params.id}`);
    } else if (resp.status === 404) {
      navigate("/404");
    } else {
      navigate(`/error?id=${params.id}&status=${resp.status}`);
    }
  });

  createEffect(() => {
    if (!pasteR()) {
      return;
    }

    // @ts-ignore
    setPaste(pasteR());
  });

  const getRT = () => {
    if (!paste) {
      return "...";
    }

    const created = dayjs(paste.created_at);
    return dayjs().to(created);
  };

  const getExpRT = () => {
    if (!paste) {
      return;
    }
    if (!paste.expires_at) {
      return;
    }

    const expiry = dayjs(paste.expires_at);
    return dayjs().to(expiry);
  };

  const getRemainingViews = () => {
    if (!paste) {
      return;
    }
    if (!paste.max_views) {
      return;
    }

    return paste.max_views - paste.views;
  };

  return (
    <main>
      <div class="header">
        <div class="metaSection">
          <span class="largeText">
            <a href={`/${paste.id}`}>{paste.id}</a>
          </span>
          <div class="metaButtons">
            <span class="metaButton">
              <RawSVG />
              raw
            </span>
            <span class="metaButton">
              <ShareSVG />
              share
            </span>
            <span class="metaButton">
              <DownloadSVG />
              download
            </span>
            <span class="metaButton report">
              <ReportSVG />
              report
            </span>
          </div>
        </div>

        <div class="headerSection">
          <span class="smallText">
            <TimeSVG />
            Created {getRT()}
          </span>
          <Show when={getExpRT()}>
            <span class="smallText">
              <HourglassSVG />
              Expires {getExpRT()}
            </span>
          </Show>
          <Show when={getRemainingViews()}>
            <span class="smallText">
              <EyeSVG />
              {getRemainingViews()} views remain
            </span>
          </Show>
        </div>
      </div>
      <Editor
        index={settings.current_file}
        initialValue={String(paste.files[settings.current_file].content)}
        readOnly={true}
      />
    </main>
  );
}
