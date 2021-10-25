import React from "react";
import { showDialog, RowCenter } from "@";
import style from "./index.module.scss";

export default function Index () {
  return (
    <div>
      <p>
        <button
          onClick={async () => {
            const close = await showDialog({
              showMask: false,
              blankClosable: true,
              content: (
                <RowCenter className={style.contentBox}>
                  <button
                    onClick={() => {
                      close();
                    }}
                  >
                    关闭
                  </button>
                </RowCenter>
              ),
            });
          }}
        >
          普通弹框，没有遮罩，空白可关闭
        </button>
      </p>
      <p>
        <button
          onClick={async () => {
            const close = await showDialog({
              id: "hello",
              className: "world",
              type: "pullUp",
              showMask: false,
              blankClosable: true,
              content: (
                <RowCenter className={style.contentBox}>
                  <button onClick={() => close()}>关闭</button>
                </RowCenter>
              ),
            });
          }}
        >
          从底部上拉出，没有遮罩，空白可关闭
        </button>
      </p>
      <p>
        <button
          onClick={async () => {
            const close = await showDialog({
              type: "pullDown",
              content: (
                <RowCenter className={style.contentBox}>
                  <button onClick={() => close()}>关闭</button>
                </RowCenter>
              ),
            });
          }}
        >
          从顶部下拉出，有遮罩，空白不可关闭
        </button>
      </p>
      <p>
        <button
          onClick={async () => {
            const close = await showDialog({
              type: "pullRight",
              content: (
                <RowCenter className={style.contentBox}>
                  <button onClick={() => close()}>关闭</button>
                </RowCenter>
              ),
            });
          }}
        >
          左侧往右侧拉出，有遮罩，空白不可关闭
        </button>
      </p>
      <p>
        <button
          onClick={async () => {
            const close = await showDialog({
              type: "pullLeft",
              content: (
                <RowCenter className={style.contentBox}>
                  <button onClick={() => close()}>关闭</button>
                </RowCenter>
              ),
            });
          }}
        >
          右侧往左侧拉出，有遮罩，空白不可关闭
        </button>
      </p>
    </div>
  );
}
