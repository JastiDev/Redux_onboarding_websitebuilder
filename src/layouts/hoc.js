import React from "react";

import {MainLayout} from "./Main";
import {HomeLayout} from "./Home";

export const withMainLayout = Component => props => {
  return (
    <MainLayout>
      <Component {...props} />
    </MainLayout>
  );
};

export const withHomeLayout = Component => props => {
  return (
    <HomeLayout>
      <Component {...props} />
    </HomeLayout>
  );
};
