import { Tick } from "../utils/tick";
import { useEffect, useRef } from "react";

/**
 * 逐帧执行的ticker
 * @param frame 帧函数
 * @param interval 执行间隔
 */
export function useTick(frame: () => void) {
  const framer = useRef(frame);
  framer.current = frame;
  useEffect(() => {
    const tick = new Tick(() => framer.current());
    tick.start();
    return () => tick.destroy();
  }, []);
}
