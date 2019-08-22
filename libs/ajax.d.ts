import { AxiosRequestConfig } from "axios";
import { LoadingOption } from "./Loading";
export { default as rawRequest } from "axios";
export interface RequestLoadingOption extends LoadingOption<any> {
    minExistTime?: number;
}
export interface RequestOption extends AxiosRequestConfig {
    loading?: RequestLoadingOption | boolean;
    httpCache?: boolean;
    transmitParam?: boolean;
    transmitHashParam?: boolean;
}
/**
 * 发送ajax请求
 * @param option RequestOption
 */
export declare function request(option: RequestOption): Promise<import("axios").AxiosResponse<any>>;
