export type CustomerTier = "enterprise" | "premium" | "basic"

export type CustomerStatus = "active" | "inactive" | "pending"

export interface ICustomer {
  id: string
  name: string
  tier: CustomerTier
  email: string
  phone: string
  company: string
  totalSpent: number
  status: CustomerStatus
}
