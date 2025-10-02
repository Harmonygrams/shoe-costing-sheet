import { type NextRequest, NextResponse } from "next/server"
import { MongoDBStore } from "@/lib/models"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await MongoDBStore.getProduct(params.id)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    console.error("[v0] Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, photo } = body

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const product = await MongoDBStore.updateProduct(params.id, { name, photo })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("[v0] Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await MongoDBStore.deleteProduct(params.id)
    if (!success) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
