import Amplify from "@aws-amplify/core";
import {Auth} from "aws-amplify";
import Storage from "@aws-amplify/storage";

export function configureAmplify() {
  Amplify.configure({
    Auth: {
      identityPoolId: process.env.REACT_APP_Cognito_IdentityPoolId,
      region: process.env.REACT_APP_AWS_Region,
      userPoolId: process.env.REACT_APP_Cognito_UserPoolId,
      userPoolWebClientId: process.env.REACT_APP_Cognito_UserPoolWebClientId,
    },
    Storage: {
      bucket: process.env.REACT_APP_Bucket_name,
      region: process.env.REACT_APP_AWS_Region,
      identityPoolId: process.env.REACT_APP_Cognito_IdentityPoolId,
    },
  });

  if (process.env.REACT_APP_ENV === "production") {
    Auth.currentCredentials();
  }
}

export function SetS3Config(bucket, level) {
  Storage.configure({
    bucket: bucket,
    level: level,
    region: "us-east-1",
    identityPoolId: process.env.REACT_APP_Cognito_IdentityPoolId,
  });
}
