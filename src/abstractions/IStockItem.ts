
export interface IStockItem {
  itemCode: string
  collection: string,
  whse: string,
  cut: number,
  roll: number,
  retail: number,
  /** Present when stock is tracked at roll level */
  rolls?: IRoll[],
  /** Present when stock is tracked as a flat quantity (no rolls) */
  qtyOnHand?: number,
}

export interface IRoll {
  rollId: string,
  qtyOnHand: number,
  dyeLot: string,
  expiry: string,
}