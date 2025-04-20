import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function ProductDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Skeleton className="h-6 w-32" />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Images Skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-md" />
            ))}
          </div>
        </div>

        {/* Product Details Skeleton */}
        <div className="space-y-6">
          <div>
            <Skeleton className="h-10 w-3/4 mb-2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>

          <Skeleton className="h-8 w-32" />

          <Separator />

          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-20" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>

            <div className="flex gap-4">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <Separator className="my-12" />
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
