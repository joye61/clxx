import React from "react";
export interface ClickableProps {
    children?: React.ReactNode;
    onPress?: () => void;
    [key: string]: any;
}
export declare function Clickable(props: ClickableProps): JSX.Element;
