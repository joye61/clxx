import React from "react";
import { showAlert, RowCenter } from "@";

export default function () {
  return (
    <div>
      <p>
        <button
          onClick={() => {
            showAlert({
              title: "允许“车轮查违章”在您使用该应用时访问你的位置吗",
              description: "访问位置将查找定位信息",
              // showCancel: true,
              onCancel() {
                console.log("cancel");
              },
              onConfirm() {
                console.log("confirm");
              },
            });
          }}
        >
          普通弹框
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            showAlert({
              title: "这是一个带取消的弹框",
              confirm: "知道了",
              showCancel: true,
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
              description: "这是一个带标题的弹框",
              showCancel: true,
              onCancel() {
                console.log("cancel");
              },
              onConfirm() {
                console.log("confirm");
              },
            });
          }}
        >
          带标题弹框
        </button>
      </p>

      <p>
        <button
          onClick={() => {
            showAlert({
              description: "定制按钮的内容",
              showCancel: true,
              confirm: (
                <RowCenter style={{ height: "100%" }}>
                  <svg style={{ width: ".24rem" }} viewBox="0 0 24 24">
                    <path
                      fill="gray"
                      d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
                    />
                  </svg>
                  用户信息
                </RowCenter>
              ),
            });
          }}
        >
          定制按钮的内容
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            showAlert({
              description: "标题、按钮、内容都是可定制的",
              title: (
                <h2 style={{ textAlign: "center", color: "red", margin: 0 }}>
                  大标题
                </h2>
              ),
              showCancel: true,
              confirm: (
                <RowCenter style={{ height: "100%" }}>
                  <svg style={{ width: ".24rem" }} viewBox="0 0 24 24">
                    <path
                      fill="gray"
                      d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
                    />
                  </svg>
                  用户信息
                </RowCenter>
              ),
            });
          }}
        >
          标题、按钮、内容都是可定制的
        </button>
      </p>
    </div>
  );
}
