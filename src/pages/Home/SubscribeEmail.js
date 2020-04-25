import React, {useState, useCallback, useEffect} from "react";
import {connect} from "react-redux";
import {Input, Button} from "reactstrap";
import {
  selectedArtistSelector,
  webBuilderSelector,
  getWebBuilder,
  updateWebBuilder,
  generateWebsite,
} from "../../modules/artist";

const mapStateToProps = state => ({
  selectedArtist: selectedArtistSelector(state),
  webBuilder: webBuilderSelector(state),
});

const mapDispatch = {
  updateWebBuilder,
  getWebBuilder,
  generateWebsite,
};

function SubscribeEmail({
  history,
  selectedArtist,
  webBuilder,
  getWebBuilder,
  updateWebBuilder,
  generateWebsite,
}) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!webBuilder.id) {
      getWebBuilder(selectedArtist.id);
    }
  }, [getWebBuilder, selectedArtist.id, webBuilder]);

  const handleChange = useCallback(e => {
    setEmail(e.target.value);
  }, []);

  const handleSubmit = useCallback(async () => {
    await updateWebBuilder({
      id: webBuilder.id,
      email,
    });

    const {
      value: {data},
    } = await generateWebsite(webBuilder.id);
    if (data.code === "build-started") {
      history.push("/finish");
    } else if (data.code === "already-exist") {
      alert("The website has been updated!");
      history.push("/");
    } else if (data.code === "build-in-progress") {
      alert(
        "The website is still being generated! You will receive an email with the website link after a while."
      );
      history.push("/");
    }
  }, [updateWebBuilder, webBuilder.id, email, generateWebsite, history]);

  return (
    <div className="content-body">
      <div className="title">
        Please enter your email so we can send you the link to view your new website
      </div>
      <div className="d-flex-row" style={{marginTop: 40}}>
        <div style={{marginRight: "16px"}}>Email Address:</div>
        <Input className="input-box" value={email} onChange={handleChange} />
      </div>
      <Button
        color="success"
        className="btn-pill big-btn height-35px m-2"
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatch
)(SubscribeEmail);
