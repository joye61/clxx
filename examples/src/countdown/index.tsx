import React from "react";
import { CountDown } from "../../../packages/countdown/build/index";

export default function() {
  return (
    <div>
      <div>
        <p>1、时:分:秒</p>
        <CountDown remainTime={300000} />
      </div>
      <div>
        <p>2、时:分</p>
        <CountDown remainTime={300000} format="hi" />
      </div>
      <div>
        <p>3、天:时:分:秒</p>
        <CountDown remainTime={300000} format="dhis" />
      </div>
      <div>
        <p>4、时:分:秒，每2秒变化一次</p>
        <CountDown remainTime={300000} format="his" interval={2} />
      </div>
      <div>
        <p>5、*时*分*秒</p>
        <CountDown remainTime={300000} format="his" noUnit={false} />
      </div>
      <div>
        <p>6、*Hour*Minute*Second，定制分割单位的UI</p>
        <CountDown
          remainTime={300000}
          format="his"
          noUnit={false}
          unitMap={{
            h: (
              <span style={{ textDecoration: "underline", color: "gray" }}>
                Hour
              </span>
            ),
            i: (
              <span style={{ textDecoration: "underline", color: "gray" }}>
                Minute
              </span>
            ),
            s: (
              <span style={{ textDecoration: "underline", color: "gray" }}>
                Second
              </span>
            )
          }}
        />
      </div>
      <div>
        <p>7、时:分:秒，定制数字的UI</p>
        <CountDown
          remainTime={300000}
          renderItem={item => {
            return (
              <span style={{ color: "red", border: "1px solid blue" }}>
                {item.text}
              </span>
            );
          }}
        />
      </div>
    </div>
  );
}
