import { type NextRequest, NextResponse } from "next/server"
import { MongoDBStore } from "@/lib/models"

export async function GET() {
  try {
    const products = await MongoDBStore.getProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, photo } = body

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const product = await MongoDBStore.addProduct({ name, photo })
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
