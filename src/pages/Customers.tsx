import { useState } from "react"
import { CustomerCard } from "@/components/customer_card"
import { CustomerEditModal } from "@/components/customer_edit_modal"
import type { ICustomer } from "@/abstractions/ICustomer"
import customerJson from "@/mock_data/customer_data.json"

export default function Customers() {
  const [customers, setCustomers] = useState<ICustomer[]>(customerJson as ICustomer[])
  const [editingCustomer, setEditingCustomer] = useState<ICustomer | null>(null)

  function handleSave(updated: ICustomer) {
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    setEditingCustomer(null)
  }

  function handleDelete(id: string) {
    setCustomers((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {customers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onEdit={setEditingCustomer}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <CustomerEditModal
        customer={editingCustomer}
        onClose={() => setEditingCustomer(null)}
        onSave={handleSave}
      />
    </div>
  )
}
