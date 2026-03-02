import './index.css';
import React from 'react';
import { createApp, history } from '@';
import Home from './index/index';

createApp({
  target: "#root",
  // maxDocWidth: 10000,
  async render(pathname) {
    const module = await import(`./${pathname}/index.jsx`);
    const Page = module.default;
    if (pathname === 'index') {
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
          <Page />
        </div>
      </>
    );
  },
});
