"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2 } from "lucide-react"
import type { Material } from "@/lib/types"
import { formatCurrency } from "@/lib/currency"

interface MaterialListProps {
  materials: Material[]
  onEdit: (material: Material) => void
  onDelete: (materialId: string) => void
}

export function MaterialList({ materials, onEdit, onDelete }: MaterialListProps) {
  const totalCost = materials.reduce((sum, material) => sum + material.quantity * material.unitCost, 0)

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

  if (materials.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No materials added yet. Add materials to calculate costs.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(materialsByCategory).map(([category, categoryMaterials]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{category}</span>
              <Badge variant="secondary">
                {formatCurrency(categoryMaterials.reduce((sum, m) => sum + m.quantity * m.unitCost, 0))}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryMaterials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.name}</TableCell>
                    <TableCell>
                      {material.quantity} {material.unit}
                    </TableCell>
                    <TableCell>{formatCurrency(material.unitCost)}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(material.quantity * material.unitCost)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => onEdit(material)}>
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => onDelete(material.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Material Cost:</span>
            <span className="text-2xl font-bold text-primary">{formatCurrency(totalCost)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
