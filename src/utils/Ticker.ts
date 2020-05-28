export interface TickValue {

}

export interface TickerOption {
  remain?: number | string;
  onTick?: (value: TickValue) => void;
}

export class Ticker {
  constructor(option: TickerOption){

  }
}