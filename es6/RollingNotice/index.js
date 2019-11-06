/** @jsx jsx */
import { jsx } from "@emotion/core";
import { is } from "../is";
import { style } from "./style";
import { useInterval } from "react-use";
import { useRef, useEffect, useState } from "react";
import { compat } from "../compat";
import raf from "raf";
export function RollingNotice(props) {
    let className = is.string(props.className) ? props.className : undefined;
    let itemClass = is.string(props.itemClass) ? props.itemClass : undefined;
    let itemStyle = is.plainObject(props.itemStyle) ? props.itemStyle : undefined;
    let interval = is.number(props.interval) ? props.interval : 3000;
    let easeingDuration = is.number(props.easingDuration)
        ? props.easingDuration
        : 300;
    let easing = is.string(props.easing) ? props.easing : "linear";
    // 滚动间隔不能小于过度间隔
    if (interval < easeingDuration + 100) {
        interval = easeingDuration + 100;
    }
    // 注意：不能直接将props.list的应用赋值给list
    let list = is.array(props.list) ? [...props.list] : [];
    if (list.length > 1) {
        list.push(list[0]);
    }
    // 设置滚动列表的动画样式
    const transitionStyle = {
        transitionProperty: "transform",
        transitionTimingFunction: easing,
        transitionDuration: `${easeingDuration}ms`
    };
    const indexRef = useRef(0);
    const container = useRef(null);
    const heightRef = useRef(0);
    const [noTransition, setNoTransition] = useState(false);
    // 设置被滚动容器的样式
    const containerStyle = [style.ul];
    if (noTransition === false) {
        containerStyle.push(transitionStyle);
    }
    // 独立出来的原因是为了防止每一次滚动都要加载
    useEffect(() => {
        const ul = container.current;
        const containerElement = ul.parentElement;
        heightRef.current = containerElement.getBoundingClientRect().height;
    });
    useInterval(() => {
        if (list.length > 1) {
            // 当前显示的索引值自动+1
            indexRef.current += 1;
            const target = container.current;
            target.style[compat.transform] = `translateY(-${heightRef.current * indexRef.current}px)`;
        }
    }, interval);
    useEffect(() => {
        // 只要 noTransition === true 可以确认滚动到了最后一个
        if (noTransition) {
            // 首先立即无动画切换到第一个
            indexRef.current = 0;
            const target = container.current;
            target.style[compat.transform] = `translateY(0)`;
            // 然后把动画属性恢复
            raf(() => setNoTransition(false));
        }
    }, [noTransition]);
    const transitionEnd = () => {
        // 如果滚动到最后一个，要无动画立即切换到第一个，达到流程动画效果
        if (indexRef.current === list.length - 1) {
            setNoTransition(true);
        }
    };
    return (jsx("div", { css: style.container(props.height), className: className },
        jsx("ul", { css: containerStyle, ref: container, onTransitionEnd: transitionEnd }, list.map((item, index) => {
            return (jsx("li", { key: index, css: style.li(props.height), style: itemStyle, className: itemClass }, item));
        }))));
}
