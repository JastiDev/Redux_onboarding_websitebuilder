import React, {useState} from "react";
import {SketchPicker} from "react-color";
import "./ColorPicker.scss";

function ColorPicker({value, onChange}) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="color-picker">
      <div className="swatch" onClick={() => setShowPicker(!showPicker)}>
        <div
          className="color"
          style={{
            background: `rgba(${value.r}, ${value.g}, ${value.b}, ${value.a})`,
          }}
        />
      </div>
      {showPicker ? (
        <div className="popover">
          <div className="cover" onClick={() => setShowPicker(false)} />
          <SketchPicker color={value} onChange={onChange} />
        </div>
      ) : null}
    </div>
  );
}

export default ColorPicker;
