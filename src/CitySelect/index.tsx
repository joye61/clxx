import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortalDOM } from "../utils/dom";
import type { CityItem } from "./type";
import { cityData, provinceData } from "./data";
import { searchCity } from "./search";
import { createStyle, DEFAULT_PRIMARY } from "./style";
import { ColStart } from "../Flex/Col";
import { RowStart } from "../Flex/Row";
import { Clickable } from "../Clickable";

export interface SelectedCity {
  name: string;
  code: string;
  province: {
    name: string;
    code: string;
  };
}

export interface CitySelectProps {
  onClose?: () => void;
  onSelect?: (city: SelectedCity) => void;
  onLetterChange?: (letter: string) => void;
  // 定位能力由外部提供：返回城市名称或城市 code，可同步或异步。
  // 组件首次挂载时调用一次；若解析到且能匹配 cityData 则展示「当前定位」，
  // 否则（包括失败、为空、匹配不到）不展示。
  getLocation?: () =>
    | string
    | null
    | undefined
    | Promise<string | null | undefined>;
  // 主题主色，形如 #rrggbb；primaryActive 会基于此自动派生
  primary?: string;
}

// 在 cityData 中按 code 或 name 查找城市
// name 匹配时允许省略末尾的"市"，如"北京" 匹配 "北京市"
function findCity(key?: string): CityItem | null {
  if (!key) return null;
  const k = key.trim();
  if (!k) return null;
  const kNoCity = k.endsWith("市") ? k.slice(0, -1) : k;
  for (const letter of Object.keys(cityData)) {
    for (const item of cityData[letter]) {
      if (item.code === k) return item;
      const nameNoCity = item.name.endsWith("市")
        ? item.name.slice(0, -1)
        : item.name;
      if (nameNoCity === kNoCity) return item;
    }
  }
  return null;
}

