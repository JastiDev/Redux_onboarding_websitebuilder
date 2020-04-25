import React, {useEffect, useState, useCallback} from "react";
import {connect} from "react-redux";
import {Button, Input} from "reactstrap";

import {
  selectedArtistSelector,
  webBuilderSelector,
  websiteCoverSelector,
  getWebBuilder,
  getWebsiteCover,
  updateWebBuilder,
  updateWebsiteCover,
} from "../../modules/artist";
import {ConfirmationPopup, ColorPicker} from "../../components";
import Fonts from "../../constants/fonts";

import mailchimp from "../../assets/img/icons/mailchimp.png";
import sumo from "../../assets/img/icons/sumo.png";

const mapStateToProps = state => ({
  selectedArtist: selectedArtistSelector(state),
  webBuilder: webBuilderSelector(state),
  websiteCover: websiteCoverSelector(state),
});

const mapDispatch = {
  getWebBuilder,
  getWebsiteCover,
  updateWebBuilder,
  updateWebsiteCover,
};

const defaultDarkBackgroundColor = {r: 30, g: 30, b: 30, a: 1};
const defaultLightBackgroundColor = {r: 255, g: 255, b: 255, a: 1};
const defaultDarkForegroundColor = {r: 30, g: 30, b: 30, a: 1};
const defaultLightForegroundColor = {r: 255, g: 255, b: 255, a: 1};

