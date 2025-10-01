"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Printer } from "lucide-react"
import type { Product, Material } from "@/lib/types"
import { formatCurrency } from "@/lib/currency"
import { useState } from "react"

interface CostingSheetProps {
  product: Product
  materials: Material[]
}

export function CostingSheet({ product, materials }: CostingSheetProps) {
  const [quantity, setQuantity] = useState(1)
  const [overheadPercentage, setOverheadPercentage] = useState(15)
  const [laborPercentage, setLaborPercentage] = useState(30)

  const totalMaterialCost = materials.reduce((sum, material) => sum + material.quantity * material.unitCost, 0)

  const materialsByCategory = materials.reduce(
    (acc, material) => {
      if (!acc[material.category]) {
        acc[material.category] = []
      }
      acc[material.category].push(material)
      return acc
    },
    {} as Record<string, Material[]>,
  )

  const categoryTotals = Object.entries(materialsByCategory).map(([category, categoryMaterials]) => ({
    category,
    total: categoryMaterials.reduce((sum, m) => sum + m.quantity * m.unitCost, 0),
    materials: categoryMaterials,
  }))

  const costPerPair = totalMaterialCost

  const laborCost = totalMaterialCost * (laborPercentage / 100)
  const overheadCost = totalMaterialCost * (overheadPercentage / 100)
  const totalProductionCostPerUnit = totalMaterialCost + laborCost + overheadCost
  const totalProductionCost = totalProductionCostPerUnit * quantity
  const totalMaterialCostForQuantity = totalMaterialCost * quantity

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    alert("Export functionality would be implemented here")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Costing Sheet</CardTitle>
              <p className="text-muted-foreground mt-1">
                Product: {product.name} | Generated: {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Production Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Production Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (Pairs)</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="labor">Labor Cost (%)</Label>
              <Input
                id="labor"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={laborPercentage}
                onChange={(e) => setLaborPercentage(Math.max(0, Number.parseFloat(e.target.value) || 0))}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="overhead">Overhead Cost (%)</Label>
              <Input
                id="overhead"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={overheadPercentage}
                onChange={(e) => setOverheadPercentage(Math.max(0, Number.parseFloat(e.target.value) || 0))}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Material Breakdown by Category */}
      <div className="space-y-4">
        {categoryTotals.map(({ category, total, materials: categoryMaterials }) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span>{category}</span>
                <Badge variant="secondary">{formatCurrency(total * quantity)}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Cost per Unit</TableHead>
                    <TableHead>Total Cost ({quantity}x)</TableHead>
                    <TableHead>% of Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryMaterials.map((material) => {
                    const materialTotal = material.quantity * material.unitCost
                    const materialTotalForQuantity = materialTotal * quantity
                    const percentageOfCategory = total > 0 ? (materialTotal / total) * 100 : 0
                    return (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.name}</TableCell>
                        <TableCell>
                          {material.quantity} {material.unit}
                        </TableCell>
                        <TableCell>{formatCurrency(material.unitCost)}</TableCell>
                        <TableCell>{formatCurrency(materialTotal)}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(materialTotalForQuantity)}</TableCell>
                        <TableCell>{percentageOfCategory.toFixed(1)}%</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cost Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Material Cost (per unit):</span>
              <span className="font-semibold">{formatCurrency(totalMaterialCost)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Material Cost (total for {quantity}):</span>
              <span className="font-semibold">{formatCurrency(totalMaterialCostForQuantity)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Labor Cost ({laborPercentage}%):</span>
              <span>{formatCurrency(laborCost * quantity)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Overhead ({overheadPercentage}%):</span>
              <span>{formatCurrency(overheadCost * quantity)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Production Cost:</span>
              <span className="text-primary">{formatCurrency(totalProductionCost)}</span>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formatCurrency(costPerPair)}</div>
              <div className="text-sm text-muted-foreground">Material Cost per Pair</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formatCurrency(totalProductionCostPerUnit)}</div>
              <div className="text-sm text-muted-foreground">Total Cost per Pair</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalProductionCostPerUnit * 2.5)}
              </div>
              <div className="text-sm text-muted-foreground">Suggested Retail (2.5x)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Category Breakdown</h4>
              <div className="space-y-2">
                {categoryTotals.map(({ category, total }) => {
                  const percentage = totalMaterialCost > 0 ? (total / totalMaterialCost) * 100 : 0
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm">{category}:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="text-sm font-medium w-12">{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {materials.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Top Cost Drivers</h4>
                <div className="space-y-1">
                  {materials
                    .map((material) => ({
                      ...material,
                      total: material.quantity * material.unitCost,
                    }))
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 3)
                    .map((material, index) => (
                      <div key={material.id} className="flex items-center justify-between text-sm">
                        <span>
                          {index + 1}. {material.name}
                        </span>
                        <span className="font-medium">{formatCurrency(material.total)}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
