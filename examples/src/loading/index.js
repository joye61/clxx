import React from "react";
import { Loading, clxxSetEnv } from "@";
import { useEffect } from "react";

setInterval(()=>{
	clxxSetEnv({
		criticalWidth: 576,
		designWidth: window.__CLXX_VARS.designWidth + 10
	});
}, 1000);

export default function () {

	useEffect(()=>{
		console.log(111);
	}, []);

  return (
    <div>
      <p>普通加载(5秒后自动关闭)</p>
      <button onClick={()=>{
				const loading = new Loading();
				window.setTimeout(()=>{
					loading.close();
				}, 5000)
			}}>显示Loading</button>
      <p>带额外信息的加载(2秒后自动关闭)</p>
      <button onClick={()=>{
				const loading = new Loading({
					extra: "数据加载中...",
					radius: 0,
					minDuration: 2000
				});
				window.setTimeout(()=>{
					loading.close();
				}, 0)
			}}>显示Loading</button>
    </div>
  );
}
