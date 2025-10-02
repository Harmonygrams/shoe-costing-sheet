import { type NextRequest, NextResponse } from "next/server"
import { MongoDBStore } from "@/lib/models"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await MongoDBStore.getProduct(params.id)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const materials = await MongoDBStore.getMaterials(params.id)
    const totalMaterialCost = await MongoDBStore.calculateProductCost(params.id)

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
    console.error("[v0] Error calculating costing:", error)
    return NextResponse.json({ error: "Failed to calculate costing" }, { status: 500 })
  }
}
