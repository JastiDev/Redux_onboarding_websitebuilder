import React from "react";
import {connect} from "react-redux";
import {Button} from "reactstrap";
import _ from "lodash";

import {PLATFORMS_TO_SYNC} from "../../constants/artist";
import icons from "../../constants/svgs";

function SyncAccounts({movePage, artist}) {
  return (
    <div className="content-body">
      <div className="title">
        Login to your accounts to sync live updates to your app and website
      </div>
      <div className="sync-links">
        {PLATFORMS_TO_SYNC.map((platform, index) => {
          const isSynced = _.get(artist, `syncedSocialPlatforms.${platform.value}`);
          return (
            <div className="sync-link" key={index}>
              <img src={icons[platform.icon]} alt={platform.label}></img>
              <div className="sync-title">{platform.label}</div>
              <Button
                color={!isSynced ? "success" : "dark"}
                outline={!isSynced ? false : true}
                className="btn-pill sync-btn"
                href={`${process.env.REACT_APP_API_BASE_URL}/auth/${platform.value}`}
              >
                {isSynced ? "Account Synced" : "Sync Account"}
              </Button>
            </div>
          );
        })}
      </div>
      <div className="d-flex-row continu-btn">
        <Button
          color="success"
          outline
          className="btn-pill big-btn height-35px m-2"
          onClick={() => movePage(1)}
        >
          Back
        </Button>
        <Button
          color="success"
          className="btn-pill big-btn  height-35px m-2"
          onClick={() => movePage(3)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  artist: state,
});
export default connect(mapStateToProps)(SyncAccounts);
