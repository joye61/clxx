import "./index.scss";
import React from "react";
import { createApp, history } from "@";
import Home from "./index/index";

createApp({
  target: document.getElementById("root"),
  async renderPage(pathname) {
    let page = await import(`./${pathname}/index.js`);
    if (pathname === "index") {
      return <Home />;
    }
    return (
      <>
        <div className="backHome">
          <button
            onClick={() => {
              history.back();
            }}
          >
            回到首页
          </button>
        </div>
        <div className="demo">
          <page.default />
        </div>
      </>
    );
  },
});
