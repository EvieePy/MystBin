import ToggleOneSVG from "~/svg/ToggleOne";
import "../css/toggle.scss";
import ToggleTwoSVG from "~/svg/ToggleTwo";

interface Props {
  checked: boolean;
}

export default function ToggleSwitch(props: Props) {
  const checked = () => props.checked;

  return (
    <label class="switch">
      <input type="checkbox" checked={checked()} />

      <div class="slider">
        <div class="circle">
          <ToggleOneSVG />
          <ToggleTwoSVG />
        </div>
      </div>
    </label>
  );
}
