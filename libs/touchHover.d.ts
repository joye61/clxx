export declare type HoverOption = {
    allowBubbling?: boolean;
    defaultHoverClass?: string;
};
export interface Hover {
    attach: (option: HoverOption) => void;
    detach: () => void;
}
export declare const touchHover: Hover;
