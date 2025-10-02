export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="h-10 w-64 bg-muted animate-pulse rounded-md" />
        <div className="grid grid-cols-1 gap-4">
          <div className="h-24 w-full bg-muted animate-pulse rounded-md" />
          <div className="h-48 w-full bg-muted animate-pulse rounded-md" />
          <div className="h-64 w-full bg-muted animate-pulse rounded-md" />
        </div>
      </div>
    </div>
  )
}

