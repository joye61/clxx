import {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { showDialog } from "../Dialog";
import { Clickable } from "../Clickable";
import { createStyle, DEFAULT_PRIMARY } from "./style";
import { treeRegionData, TreeRegionItem } from "./data";

export type { TreeRegionItem } from "./data";

// 港澳台对应的顶层省级 value（台湾、香港、澳门）
const HK_MO_TW_VALUES: ReadonlySet<string> = new Set([
  "710000",
  "810000",
  "820000",
]);

// 已选项（单级）
export interface RegionNode {
  value: string;
  label: string;
}

// 完整选择结果（三级，部分城市无区级时 district 为空）
export interface RegionSelection {
  province: RegionNode;
  city: RegionNode;
  district: RegionNode | null;
}

// 级别标签文案
export interface RegionLabels {
  province?: string;
  city?: string;
  district?: string;
}

const DEFAULT_LABELS: Required<RegionLabels> = {
  province: "省",
  city: "市",
  district: "区",
};

export interface RegionPickerProps {
  // 初始选中值（三级 value 数组）
  value?: [string?, string?, string?];
  // 数据源，默认中国行政区
  data?: TreeRegionItem[];
  // 头部标题
  title?: ReactNode;
  cancelText?: ReactNode;
  confirmText?: ReactNode;
  // tabs 未选中时的占位文案
  labels?: RegionLabels;
  // 点击遮罩是否可关闭（仅在通过 showRegionPicker 弹出时生效）
  maskClosable?: boolean;
  // 主题主色
  primary?: string;
  // 是否圆角，默认 true
  rounded?: boolean;
  // 是否含港澳台（香港/澳门/台湾），默认 false；false 时这些顶层省份不会出现在列表中
  taiwanHKMacau?: boolean;
  // 弹出动画结束后调用，实际卸载交由外部（showRegionPicker）处理
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm?: (selection: RegionSelection) => void;
}

type TabKey = "province" | "city" | "district";
const TAB_ORDER: TabKey[] = ["province", "city", "district"];

export function RegionPicker(props: RegionPickerProps) {
  const {
    value,
    data = treeRegionData,
    title = "请选择地区",
    cancelText = "取消",
    confirmText = "确定",
    labels,
    primary = DEFAULT_PRIMARY,
    rounded = true,
    taiwanHKMacau = false,
    onClose,
    onCancel,
    onConfirm,
  } = props;

  const style = useMemo(
    () => createStyle(primary, rounded),
    [primary, rounded],
  );

  // 过滤后的顶层数据：仅在 data / taiwanHKMacau 变化时重建
  const effectiveData = useMemo<TreeRegionItem[]>(
    () =>
      taiwanHKMacau
        ? data
        : data.filter((x) => !HK_MO_TW_VALUES.has(x.value)),
    [data, taiwanHKMacau],
  );

  const lab = useMemo(
    () => ({ ...DEFAULT_LABELS, ...labels }),
    [labels],
  );

  // === 选中状态 ===
  // 当前每级选中节点；未选为 null
  const [provinceNode, setProvinceNode] = useState<TreeRegionItem | null>(null);
  const [cityNode, setCityNode] = useState<TreeRegionItem | null>(null);
  const [districtNode, setDistrictNode] = useState<TreeRegionItem | null>(null);
  // 当前激活 tab
  const [activeTab, setActiveTab] = useState<TabKey>("province");

  // 初始化 / data 恢复选中里允许 city 无 children（部分地区没有区级）
  useEffect(() => {
    if (!value) return;
    const [pv, cv, dv] = value;
    const p = effectiveData.find((x) => x.value === pv) ?? null;
    const c = p?.children?.find((x) => x.value === cv) ?? null;
    const d = c?.children?.find((x) => x.value === dv) ?? null;
    setProvinceNode(p);
    setCityNode(c);
    setDistrictNode(d);
    // 定位 activeTab 到「最深的未选层」；
    // 如果选中的市无 children，则停在 city
    if (!p) setActiveTab("province");
    else if (!c) setActiveTab("city");
    else if (!c.children || c.children.length === 0) setActiveTab("city");
    else setActiveTab("district");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 当前 tab 对应的待选列表
  const currentList: TreeRegionItem[] = useMemo(() => {
    if (activeTab === "province") return effectiveData;
    if (activeTab === "city") return provinceNode?.children ?? [];
    return cityNode?.children ?? [];
  }, [activeTab, effectiveData, provinceNode, cityNode]);

  const selectedValueOfTab = (tab: TabKey): string | null => {
    if (tab === "province") return provinceNode?.value ?? null;
    if (tab === "city") return cityNode?.value ?? null;
    return districtNode?.value ?? null;
  };

  // tab 是否可点击：上级已选；district 额外要求 city 有子级
  const tabEnabled = (tab: TabKey): boolean => {
    if (tab === "province") return true;
    if (tab === "city") return !!provinceNode;
    return !!(cityNode && cityNode.children && cityNode.children.length > 0);
  };

  // 点击列表项
  const handlePick = (item: TreeRegionItem) => {
    if (activeTab === "province") {
      // 换省 => 清空下级
      if (provinceNode?.value !== item.value) {
        setProvinceNode(item);
        setCityNode(null);
        setDistrictNode(null);
      }
      // 自动进入下一级；若无子级则停留
      if (item.children && item.children.length > 0) {
        setActiveTab("city");
      }
    } else if (activeTab === "city") {
      if (cityNode?.value !== item.value) {
        setCityNode(item);
        setDistrictNode(null);
      }
      if (item.children && item.children.length > 0) {
        setActiveTab("district");
      }
    } else {
      setDistrictNode(item);
    }
  };

  const handleTabClick = (tab: TabKey) => {
    if (!tabEnabled(tab)) return;
    setActiveTab(tab);
  };

  // 切 tab / 列表变化时，把当前选中项的顶部对齐到列表顶部（即 tabs 下方的分隔线）
  // 列表不可滚动时浏览器自然忽略 scrollTop 赋值，无需额外判断
  const listRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const sel = selectedValueOfTab(activeTab);
    if (!sel) {
      el.scrollTop = 0;
      return;
    }
    const target = el.querySelector<HTMLDivElement>(
      `[data-value="${CSS.escape(sel)}"]`,
    );
    if (!target) {
      el.scrollTop = 0;
      return;
    }
    // 用 getBoundingClientRect 差分计算偏移，避免 offsetTop 受
    // offsetParent 定位上下文影响（list 容器未必是 positioned 元素）
    const offsetWithinList =
      target.getBoundingClientRect().top -
      el.getBoundingClientRect().top +
      el.scrollTop;
    const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
    el.scrollTop = Math.max(0, Math.min(offsetWithinList, maxScroll));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentList]);

  // ---------------- 关闭逻辑 ----------------
  // 动画与卸载交由 Dialog 处理

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  const canConfirm = !!(
    provinceNode &&
    cityNode &&
    (!cityNode.children || cityNode.children.length === 0 || districtNode)
  );

  const handleConfirm = () => {
    if (!canConfirm) return;
    if (!provinceNode || !cityNode) return;
    onConfirm?.({
      province: { value: provinceNode.value, label: provinceNode.label },
      city: { value: cityNode.value, label: cityNode.label },
      district: districtNode
        ? { value: districtNode.value, label: districtNode.label }
        : null,
    });
    onClose?.();
  };

  const tabLabelText = (tab: TabKey): ReactNode => {
    if (tab === "province")
      return provinceNode ? provinceNode.label : lab.province;
    if (tab === "city") return cityNode ? cityNode.label : lab.city;
    return districtNode ? districtNode.label : lab.district;
  };

  const isTabPlaceholder = (tab: TabKey): boolean => {
    if (tab === "province") return !provinceNode;
    if (tab === "city") return !cityNode;
    return !districtNode;
  };

  return (
    <div css={style.sheet}>
      <div css={style.header}>
        <Clickable css={[style.btn, style.btnCancel]} onClick={handleCancel}>
          {cancelText}
        </Clickable>
        <div css={style.title}>{title}</div>
        <Clickable
          css={[
            style.btn,
            style.btnConfirm,
            !canConfirm && style.btnConfirmDisabled,
          ]}
          onClick={handleConfirm}
        >
          {confirmText}
        </Clickable>
      </div>
      <div css={style.tabs}>
        {TAB_ORDER.map((tab) => (
          <div
            key={tab}
            css={[
              style.tab,
              isTabPlaceholder(tab) && style.tabPlaceholder,
              activeTab === tab && style.tabActive,
            ]}
            onClick={() => handleTabClick(tab)}
          >
            {tabLabelText(tab)}
          </div>
        ))}
      </div>
      <div css={style.list} ref={listRef}>
        {currentList.length === 0 ? (
          <div css={style.empty}>暂无数据</div>
        ) : (
          currentList.map((item) => {
            const selected = selectedValueOfTab(activeTab) === item.value;
            return (
              <Clickable
                key={item.value}
                data-value={item.value}
                css={[style.listItem, selected && style.listItemSelected]}
                onClick={() => handlePick(item)}
              >
                <div css={style.listItemLabel}>{item.label}</div>
                {selected && <div css={style.checkIcon} />}
              </Clickable>
            );
          })
        )}
      </div>
    </div>
  );
}

export function showRegionPicker(
  options: Pick<
    RegionPickerProps,
    | "value"
    | "data"
    | "title"
    | "cancelText"
    | "confirmText"
    | "labels"
    | "maskClosable"
    | "primary"
    | "rounded"
    | "taiwanHKMacau"
    | "onCancel"
    | "onConfirm"
  > = {},
) {
  const { maskClosable = true, onCancel, ...rest } = options;

  let closing = false;
  let close: (() => Promise<void>) | undefined;
  const requestClose = () => {
    if (closing) return;
    closing = true;
    close?.();
  };

  close = showDialog({
    type: "pullUp",
    blankClosable: maskClosable,
    onBlankClick: () => {
      onCancel?.();
    },
    content: (
      <RegionPicker {...rest} onCancel={onCancel} onClose={requestClose} />
    ),
  });
}
