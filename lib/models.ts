import { ObjectId } from "mongodb"
import { getDatabase } from "./mongodb"
import type { Product, Material } from "./types"

// MongoDB document types (with _id instead of id)
export interface ProductDocument extends Omit<Product, "id"> {
  _id: ObjectId
}

export interface MaterialDocument {
  _id: ObjectId
  productId: string
  category: string
  name: string
  unit: string
  quantity: number
  unitCost: number
  totalCost: number
  createdAt: Date
  updatedAt: Date
}

// Helper functions to convert between MongoDB documents and app types
export function productFromDocument(doc: ProductDocument): Product {
  return {
    id: doc._id.toString(),
    name: doc.name,
    photo: doc.photo,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

export function materialFromDocument(doc: MaterialDocument): Material {
  return {
    id: doc._id.toString(),
    productId: doc.productId,
    category: doc.category,
    name: doc.name,
    unit: doc.unit,
    quantity: doc.quantity,
    unitCost: doc.unitCost,
    totalCost: doc.totalCost,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

// Collection names
export const COLLECTIONS = {
  PRODUCTS: "products",
  MATERIALS: "materials",
} as const

// Database operations
export class MongoDBStore {
  // Product operations
  static async getProducts(): Promise<Product[]> {
    const db = await getDatabase()
    const products = await db.collection<ProductDocument>(COLLECTIONS.PRODUCTS).find({}).toArray()
    return products.map(productFromDocument)
  }

  static async getProduct(id: string): Promise<Product | null> {
    const db = await getDatabase()
    const product = await db.collection<ProductDocument>(COLLECTIONS.PRODUCTS).findOne({ _id: new ObjectId(id) })
    return product ? productFromDocument(product) : null
  }

  static async addProduct(data: { name: string; photo?: string }): Promise<Product> {
    const db = await getDatabase()
    const now = new Date()

    const productData: Omit<ProductDocument, "_id"> = {
      name: data.name,
      photo: data.photo,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection<ProductDocument>(COLLECTIONS.PRODUCTS).insertOne(productData as any)

    return {
      id: result.insertedId.toString(),
      name: data.name,
      photo: data.photo,
      createdAt: now,
      updatedAt: now,
    }
  }

  static async updateProduct(id: string, data: { name: string; photo?: string }): Promise<Product | null> {
    const db = await getDatabase()
    const now = new Date()

    const result = await db
      .collection<ProductDocument>(COLLECTIONS.PRODUCTS)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { name: data.name, photo: data.photo, updatedAt: now } },
        { returnDocument: "after" },
      )

    return result ? productFromDocument(result) : null
  }

  static async deleteProduct(id: string): Promise<boolean> {
    const db = await getDatabase()

    // Delete all materials associated with this product
    await db.collection(COLLECTIONS.MATERIALS).deleteMany({ productId: id })

    // Delete the product
    const result = await db.collection(COLLECTIONS.PRODUCTS).deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  // Material operations
  static async getMaterials(productId: string): Promise<Material[]> {
    const db = await getDatabase()
    const materials = await db.collection<MaterialDocument>(COLLECTIONS.MATERIALS).find({ productId }).toArray()
    return materials.map(materialFromDocument)
  }

  static async getMaterial(id: string): Promise<Material | null> {
    const db = await getDatabase()
    const material = await db.collection<MaterialDocument>(COLLECTIONS.MATERIALS).findOne({ _id: new ObjectId(id) })
    return material ? materialFromDocument(material) : null
  }

  static async addMaterial(data: {
    productId: string
    category: string
    name: string
    unit: string
    quantity: number
    unitCost: number
  }): Promise<Material> {
    const db = await getDatabase()
    const totalCost = data.quantity * data.unitCost
    const now = new Date()

    const materialData: Omit<MaterialDocument, "_id"> = {
      productId: data.productId,
      category: data.category,
      name: data.name,
      unit: data.unit,
      quantity: data.quantity,
      unitCost: data.unitCost,
      totalCost,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection<MaterialDocument>(COLLECTIONS.MATERIALS).insertOne(materialData as any)

    return {
      id: result.insertedId.toString(),
      productId: data.productId,
      category: data.category,
      name: data.name,
      unit: data.unit,
      quantity: data.quantity,
      unitCost: data.unitCost,
      totalCost,
      createdAt: now,
      updatedAt: now,
    }
  }

  static async updateMaterial(
    id: string,
    data: {
      category: string
      name: string
      unit: string
      quantity: number
      unitCost: number
    },
  ): Promise<Material | null> {
    const db = await getDatabase()
    const totalCost = data.quantity * data.unitCost
    const now = new Date()

    const result = await db.collection<MaterialDocument>(COLLECTIONS.MATERIALS).findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          category: data.category,
          name: data.name,
          unit: data.unit,
          quantity: data.quantity,
          unitCost: data.unitCost,
          totalCost,
          updatedAt: now,
        },
      },
      { returnDocument: "after" },
    )

    return result ? materialFromDocument(result) : null
  }

  static async deleteMaterial(id: string): Promise<boolean> {
    const db = await getDatabase()
    const result = await db.collection(COLLECTIONS.MATERIALS).deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  static async calculateProductCost(productId: string): Promise<number> {
    const materials = await this.getMaterials(productId)
    return materials.reduce((sum, material) => sum + material.totalCost, 0)
  }
}
