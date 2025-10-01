"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Material } from "@/lib/types"
import { MATERIAL_CATEGORIES, COMMON_UNITS } from "@/lib/types"

interface MaterialFormProps {
  productId: string
  material?: Material
  onSubmit: (data: {
    category: string
    name: string
    unit: string
    quantity: number
    unitCost: number
  }) => void
  onCancel?: () => void
}

export function MaterialForm({ productId, material, onSubmit, onCancel }: MaterialFormProps) {
  const [category, setCategory] = useState(material?.category || "")
  const [name, setName] = useState(material?.name || "")
  const [unit, setUnit] = useState(material?.unit || "")
  const [quantity, setQuantity] = useState(material?.quantity?.toString() || "")
  const [unitCost, setUnitCost] = useState(material?.unitCost?.toString() || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!category || !name.trim() || !unit || !quantity || !unitCost) return

    const quantityNum = Number.parseFloat(quantity)
    const unitCostNum = Number.parseFloat(unitCost)

    if (isNaN(quantityNum) || isNaN(unitCostNum) || quantityNum <= 0 || unitCostNum < 0) return

    onSubmit({
      category,
      name: name.trim(),
      unit,
      quantity: quantityNum,
      unitCost: unitCostNum,
    })

    if (!material) {
      // Reset form for new materials
      setCategory("")
      setName("")
      setUnit("")
      setQuantity("")
      setUnitCost("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{material ? "Edit Material" : "Add New Material"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {MATERIAL_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Material Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Leather, Rubber sole"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {COMMON_UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                min="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitCost">Unit Cost (Rs)</Label>
              <Input
                id="unitCost"
                type="number"
                step="0.01"
                min="0"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit">{material ? "Update Material" : "Add Material"}</Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