// 滑入/滑出动画在 style.inner 的 transition 中定义
export function CitySelect(props: CitySelectProps) {
  const {
    onClose,
    onSelect,
    onLetterChange,
    getLocation,
    primary = DEFAULT_PRIMARY,
  } = props;
  const style = useMemo(() => createStyle(primary), [primary]);
  const letters = useMemo(() => Object.keys(cityData), []);
  // 定位解析结果：null 表示尚未解析或失败/未匹配；非空时展示快捷入口
  const [locatedCity, setLocatedCity] = useState<CityItem | null>(null);

  // 首次挂载时调用一次外部定位；异步失败或匹配不到均保持不展示
  const getLocationRef = useRef(getLocation);
  getLocationRef.current = getLocation;
  useEffect(() => {
    const fn = getLocationRef.current;
    if (!fn) return;
    let cancelled = false;
    try {
      Promise.resolve(fn())
        .then((key) => {
          if (cancelled) return;
          const city = findCity(key ?? undefined);
          if (city) setLocatedCity(city);
        })
        .catch(() => {
          // 定位失败：保持不展示
        });
    } catch {
      // 同步抛错：保持不展示
    }
    return () => {
      cancelled = true;
    };
  }, []);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // 缓存每个字母区块在列表内的 offsetTop，避免每次 scroll 都 layout
  const sectionOffsetsRef = useRef<Array<{ letter: string; top: number }>>([]);
  // 触摸期间抽帧 set scrollTop，标记忽略 scroll 回调，避免抗抽
  const isTouchScrollRef = useRef(false);
  const [activeLetter, setActiveLetter] = useState<string | null>(
    () => letters[0] ?? null,
  );
  const [touching, setTouching] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [composing, setComposing] = useState(false);
  // 动画状态：entering 刚挂载还未滑入；active 已滑入到位；exiting 正在滑出
  const [phase, setPhase] = useState<"entering" | "active" | "exiting">(
    "entering",
  );
  // IME 合成期间不触发搜索，避免中文输入时的拼音中间态干扰结果
  const searchResult = useMemo(() => {
    if (composing) return null;
    return keyword.trim() ? searchCity(keyword) : null;
  }, [keyword, composing]);
  const isSearching = searchResult !== null;

  // 用 ref 保存最新值，避免 effect 依赖变化而反复解绑/绑定
  const lettersRef = useRef(letters);
  lettersRef.current = letters;
  const onLetterChangeRef = useRef(onLetterChange);
  onLetterChangeRef.current = onLetterChange;

  // 进入动画：下一帧切换到 active，触发 CSS transition
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      // 再套一层，确保初始 transform 已被浏览器应用
      requestAnimationFrame(() => setPhase("active"));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // 触发退出动画，真正的 onClose 在 transitionend 中触发
  const triggerClose = () => {
    if (phase === "exiting") return;
    // 进入动画未完成前退出：进入态和退出态 transform 相同，
    // 切到 exiting 不会产生 transform 变化，transitionend 不会触发；
    // 此时面板尚未滑入，直接调用 onClose 即可
    if (phase === "entering") {
      onClose?.();
      return;
    }
    setPhase("exiting");
  };

  // 监听 inner 的 transform 过渡结束，退出阶段调用 onClose
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.propertyName !== "transform") return;
    if (phase === "exiting") onClose?.();
  };

  // 选中城市：回调后触发退出动画
  const handleSelect = (city: CityItem) => {
    const province = provinceData[city.pcode];
    onSelect?.({
      name: city.name,
      code: city.code,
      province: {
        name: province?.name ?? "",
        code: city.pcode,
      },
    });
    triggerClose();
  };
  const measureSections = () => {
    const listEl = listRef.current;
    if (!listEl) return;
    const offsets: Array<{ letter: string; top: number }> = [];
    for (const letter of lettersRef.current) {
      const el = sectionRefs.current[letter];
      if (el) offsets.push({ letter, top: el.offsetTop });
    }
    sectionOffsetsRef.current = offsets;
  };

  useLayoutEffect(() => {
    if (isSearching) return;
    measureSections();
    const listEl = listRef.current;
    if (!listEl || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measureSections());
    ro.observe(listEl);
    return () => ro.disconnect();
  }, [isSearching]);

  // 根据 scrollTop 通过二分查找定位当前粘滞字母
  const getLetterByScrollTop = (scrollTop: number): string | null => {
    const offsets = sectionOffsetsRef.current;
    if (offsets.length === 0) return null;
    let lo = 0;
    let hi = offsets.length - 1;
    let idx = 0;
    // 1px 容差
    const target = scrollTop + 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (offsets[mid].top <= target) {
        idx = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return offsets[idx].letter;
  };

  // 滚动列表到对应字母区块的上边缘
  const scrollToLetter = (letter: string) => {
    const listEl = listRef.current;
    const sectionEl = sectionRefs.current[letter];
    if (!listEl || !sectionEl) return;
    const target = sectionEl.offsetTop;
    // scrollTop 未变化时不会派发 scroll 事件，
    // 若此时置 flag 为 true 会导致后续首次真实滚动被误吞
    if (listEl.scrollTop === target) return;
    isTouchScrollRef.current = true;
    listEl.scrollTop = target;
  };

  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;

    let lastLetter: string | null = null;

    const updateByY = (clientY: number) => {
      const list = lettersRef.current;
      if (list.length === 0) return;
      const rect = el.getBoundingClientRect();
      const itemHeight = rect.height / list.length;
      let index = Math.floor((clientY - rect.top) / itemHeight);
      if (index < 0) index = 0;
      if (index > list.length - 1) index = list.length - 1;
      const letter = list[index];
      if (letter !== lastLetter) {
        lastLetter = letter;
        setActiveLetter(letter);
        scrollToLetter(letter);
        onLetterChangeRef.current?.(letter);
      }
    };

    // 优先使用触摸事件；不支持触摸才回退到鼠标事件，避免两套并存冲突
    const isTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);

    if (isTouch) {
      const handleTouchStart = (e: TouchEvent) => {
        setTouching(true);
        updateByY(e.touches[0].clientY);
      };
      const handleTouchMove = (e: TouchEvent) => {
        // 阻止滚动，需要非 passive 监听器
        e.preventDefault();
        updateByY(e.touches[0].clientY);
      };
      const handleTouchEnd = () => {
        setTouching(false);
        lastLetter = null;
      };

      el.addEventListener("touchstart", handleTouchStart, { passive: false });
      el.addEventListener("touchmove", handleTouchMove, { passive: false });
      el.addEventListener("touchend", handleTouchEnd);
      el.addEventListener("touchcancel", handleTouchEnd);

      return () => {
        el.removeEventListener("touchstart", handleTouchStart);
        el.removeEventListener("touchmove", handleTouchMove);
        el.removeEventListener("touchend", handleTouchEnd);
        el.removeEventListener("touchcancel", handleTouchEnd);
      };
    }

    // 鼠标端：按下后拖动，move/up 绑在 document 以支持拖出 sidebar
    let dragging = false;
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      dragging = true;
      setTouching(true);
      updateByY(e.clientY);
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      updateByY(e.clientY);
    };
    const handleMouseUp = () => {
      if (!dragging) return;
      dragging = false;
      setTouching(false);
      lastLetter = null;
    };

    el.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      el.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isSearching]);

  // 手动滚动城市列表时，根据当前最靠上的区块激活对应字母（rAF 节流）
  useEffect(() => {
    if (isSearching) return;
    const listEl = listRef.current;
    if (!listEl) return;

    let rafId = 0;
    const handleScroll = () => {
      // 触摸导航主动设置 scrollTop 时不覆盖 activeLetter
      if (isTouchScrollRef.current) {
        isTouchScrollRef.current = false;
        return;
      }
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const letter = getLetterByScrollTop(listEl.scrollTop);
        if (!letter) return;
        setActiveLetter((prev) => (prev === letter ? prev : letter));
      });
    };

    listEl.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      listEl.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isSearching]);

  return (
    <div css={[style.container]}>
      <div
        css={[
          style.inner,
          phase === "entering" && style.innerEnter,
          phase === "active" && style.innerActive,
          phase === "exiting" && style.innerExit,
        ]}
        onTransitionEnd={handleTransitionEnd}
      >
        <ColStart css={style.original} alignItems="stretch">
          {/* 搜索框，退出等逻辑 */}
          <div css={style.top}>
            <RowStart>
              <svg viewBox="0 0 1024 1024" css={style.icon}>
                <path d="M896 870.4l-128-128c55.467-68.267 89.6-149.333 89.6-238.933 0-98.134-38.4-192-110.933-264.534-149.334-149.333-384-149.333-533.334-4.266-145.066 145.066-145.066 384 0 529.066 72.534 72.534 166.4 110.934 264.534 110.934 89.6 0 174.933-29.867 238.933-89.6l128 128c4.267 4.266 12.8 8.533 21.333 8.533s17.067-4.267 21.334-8.533c17.066-8.534 17.066-29.867 8.533-42.667zM260.267 721.067c-119.467-123.734-119.467-320 0-439.467 59.733-59.733 140.8-89.6 217.6-89.6 81.066 0 157.866 29.867 217.6 89.6 59.733 59.733 89.6 136.533 89.6 217.6 0 81.067-34.134 162.133-89.6 217.6-55.467 59.733-132.267 93.867-217.6 93.867-81.067 0-157.867-34.134-217.6-89.6z" />
              </svg>
              <input
                css={style.input}
                placeholder="请输入字母或汉字搜索城市"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onCompositionStart={() => setComposing(true)}
                onCompositionEnd={(e) => {
                  setComposing(false);
                  setKeyword(e.currentTarget.value);
                }}
              />
              <Clickable css={style.exit} onClick={triggerClose}>
                退出
              </Clickable>
            </RowStart>
          </div>

          {/* 当前定位快捷选项（仅在匹配到城市 且 非搜索态下展示） */}
          {!isSearching && locatedCity && (
            <Clickable
              css={style.locate}
              onClick={() => handleSelect(locatedCity)}
            >
              <svg viewBox="0 0 1024 1024" css={style.locateIcon}>
                <path d="M512 128C352 128 224 256 224 416c0 115.2 70.4 204.8 160 320 32 44.8 70.4 89.6 102.4 147.2C492.8 889.6 499.2 896 512 896l0 0c12.8 0 19.2-6.4 25.6-12.8 32-51.2 70.4-96 102.4-140.8 89.6-121.6 160-211.2 160-326.4C800 256 672 128 512 128zM588.8 704c-25.6 32-51.2 64-76.8 102.4-25.6-38.4-57.6-76.8-76.8-108.8-83.2-108.8-147.2-192-147.2-281.6C288 294.4 390.4 192 512 192s224 102.4 224 224C736 505.6 672 595.2 588.8 704z" />
                <path d="M512 416m-96 0a1.5 1.5 0 1 0 192 0 1.5 1.5 0 1 0-192 0Z" />
              </svg>
              <span css={style.locateLabel}>当前定位</span>
              <span css={style.locateName}>{locatedCity.name}</span>
            </Clickable>
          )}

          {/* 搜索结果 / 城市列表 / 空状态 */}
          {isSearching ? (
            searchResult!.length > 0 ? (
              <div css={style.searchList}>
                {searchResult!.map((item) => (
                  <Clickable
                    css={style.item}
                    key={item.code}
                    onClick={() => handleSelect(item)}
                  >
                    {item.name}
                  </Clickable>
                ))}
              </div>
            ) : (
              <div css={style.empty}>没有匹配的城市</div>
            )
          ) : (
            <div ref={listRef} css={style.list}>
              {letters.map((k) => {
                return (
                  // 每个字母对应一个区块，包含该字母开头的城市列表
                  <div
                    key={k}
                    ref={(el) => {
                      sectionRefs.current[k] = el;
                    }}
                  >
                    <div css={style.title}>{k.toUpperCase()}</div>
                    {cityData[k].map((item) => (
                      <Clickable
                        css={style.item}
                        key={item.code}
                        onClick={() => handleSelect(item)}
                      >
                        {item.name}
                      </Clickable>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </ColStart>

        {/* 导航字母（搜索时隐藏），放在 inner 内以便一起做滑入/滑出动画 */}
        {!isSearching && (
          <div ref={sidebarRef} css={style.sidebar}>
            {letters.map((k) => (
              <div
                key={k}
                css={[style.letter, activeLetter === k && style.letterActive]}
              >
                {k.toUpperCase()}
              </div>
            ))}
          </div>
        )}
        {/* 当前字母 */}
        {touching && activeLetter && !isSearching && (
          <div css={style.bigLetter}>{activeLetter.toUpperCase()}</div>
        )}
      </div>
    </div>
  );
}

export function showCitySelect(
  options: Pick<
    CitySelectProps,
    "onSelect" | "onLetterChange" | "getLocation" | "primary"
  > = {},
) {
  const container = createPortalDOM();
  container.mount(
    <CitySelect
      {...options}
      onClose={() => {
        container.unmount();
      }}
    />,
  );
}
