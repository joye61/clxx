import React from "react";
import { showAlert } from "@";

export default function () {
  return (
    <div>
      <p>
        <button
          onClick={() => {
            showAlert("hello world");
          }}
        >
          普通弹框
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            showAlert({
							content: "这是一个带取消的弹框",
							showCancel: true
						});
          }}
        >
          带取消弹框
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            showAlert({
							content: "这是一个带标题的弹框",
							showCancel: true,
							showTitle: true,
							onCancel(){
								console.log('cancel');
							},
							onConfirm(){
								console.log('confirm');
							}
						});
          }}
        >
          带标题弹框
        </button>
      </p>
    </div>
  );
}
