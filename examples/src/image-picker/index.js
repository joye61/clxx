// import "./index.scss";
// import React from "react";
// import { ImagePicker, SimpleImagePicker, Loading } from "@";

// export default function () {
//   return (
//     <div>
//       <p>网格风格的图片选择器（多选）</p>
//       <ImagePicker
//         gutter=".32rem"
//         // renderPickButton={() => {
//         //   return <span>Haha</span>;
//         // }}
//         multiple
//         cols={4}
//         // isSquare={false}
//         onHookEachRound={() => {
//           // 显示一个loading
//           let loading = null;
//           const onStartPick = () => {
//             loading = new Loading();
//           };
//           const onEndPick = async () => {
//             await loading?.close();
//           };
//           return { onStartPick, onEndPick };
//         }}
//         onFilesChange={(res) => {
//           console.log(res);
//         }}
//       />

//       <p>网格风格的自定义选取按钮的图片选择器（多选）</p>
//       <ImagePicker
//         multiple
//         gutter={10}
//         cols={4}
//         maxPick={20}
//         renderPickButton={(disabled) => {
//           console.log(disabled);
//           return <button>选取图片</button>;
//         }}
//       />

//       <p>普通选择器（多选，结果需要自己处理）</p>
//       <SimpleImagePicker
//         multiple
//         onHookEachRound={() => {
//           // 显示一个loading
//           let loading = null;
//           const onStartPick = () => {
//             loading = new Loading();
//           };
//           const onEndPick = async () => {
//             await loading?.close();
//           };
//           return { onStartPick, onEndPick };
//         }}
//         onFilesChange={(res) => {
//           console.log(res);
//         }}
//       />
//       <p>自定义选取按钮普通选择器（单选，结果需要自己处理）</p>
//       <SimpleImagePicker
//         // multiple
//         renderPickButton={() => {
//           return <button>选取图片</button>;
//         }}
//         onFilesChange={(res) => {
//           console.log(res);
//         }}
//       />
//       <p>限制最大宽度（单选，结果需要自己处理）</p>
//       <SimpleImagePicker
//         // multiple
//         renderPickButton={() => {
//           return <button>选取图片</button>;
//         }}
//         onFilesChange={(res) => {
//           console.log(res);
//         }}
//         loadImageOption={{
//           maxWidth: 10
//         }}
//       />
//     </div>
//   );
// }
