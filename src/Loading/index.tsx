import { Wrapper, LoadingWrapperProps } from './Wrapper';
import { createPortalDOM } from '../utils/dom';
import isPlainObject from 'lodash/isPlainObject';

/**
 * 显示loading
 * @param hint 提示文字
 * @param option
 * @returns
 */
export function showLoading(hint?: string, option?: LoadingWrapperProps) {
  const { mount, unmount } = createPortalDOM();
  let props: LoadingWrapperProps = { hint, status: 'show' };
  if (isPlainObject(option)) {
    delete option!.status;
    props = { ...props, ...option };
  }

  // 关闭loading
  const closeLoading = async () => {
    props.status = 'hide';
    props.onHide = unmount;
    await mount(<Wrapper {...props} />);
  };

  // 显示loading
  const mountShow = mount(<Wrapper {...props} />);

  // 关闭loading
  return async () => {
    await mountShow;
    await closeLoading();
  };
}

/**
 * 显示loading，至少展示atLeast毫秒
 * @param atLeast 最小展示时间
 * @param hint 提示文字
 * @param option 各种可定制的选项
 * @returns
 */
export function showLoadingAtLeast(
  atLeast = 300,
  hint?: string,
  option?: LoadingWrapperProps
) {
  const closeLoading = showLoading(hint, option);
  // 记录开始展示的时间
  const start = Date.now();

  // 返回一个可关闭的函数
  return async () => {
    const now = Date.now();
    const diff = now - start;
    // 如果当前关闭的时间已经超过最小允许的时间，直接关闭
    if (diff >= atLeast) {
      await closeLoading();
      return;
    }
    // 等待剩余的差时间差
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, atLeast - diff);
    });
    // 时间够了，直接关闭
    await closeLoading();
  };
}
