import { type NextRequest, NextResponse } from "next/server"
import { MongoDBStore } from "@/lib/models"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const materials = await MongoDBStore.getMaterials(params.id)
    return NextResponse.json(materials)
  } catch (error) {
    console.error("[v0] Error fetching materials:", error)
    return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { category, name, unit, quantity, unitCost } = body

    // Validate required fields
    if (!category || !name || !unit || quantity === undefined || unitCost === undefined) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate numeric fields
    if (typeof quantity !== "number" || typeof unitCost !== "number" || quantity <= 0 || unitCost < 0) {
      return NextResponse.json({ error: "Invalid quantity or unit cost" }, { status: 400 })
    }

    // Check if product exists
    const product = await MongoDBStore.getProduct(params.id)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const material = await MongoDBStore.addMaterial({
      productId: params.id,
      category,
      name,
      unit,
      quantity,
      unitCost,
    })

    return NextResponse.json(material, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating material:", error)
    return NextResponse.json({ error: "Failed to create material" }, { status: 500 })
  }
}
