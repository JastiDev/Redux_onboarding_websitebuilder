import React from "react";
import {AppHeader} from "@coreui/react";
import Header from "./Header";

function MainLayout({children}) {
  return (
    <div className="app">
      <AppHeader fixed className="mobile-menu">
        <Header />
      </AppHeader>
      <div className="app-body">
        <main className="main">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;
