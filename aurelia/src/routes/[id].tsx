import { redirect, useNavigate, useParams } from "@solidjs/router";
import { createResource } from "solid-js";

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

  return <main>{paste()?.id}</main>;
}
