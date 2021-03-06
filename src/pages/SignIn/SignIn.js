import React, {useCallback} from "react";
import {connect} from "react-redux";
import {Form, Input, Button, FormFeedback, FormGroup} from "reactstrap";
import {Formik} from "formik";
import * as yup from "yup";

import {signIn} from "../../modules/auth";

import "./SignIn.scss";

const mapDispatch = {
  signIn,
};

function SignIn({signIn, history}) {
  const handleSubmit = useCallback(
    async (values, formik) => {
      formik.setSubmitting(true);
      await signIn(values);
      formik.setSubmitting(false);
      history.push("/");
    },
    [history, signIn]
  );

  return (
    <div className="login-page">
      <div className="login-page__content">
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={yup.object().shape({
            email: yup
              .string()
              .email("Email is invalid")
              .required("Email is required!"),
            password: yup
              .string()
              .min(8, "Password has to be longer than 8 characters!")
              .required("Password is required!"),
          })}
          onSubmit={handleSubmit}
          render={({values, handleChange, handleBlur, handleSubmit, touched, errors}) => (
            <Form onSubmit={handleSubmit}>
              <FormGroup row>
                <Input
                  placeholder="Email"
                  type="email"
                  name="email"
                  invalid={Boolean(touched.email && errors.email)}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.email && errors.email && (
                  <FormFeedback>{errors.email}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup row>
                <Input
                  placeholder="Password"
                  type="password"
                  name="password"
                  invalid={Boolean(touched.password && errors.password)}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.password && errors.password && (
                  <FormFeedback>{errors.password}</FormFeedback>
                )}
              </FormGroup>
              <div className="login-btn-wrapper">
                <Button color="success" className="btn-pill big-btn m-2" type="submit">
                  Login
                </Button>
              </div>
            </Form>
          )}
        />
      </div>
    </div>
  );
}

export default connect(
  null,
  mapDispatch
)(SignIn);
