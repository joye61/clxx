/** @jsx jsx */
import { jsx } from "@emotion/core";
import { CountDown } from ".";
import { useEffect, useRef, useState } from "react";
import { is } from "../is";
import React from "react";
function useFrame(option, update) {
    const updateRef = useRef(update);
    useEffect(() => {
        updateRef.current = update;
    });
    useEffect(() => {
        let update = updateRef.current;
        if (is.function(option.onUpdate)) {
            update = (result) => {
                option.onUpdate(result);
                updateRef.current(result);
            };
        }
        const countdown = new CountDown(option);
        countdown.onUpdate(update);
        return () => countdown.destroy();
    }, [option]);
}
export function CountDownComponent(props) {
    const noUnit = is.boolean(props.noUnit) ? props.noUnit : true;
    const separator = props.separator || ":";
    const className = is.string(props.className) ? props.className : undefined;
    // 初始化一个永远不会执行的定时器，主要用于获取初始值
    const initOption = Object.assign(Object.assign({}, props), { startImmediately: false });
    const initCountDown = new CountDown(initOption);
    const [result, setResult] = useState(initCountDown.getCurrentResult());
    // 更新结果参数
    useFrame(props, result => setResult([...result]));
    let numberStyle = {
        fontFamily: "Arial, Verdana, Tahoma"
    };
    if (is.plainObject(props.numberStyle)) {
        numberStyle = Object.assign(Object.assign({}, numberStyle), props.numberStyle);
    }
    const output = result.map((item, index) => {
        let extra = null;
        if (noUnit) {
            extra = index === result.length - 1 ? "" : separator;
        }
        else {
            extra = item.unit;
        }
        return (jsx(React.Fragment, { key: index },
            jsx("span", { css: numberStyle }, item.text),
            extra));
    });
    return jsx("span", { className: className }, output);
}
