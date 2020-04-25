import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import {Input} from "reactstrap";

import {websiteCoverSelector, updateWebsiteCover} from "../modules/artist";

const mapState = state => ({
  websiteCover: websiteCoverSelector(state),
});

const mapDispatch = {
  updateWebsiteCover,
};

function BandInfo({websiteCover, updateWebsiteCover}) {
  const [state, setState] = useState({
    bio: "",
    general_manager: "",
    booking_agent: "",
    press: "",
  });

  useEffect(() => {
    setState({
      bio: websiteCover.bio || "",
      general_manager: websiteCover.general_manager || "",
      booking_agent: websiteCover.booking_agent || "",
      press: websiteCover.press || "",
    });
  }, [websiteCover]);

  function handleChange(e) {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSave(e) {
    const key = e.target.name;
    const existingValue = websiteCover[key] || "";

    if (existingValue !== state[key]) {
      await updateWebsiteCover({
        id: websiteCover.id,
        webbuilder_id: websiteCover.webbuilder_id,
        [key]: state[key],
      });
    }
  }

  return (
    <div className="artist-item bandinfo">
      <div className="item-content">
        <div className="artist-title">Artist/Band Bio</div>
        <Input
          type="textarea"
          style={{
            fontSize: "1rem",
            borderRadius: 4,
            marginBottom: "2em",
          }}
          cols={30}
          rows={8}
          name="bio"
          value={state.bio}
          onChange={handleChange}
          onBlur={handleSave}
        />
        <div className="d-flex-row">
          <div className="input-label">Management:</div>
          <Input
            className="input-box"
            name="general_manager"
            value={state.general_manager}
            onChange={handleChange}
            onBlur={handleSave}
          />
        </div>
        <div className="d-flex-row">
          <div className="input-label">Booking Agent:</div>
          <Input
            className="input-box"
            name="booking_agent"
            value={state.booking_agent}
            onChange={handleChange}
            onBlur={handleSave}
          />
        </div>
        <div className="d-flex-row">
          <div className="input-label">Press:</div>
          <Input
            className="input-box"
            name="press"
            value={state.press}
            onChange={handleChange}
            onBlur={handleSave}
          />
        </div>
      </div>
    </div>
  );
}

export default connect(
  mapState,
  mapDispatch
)(BandInfo);
