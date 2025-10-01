import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const material = dataStore.getMaterial(params.id)
    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 })
    }
    return NextResponse.json(material)
  } catch (error) {
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

    const material = dataStore.updateMaterial(params.id, {
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
    return NextResponse.json({ error: "Failed to update material" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = dataStore.deleteMaterial(params.id)
    if (!success) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Material deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete material" }, { status: 500 })
  }
}
