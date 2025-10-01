import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = dataStore.getProduct(params.id)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const materials = dataStore.getMaterials(params.id)
    const totalMaterialCost = dataStore.calculateProductCost(params.id)

    // Calculate additional costs
    const laborCostPercentage = 0.3
    const overheadPercentage = 0.15
    const laborCost = totalMaterialCost * laborCostPercentage
    const overheadCost = totalMaterialCost * overheadPercentage
    const totalProductionCost = totalMaterialCost + laborCost + overheadCost

    const costingBreakdown = {
      product,
      materials,
      materialCost: totalMaterialCost,
      laborCost,
      overheadCost,
      totalProductionCost,
      costPerPair: totalProductionCost,
      suggestedRetail: totalProductionCost * 2.5,
    }

    return NextResponse.json(costingBreakdown)
  } catch (error) {
    return NextResponse.json({ error: "Failed to calculate costing" }, { status: 500 })
  }
}
