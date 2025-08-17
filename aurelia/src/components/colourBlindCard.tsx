interface Props {
  box_one: string;
  box_two: string;
  line_one: string;
  line_two: string;
  border: string;
}

export default function ColourBlindCard(props: Props) {
  return (
    <div class="colourBlindInner">
      <div class="colourBlindTitle">Default</div>

      <div class="colourBlindPreview">
        <div class="colourBlindSide">
          <div style={`border: 1px solid ${props.border}`} />
          <div style={`border: 1px solid ${props.border}`} />
          <div style={`border: 1px solid ${props.border}`} />
          <div style={`border: 1px solid ${props.border}`} />
        </div>
        <div class="colourBlindMain">
          <div class="colourBlindMainInner">
            <div class="colourBlindBox" style={`background-color: ${props.box_one}`}></div>
            <div class="colourBlindBox" style={`background-color: ${props.box_two}`}></div>
          </div>
          <div style={`border: 2px solid ${props.line_one}`}></div>
          <div style={`border: 2px solid ${props.line_two}`}></div>
        </div>
      </div>
    </div>
  );
}
