// import React from "react";
// import { Loading } from "@";

// export default function () {

//   return (
//     <div>
//       <p>普通加载(5秒后自动关闭)</p>
//       <button onClick={()=>{
// 				const loading = new Loading();
// 				window.setTimeout(()=>{
// 					loading.close();
// 				}, 5000)
// 			}}>显示Loading</button>
//       <p>带额外信息的加载(2秒后自动关闭)</p>
//       <button onClick={()=>{
// 				const loading = new Loading({
// 					extra: "数据加载中...",
// 					radius: 0,
// 					minDuration: 2000
// 				});
// 				window.setTimeout(()=>{
// 					loading.close();
// 				}, 0)
// 			}}>显示Loading</button>
//     </div>
//   );
// }
