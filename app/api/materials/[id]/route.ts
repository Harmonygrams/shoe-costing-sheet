import { type NextRequest, NextResponse } from "next/server"
import { MongoDBStore } from "@/lib/models"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const material = await MongoDBStore.getMaterial(params.id)
    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 })
    }
    return NextResponse.json(material)
  } catch (error) {
    console.error("[v0] Error fetching material:", error)
    return NextResponse.json({ error: "Failed to fetch material" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const material = await MongoDBStore.updateMaterial(params.id, {
      category,
      name,
      unit,
      quantity,
      unitCost,
    })

    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 })
    }

    return NextResponse.json(material)
  } catch (error) {
    console.error("[v0] Error updating material:", error)
    return NextResponse.json({ error: "Failed to update material" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await MongoDBStore.deleteMaterial(params.id)
    if (!success) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Material deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting material:", error)
    return NextResponse.json({ error: "Failed to delete material" }, { status: 500 })
  }
}
