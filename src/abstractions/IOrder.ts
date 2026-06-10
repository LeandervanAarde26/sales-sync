export type OrderStatus = "ordered" | "processing" | "shipped" | "completed" | "cancelled"

export interface IOrderItem {
  itemCode: string
  rollId?: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export interface IOrder {
  orderReference: string
  customerName: string
  status: OrderStatus
  orderDate: string
  warehouse: string
  items: IOrderItem[]
  subtotal: number
  discount: number
  tax: number
  totalAmountPaid: number
  currency: string
  paymentMethod: string
  trackingNumber?: string
  carrier?: string
  shippingCost?: number
  notes?: string
}
