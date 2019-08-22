export interface LoadingOption<H> {
    type: "wave" | "helix";
    color?: string;
    hint?: H;
}
export declare class Loading<H> {
    container: HTMLDivElement;
    constructor(option: LoadingOption<H>);
    destroy(): void;
}
