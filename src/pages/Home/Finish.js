import React from "react";
import {Button} from "reactstrap";

function Finish() {
  function handleFinish() {
    window.location.href = "https://info778317.typeform.com/to/K2gqJL";
  }
  return (
    <div className="content-body">
      <div className="title">
        Your new website is being generated. Please allow up to 5 minutes to receive the
        email with the link to preview your new website.
      </div>
      <Button color="success" className="btn-pill big-btn m-2" onClick={handleFinish}>
        Finish
      </Button>
    </div>
  );
}

export default Finish;
