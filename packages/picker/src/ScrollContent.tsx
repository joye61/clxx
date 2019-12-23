/** @jsx jsx */
import { jsx } from "@emotion/core";
import { style } from "./ScrollContentStyle";
import { useRef, useEffect } from "react";
import Swiper from "swiper";
import debounce from "lodash/debounce";

export function ScrollContent(props: ScrollContentProps) {
  const container = useRef<HTMLDivElement>(null);
  const swiper = useRef<Swiper>(null);

  /**
   * 将change监听器移除依赖，同时保持最新
   */
  const onChange = useRef<PickerChangeFunc | undefined>(props.onChange);
  useEffect(() => {
    onChange.current = props.onChange;
  });

  /**
   * 初始化swiper实例
   */
  useEffect(() => {
    (swiper as any).current = new Swiper(container.current!, {
      initialSlide: props.selected || 0,
      touchEventsTarget: "container",
      direction: "vertical",
      slidesPerView: "auto",
      freeMode: true,
      freeModeMomentum: true,
      mousewheel: true,
      freeModeSticky: true,
      centeredSlides: true,
      touchMoveStopPropagation: true,
      a11y: {
        enabled: false
      }
    });

    /**
     * slideChangeTransitionEnd 在低速滚动时出现不会每次都触发
     * 此处用transitionEnd代替，并添加触发条件，防止无效消耗
     */
    let lastSlideIndex = swiper.current!.realIndex;
    const transitionEnd = debounce(
      () => {
        if (
          typeof onChange.current === "function" &&
          swiper.current!.realIndex !== lastSlideIndex
        ) {
          onChange.current(swiper.current!.realIndex);
        }
        lastSlideIndex = swiper.current!.realIndex;
      },
      100,
      {
        leading: false,
        trailing: true
      }
    );
    swiper.current!.on("transitionEnd", transitionEnd);

    /**
     * 组件被销毁时清除逻辑
     */
    return () => {
      swiper.current!.off("transitionEnd", transitionEnd);
      swiper.current!.destroy(true, true);
    };
  }, []);

  /**
   * 更新当前选中的选项
   */
  useEffect(() => {
    if (swiper.current instanceof Swiper && props.selected) {
      swiper.current.slideTo(props.selected);
    }
  }, [props.selected]);

  /**
   * 列表更新时重新计算尺寸值
   */
  useEffect(() => {
    if (swiper.current instanceof Swiper) {
      swiper.current!.update();
    }
  }, [props.list]);

  /**
   * 生成列表
   */
  const showList = () => {
    return props.list?.map((item, index) => {
      return (
        <div className="swiper-slide" key={index}>
          {item}
        </div>
      );
    });
  };

  return (
    <div css={style.container} className="clxx-Picker">
      <div className="swiper-container" ref={container}>
        <div className="swiper-wrapper">{showList()}</div>
        <div css={style.mask}></div>
      </div>
    </div>
  );
}
