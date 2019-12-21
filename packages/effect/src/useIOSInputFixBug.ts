import { useEffect } from "react";

/**
 * 修复在IOS系统中H5页面的输入框无法聚焦的Bug
 * @param input 
 */
export function useIOSInputFixBug(input: HTMLElement) {
  useEffect(() => {
    let hasFocus = false;
    let focusin = (event: FocusEvent) => {
      if (event.target === input) {
        hasFocus = true;
      }
    };
    let focusout = () => {
      if (hasFocus) {
        hasFocus = false;
        window.setTimeout(() => {
          window.scroll(0, 0);
        }, 100);
      }
    };
    document.body.addEventListener("focusin", focusin);
    document.body.addEventListener("focusout", focusout);

    return () => {
      document.body.removeEventListener("focusin", focusin);
      document.body.removeEventListener("focusout", focusout);
    };
  }, [input]);
}
