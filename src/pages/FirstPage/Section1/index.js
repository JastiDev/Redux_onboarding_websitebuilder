import React from "react";
import {Wrapper, Img, Arrow, Title, Subtitle} from "./styles";
import logoImg from "../../../assets/images/logo.png";

import {Row, Col, Button, Input, Form, FormFeedback} from "reactstrap";

import {Formik} from "formik";
import * as yup from "yup";

import "./styles.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebookF} from "@fortawesome/free-brands-svg-icons";

const Section1 = ({propSubmit, propVerifyWithFacebook}) => {
  const doSubmit = async (values, formik) => {
    formik.setSubmitting(true);
    await propSubmit(values);
    formik.setSubmitting(false);
  };

  return (
    <Wrapper>
      <div className="inner_wrapper">
        <Img src={logoImg} />
        <Title>Automated Music Websites</Title>
        <Subtitle>
          Build your website in minutes.
          <br />
          Let your website work for you.
          <br />
          No credit card required to start.
        </Subtitle>

        <Formik
          initialValues={{
            firstname: "",
            email: "",
            password: "",
          }}
          validationSchema={yup.object().shape({
            firstname: yup.string().required("First name is required!"),
            email: yup
              .string()
              .email("Email is invalid")
              .required("Email is required!"),
            password: yup
              .string()
              .min(8, "Password has to be longer than 8 characters!")
              .required("Password is required!"),
          })}
          onSubmit={doSubmit}
        >
          {({values, handleChange, handleBlur, handleSubmit, touched, errors}) => {
            return (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={4} lg={2} style={{paddingTop: "20px"}}>
                    <Input
                      placeholder="First Name"
                      type="text"
                      name="firstname"
                      invalid={Boolean(touched.firstname && errors.firstname)}
                      value={values.firstname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{
                        padding: "0px 20px",
                        backgroundColor: "white",
                        color: "black",
                        fontSize: "18px",
                      }}
                    />
                    {touched.firstname && errors.firstname && (
                      <FormFeedback>{errors.firstname}</FormFeedback>
                    )}
                  </Col>
                  <Col md={4} lg={2} style={{paddingTop: "20px"}}>
                    <Input
                      placeholder="Email"
                      type="email"
                      name="email"
                      invalid={Boolean(touched.email && errors.email)}
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{
                        padding: "0px 20px",
                        backgroundColor: "white",
                        color: "black",
                        fontSize: "18px",
                      }}
                    />

                    {touched.email && errors.email && (
                      <FormFeedback>{errors.email}</FormFeedback>
                    )}
                  </Col>
                  <Col md={4} lg={2} style={{paddingTop: "20px"}}>
                    <Input
                      placeholder="Password"
                      type="password"
                      name="password"
                      invalid={Boolean(touched.password && errors.password)}
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{
                        padding: "0px 20px",
                        backgroundColor: "white",
                        color: "black",
                        fontSize: "18px",
                      }}
                    />

                    {touched.password && errors.password && (
                      <FormFeedback>{errors.password}</FormFeedback>
                    )}
                  </Col>
                  <Col sm={12} lg={2} style={{paddingTop: "20px"}}>
                    <button color="success" type="submit" className="round_button">
                      GET STARTED FOR FREE
                    </button>
                  </Col>
                  <Col md={6} lg={4}></Col>
                </Row>
              </Form>
            );
          }}
        </Formik>

        <Row style={{marginTop: "30px"}}>
          <Col sm={12} lg={1} style={{marginBottom: "30px"}}>
            <b className="big_or">OR</b>
          </Col>
          <Col sm={12} lg={2} style={{marginBottom: "30px"}}>
            <button className="facebook-btn" onClick={e => propVerifyWithFacebook()}>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faFacebookF} />
                Sign up with facebook
              </div>
            </button>
          </Col>
          <Col lg={9}></Col>
          <div style={{fontSize: "18px"}}>
            By continuing you agree to JamFeed's Terms of Service and Privacy Policy
          </div>
        </Row>
      </div>

      <Arrow>
        <div>Learn More</div>
        <div>V</div>
      </Arrow>
    </Wrapper>
  );
};

export default Section1;
