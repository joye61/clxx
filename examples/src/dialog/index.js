// import React from "react";
// import { Dialog, RowCenter } from "@";
// import style from "./index.module.scss";

// export default function () {
//   return (
//     <div>
//       <p>
//         <button
//           onClick={() => {
//             const dialog = new Dialog(
//               (
//                 <RowCenter className={style.contentBox}>
//                   <button onClick={() => dialog.close()}>关闭</button>
//                 </RowCenter>
//               )
//             );
//             dialog.onClose(() => {
//               console.log("dialog closed");
//             });
//           }}
//         >
//           content普通弹框
//         </button>
//       </p>
//       <p>
//         <button
//           onClick={() => {
//             const dialog = new Dialog({
//               id: "hello",
//               className: "world",
//               type: "pullUp",
//               content: (
//                 <RowCenter className={style.contentBox}>
//                   <button onClick={() => dialog.close()}>关闭</button>
//                 </RowCenter>
//               ),
//             });
//           }}
//         >
//           从底部上拉出
//         </button>
//       </p>
//       <p>
//         <button
//           onClick={() => {
//             const dialog = new Dialog({
//               type: "pullDown",
//               content: (
//                 <RowCenter className={style.contentBox}>
//                   <button onClick={() => dialog.close()}>关闭</button>
//                 </RowCenter>
//               ),
//             });
//           }}
//         >
//           从顶部下拉出
//         </button>
//       </p>
//       <p>
//         <button
//           onClick={() => {
//             const dialog = new Dialog({
//               type: "pullRight",
//               content: (
//                 <RowCenter className={style.contentBox}>
//                   <button onClick={() => dialog.close()}>关闭</button>
//                 </RowCenter>
//               ),
//             });
//           }}
//         >
//           左侧往右侧拉出
//         </button>
//       </p>
//       <p>
//         <button
//           onClick={() => {
//             const dialog = new Dialog({
//               type: "pullLeft",
//               content: (
//                 <RowCenter className={style.contentBox}>
//                   <button onClick={() => dialog.close()}>关闭</button>
//                 </RowCenter>
//               ),
//             });
//           }}
//         >
//           右侧往左侧拉出
//         </button>
//       </p>
//     </div>
//   );
// }
