import React from "react";
export interface LoadingOption {
    type: "wave" | "helix";
    color: string;
    hint?: string | React.ReactElement;
}
export declare class Loading {
    container: HTMLDivElement;
    constructor(option: LoadingOption);
    destroy(): void;
}
