import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import {Row, Col, Input, Button} from "reactstrap";

import {
  selectedArtistSelector,
  webBuilderSelector,
  getWebBuilder,
  createWebBuilder,
  getSocialData,
  addSocialUrl,
  updateSocialUrl,
} from "../../modules/artist";

import icons from "../../constants/svgs";
import {TARGET_SOCIAL_PLATFORMS} from "../../constants/artist";

const mapStateToProps = state => ({
  selectedArtist: selectedArtistSelector(state),
  webBuilder: webBuilderSelector(state),
});

const mapDispatch = {
  getWebBuilder,
  createWebBuilder,
  getSocialData,
  addSocialUrl,
  updateSocialUrl,
};

const ConfirmAccounts = ({
  history,
  selectedArtist,
  webBuilder,
  getWebBuilder,
  createWebBuilder,
  getSocialData,
  addSocialUrl,
  updateSocialUrl,
}) => {
  const [platforms, setPlatforms] = useState([]);

  // Create a web builder if that doesn't exist
  useEffect(() => {
    async function asyncFunc() {
      const {
        value: {data},
      } = await getWebBuilder(selectedArtist.id);

      if (!data.id) {
        createWebBuilder(selectedArtist.id);
      }
    }

    if (!webBuilder.id) {
      asyncFunc();
    }
  }, [createWebBuilder, getWebBuilder, selectedArtist, webBuilder.id]);

  useEffect(() => {
    async function asyncFunc() {
      const {
        value: {data},
      } = await getSocialData(webBuilder.id);

      const {dataInMB, dataInDB} = data;
      const indexedDataInDB = dataInDB.reduce((m, r) => {
        m[r.type] = r;
        return m;
      }, {});

      const temp = TARGET_SOCIAL_PLATFORMS.map(platform => {
        const datum = indexedDataInDB[platform.type] || {
          url: dataInMB[platform.type] || "",
        };

        return {
          ...platform,
          url: datum.url,
          datum,
        };
      });

      setPlatforms(temp);
    }

    if (webBuilder.id) {
      asyncFunc();
    }
  }, [webBuilder, getSocialData]);

  function handleChange(index) {
    return evt => {
      const newValue = platforms.map((platform, loopIndex) =>
        loopIndex !== index
          ? platform
          : {
              ...platform,
              url: evt.target.value,
            }
      );
      setPlatforms(newValue);
    };
  }

  function handleBlur(index) {
    return async evt => {
      const url = evt.target.value;
      const platform = platforms[index];
      if (platform.datum.id) {
        if (platform.datum.url !== url) {
          updateSocialUrl({...platform.datum, url});
        }
      } else if (url) {
        const {
          value: {data},
        } = await addSocialUrl(webBuilder.id, platform.type, url);

        const newValue = platforms.map(platform =>
          platform.type !== data.type
            ? platform
            : {
                ...platform,
                url: data.url,
                datum: data,
              }
        );

        setPlatforms(newValue);
      }
    };
  }

  function handleSubmitSocialLinks() {
    history.push("/template");
  }

  return (
    <div className="content-body">
      <div className="title">
        Please confirm your streaming, social, and concerts URLs
      </div>
      <Row className="social-links">
        {platforms.map((platform, index) => {
          return (
            <Col md="6" key={index}>
              <div className="d-flex-row">
                <div className="social-title">{platform.label}</div>
                {platform.url ? (
                  <a href={platform.url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={icons[platform.icon]}
                      alt={platform.label}
                      className="social-icon"
                    ></img>
                  </a>
                ) : (
                  // eslint-disable-next-line jsx-a11y/anchor-is-valid
                  <a href="#">
                    <img src={icons[platform.icon]} alt={platform.label}></img>
                  </a>
                )}
                <Input
                  className="social-url"
                  placeholder="Copy and paste URL here"
                  onChange={handleChange(index)}
                  onBlur={handleBlur(index)}
                  value={platform.url}
                />
              </div>
            </Col>
          );
        })}
      </Row>
      <div className="d-flex-row continu-btn flex-wrap">
        <Button
          color="success"
          outline
          className="btn-pill big-btn height-35px m-2"
          onClick={() => history.push("/")}
        >
          Back
        </Button>
        <Button
          color="success"
          className="btn-pill big-btn  height-35px m-2"
          onClick={handleSubmitSocialLinks}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatch
)(ConfirmAccounts);
