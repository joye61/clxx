export interface DefaultDataItem {
  name: string;
  code: string;
}

export interface DefaultDataMap {
  [code: string]: Array<DefaultDataItem>;
}
