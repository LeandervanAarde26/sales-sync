export interface IMonthSales {
  month: string
  sales: number
  target: number
}

export interface ISalesRep {
  rep: string
  yearTarget: number
  sales: IMonthSales[]
}

export type RepStatus = "on_track" | "at_risk" | "behind"
