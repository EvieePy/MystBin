import { redirect, useNavigate, useParams } from "@solidjs/router";
import { createResource, Show } from "solid-js";
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

dayjs.extend(relativeTime);

const Editor = clientOnly(() => import("~/components/editor"));

export default function PastePage() {
  const navigate = useNavigate();
  const params = useParams();

  const [paste] = createResource(async () => {
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

  const getRT = () => {
    const pasteC = paste();
    if (!pasteC) {
      return "...";
    }

    const created = dayjs(pasteC.created_at);
    return dayjs().to(created);
  };

  const getExpRT = () => {
    const pasteC = paste();
    if (!pasteC) {
      return;
    }
    if (!pasteC.expires_at) {
      return;
    }

    const expiry = dayjs(pasteC.expires_at);
    return dayjs().to(expiry);
  };

  const getRemainingViews = () => {
    const pasteC = paste();
    if (!pasteC) {
      return;
    }
    if (!pasteC.max_views) {
      return;
    }

    return pasteC.max_views - pasteC.views;
  };

  return (
    <main>
      <div class="header">
        <div class="metaSection">
          <span class="largeText">
            <a href={`/${paste()?.id}`}>{paste()?.id}</a>
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
      <Editor initialValue={String(paste()?.files[0].content)} readOnly={true} />
    </main>
  );
}
