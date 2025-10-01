"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Product } from "@/lib/types"

interface ProductFormProps {
  product?: Product
  onSubmit: (data: { name: string; photo?: string }) => void
  onCancel?: () => void
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [name, setName] = useState(product?.name || "")
  const [photo, setPhoto] = useState(product?.photo || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onSubmit({
      name: name.trim(),
      photo: photo.trim() || undefined,
    })

    if (!product) {
      // Reset form for new products
      setName("")
      setPhoto("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Photo URL (Optional)</Label>
            <Input
              id="photo"
              type="url"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit">{product ? "Update Product" : "Add Product"}</Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