const Integration = ({
  history,
  selectedArtist,
  webBuilder,
  websiteCover,
  getWebBuilder,
  getWebsiteCover,
  updateWebBuilder,
  updateWebsiteCover,
}) => {
  const [confirmationPopup, setConfirmationPopup] = useState({
    isOpen: false,
    message: "",
  });
  const [state, setState] = useState({
    sumo_script: "",
    mailchimp_audience_id: "",
    mailchimp_api_key: "",
    font_family: Fonts[0].value,
    dark_background_color: defaultDarkBackgroundColor,
    light_background_color: defaultLightBackgroundColor,
    dark_foreground_color: defaultDarkForegroundColor,
    light_foreground_color: defaultLightForegroundColor,
  });

  useEffect(() => {
    if (!webBuilder.id) {
      getWebBuilder(selectedArtist.id);
    }
  }, [webBuilder, getWebBuilder, selectedArtist]);

  useEffect(() => {
    if (webBuilder.id && !websiteCover.id) {
      getWebsiteCover(webBuilder.id);
    }
  }, [getWebsiteCover, webBuilder, websiteCover]);

  useEffect(() => {
    const {
      font_family,
      dark_background_color,
      light_background_color,
      dark_foreground_color,
      light_foreground_color,
    } = websiteCover;

    setState({
      sumo_script: webBuilder.sumo_script || "",
      mailchimp_api_key: webBuilder.mailchimp_api_key || "",
      mailchimp_audience_id: webBuilder.mailchimp_audience_id || "",
      font_family: font_family || Fonts[0].value,
      dark_background_color: dark_background_color
        ? JSON.parse(dark_background_color)
        : defaultDarkBackgroundColor,
      light_background_color: light_background_color
        ? JSON.parse(light_background_color)
        : defaultLightBackgroundColor,
      dark_foreground_color: dark_foreground_color
        ? JSON.parse(dark_foreground_color)
        : defaultDarkForegroundColor,
      light_foreground_color: light_foreground_color
        ? JSON.parse(light_foreground_color)
        : defaultLightForegroundColor,
    });
  }, [webBuilder, websiteCover]);

  const handleChangeInput = useCallback(
    e => {
      setState({
        ...state,
        [e.target.name]: e.target.value,
      });
    },
    [state]
  );

  const handleBlurSumoScript = useCallback(() => {
    const existingValue = webBuilder.sumo_script || "";
    if (existingValue !== state.sumo_script) {
      updateWebBuilder({
        id: webBuilder.id,
        sumo_script: state.sumo_script,
      });
    }
  }, [state.sumo_script, updateWebBuilder, webBuilder]);

  const handleSaveMailchimp = useCallback(
    async e => {
      const key = e.target.name;
      const existingValue = webBuilder[key] || "";
      if (existingValue !== state[key]) {
        await updateWebBuilder({
          id: webBuilder.id,
          [key]: state[key],
        });
      }
    },
    [state, updateWebBuilder, webBuilder]
  );

  const handleChangeFont = useCallback(
    e => {
      const value = e.target.value;
      const font = Fonts.find(font => font.value === value);

      const fontExt = font.type === "opentype" ? "otf" : "ttf";
      var newStyle = document.createElement("style");
      newStyle.appendChild(
        document.createTextNode(`
        @font-face {
          font-family: ${font.value};
          font-weight: normal;
          src: url("https://s3.amazonaws.com/cdn-fonts-storage.jamfeed.com/${font.value}/${font.value}-Regular.${fontExt}") format("${font.type}");
        }
      `)
      );
      document.head.appendChild(newStyle);

      updateWebsiteCover({
        ...websiteCover,
        font_family: value,
        font_type: font.type,
      });
    },
    [updateWebsiteCover, websiteCover]
  );

  const handleChangeColor = useCallback(
    type => color => {
      setState({
        ...state,
        [`${type}_color`]: color.rgb,
      });
      updateWebsiteCover({
        ...websiteCover,
        [`${type}_color`]: JSON.stringify(color.rgb),
      });
    },
    [state, updateWebsiteCover, websiteCover]
  );

  return (
    <div className="content-body" id="integration">
      <div className="title mb-5">
        Add your MailChimp{" "}
        <a
          href="https://mailchimp.com/help/about-api-keys/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Audience ID
        </a>{" "}
        and{" "}
        <a
          href="https://mailchimp.com/help/find-audience-id/"
          target="_blank"
          rel="noopener noreferrer"
        >
          API Key
        </a>{" "}
        to sync with your website
      </div>
      <div className="d-flex justify-content-between align-items-center flex-wrap flex-md-nowrap key-container mb-5">
        <img src={mailchimp} alt="" width="90px" className="mr-5"></img>
        <Input
          type="text"
          className="m-4 flex-grow-1 mailchimp-audience-id"
          placeholder="Audience ID"
          name="mailchimp_audience_id"
          value={state.mailchimp_audience_id}
          onChange={handleChangeInput}
          onBlur={handleSaveMailchimp}
        />
        <Input
          type="text"
          className="m-4 flex-grow-1 mailchimp-api-key"
          placeholder="API KEY"
          name="mailchimp_api_key"
          value={state.mailchimp_api_key}
          onChange={handleChangeInput}
          onBlur={handleSaveMailchimp}
        />
      </div>
      <div className="title">
        Copy and paste your SUMO code to add the email capture to your website
      </div>
      <div className="d-flex align-items-center key-container mb-5">
        <div className="d-flex justify-content-center align-items-center flex-column mr-5 ">
          <img src={sumo} alt=""></img>
          <div className="title mb-0">SUMO</div>
        </div>
        <Input
          type="textarea"
          className="flex-grow-1 sumo-script"
          rows={2}
          value={state.sumo_script}
          name="sumo_script"
          onChange={handleChangeInput}
          onBlur={handleBlurSumoScript}
        />
      </div>
      <div className="d-flex flex-wrap flex-md-nowrap align-items-center key-container mb-5">
        <div
          className="title mb-0 text-nowrap mr-3"
          style={{
            fontFamily: state.font_family,
          }}
        >
          Select the font for your website
        </div>
        <select
          name="select"
          id="select"
          className="form-control"
          value={state.font_family}
          onChange={handleChangeFont}
        >
          {Fonts.map(font => (
            <option key={font.value} value={font.value} style={font.style}>
              {font.label}
            </option>
          ))}
        </select>
      </div>
      <div className="d-flex flex-wrap flex-md-nowrap align-items-center key-container mb-5">
        <div className="title mb-0 text-nowrap mr-3">
          Select the dark background color
        </div>
        <ColorPicker
          value={state.dark_background_color}
          onChange={handleChangeColor("dark_background")}
        />
      </div>
      <div className="d-flex flex-wrap flex-md-nowrap align-items-center key-container mb-5">
        <div className="title mb-0 text-nowrap mr-3">
          Select the light background color
        </div>
        <ColorPicker
          value={state.light_background_color}
          onChange={handleChangeColor("light_background")}
        />
      </div>
      <div className="d-flex flex-wrap flex-md-nowrap align-items-center key-container mb-5">
        <div className="title mb-0 text-nowrap mr-3">
          Select the dark theme font color"
        </div>
        <ColorPicker
          value={state.dark_foreground_color}
          onChange={handleChangeColor("dark_foreground")}
        />
      </div>
      <div className="d-flex flex-wrap flex-md-nowrap align-items-center key-container mb-5">
        <div className="title mb-0 text-nowrap mr-3">
          Select the light theme font color
        </div>
        <ColorPicker
          value={state.light_foreground_color}
          onChange={handleChangeColor("light_foreground")}
        />
      </div>
      <div className="d-flex-row continu-btn">
        <Button
          color="success"
          outline
          className="btn-pill big-btn height-35px m-2"
          onClick={() => history.push("/template")}
        >
          Back
        </Button>
        <Button
          color="success"
          className="btn-pill big-btn height-35px m-2"
          onClick={() => history.push("/subscribe")}
        >
          Continue
        </Button>
      </div>
      <ConfirmationPopup
        open={confirmationPopup.isOpen}
        onRequestClose={() => {
          setConfirmationPopup({isOpen: false});
        }}
        message={confirmationPopup.message}
      />
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatch
)(Integration);
