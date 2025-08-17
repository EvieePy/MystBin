import { createOptions, Select } from "@thisbeyond/solid-select";
import localforage from "localforage";
import { useSettingsContext } from "~/stores/settings";
import { FontSizeT, FontT } from "~/types/utils";

interface Props {
  size_selector: boolean;
}

export default function FontSelector(props: Props) {
  const [settings, setSettings] = useSettingsContext();
  const FONT_SIZES = ["default", "small", "large"];
  const FONTS = ["jetbrains", "fira", "ibmplex", "notosans", "roboto", "sourcecodepro"];

  const format = (value: string, type: any, meta: any) => {
    if (props.size_selector) {
      return (
        <div class="fontOpt">
          <span class={`fontS-${value}`}>{value}</span>
        </div>
      );
    }

    return (
      <div class="fontOpt">
        <span class={`fontT-${value}`}>{value}</span>
      </div>
    );
  };

  const loadOpts = createOptions(props.size_selector ? FONT_SIZES : FONTS, {
    format,
    extractText: (value: string) => value
  });

  const onUpdate = async (value: FontSizeT | FontT) => {
    if (props.size_selector) {
      await localforage.setItem("font_size", value);
      // @ts-ignore
      setSettings("font_size", value);
    } else {
      await localforage.setItem("font", value);
      // @ts-ignore
      setSettings("font", value);
    }
  };

  return (
    <Select
      class={`langSelect ${props.size_selector ? "fontSelect" : ""}`}
      {...loadOpts}
      onChange={onUpdate}
      initialValue={props.size_selector ? settings.font_size : settings.font}
    ></Select>
  );
}
