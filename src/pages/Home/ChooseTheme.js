import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Button} from "reactstrap";
import {
  selectedArtistSelector,
  webBuilderSelector,
  getWebBuilder,
  updateWebBuilder,
} from "../../modules/artist";
import {templatesSelector, getTemplates} from "../../modules/template";

const mapStateToProps = state => ({
  selectedArtist: selectedArtistSelector(state),
  templates: templatesSelector(state),
  webBuilder: webBuilderSelector(state),
});

const mapDispatch = {
  getTemplates,
  getWebBuilder,
  updateWebBuilder,
};

function ChooseTheme({
  history,
  selectedArtist,
  templates,
  webBuilder,
  getTemplates,
  getWebBuilder,
  updateWebBuilder,
}) {
  useEffect(() => {
    getTemplates();
  }, [getTemplates]);

  useEffect(() => {
    if (!webBuilder.id) {
      getWebBuilder(selectedArtist.id);
    }
  }, [webBuilder, getWebBuilder, selectedArtist]);

  function handleChooseTheme(template) {
    updateWebBuilder({
      ...webBuilder,
      template_id: template.id,
    });
  }

  function handleContinue() {
    const selectedTemplate = templates.find(t => t.id === webBuilder.template_id);
    history.push(`/cover/${selectedTemplate.type}`);
  }

  const selectedTemplateId = webBuilder.template_id;

  return (
    <div className="content-body">
      <div className="title">Select a theme to preview your new website</div>
      <div className="themes">
        {templates.map(template => (
          <div className="theme-item" key={template.id}>
            <div className="img-content">
              <img src={template.image} alt=""></img>
            </div>
            <div className="theme-title">{template.title}</div>
            <Button
              color={selectedTemplateId !== template.id ? "dark" : "success"}
              outline={selectedTemplateId !== template.id}
              className="btn-pill big-btn artist-btn height-35px"
              onClick={() => handleChooseTheme(template)}
            >
              {`${selectedTemplateId === template.id ? "Selected" : "Select theme"}`}
            </Button>
          </div>
        ))}
      </div>
      <div className="d-flex-row">
        <Button
          color="success"
          outline
          className="btn-pill big-btn height-35px m-2"
          onClick={() => history.push("/social")}
        >
          Back
        </Button>
        <Button
          color="success"
          className="btn-pill big-btn height-35px m-2"
          disabled={!Boolean(selectedTemplateId)}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatch
)(ChooseTheme);
