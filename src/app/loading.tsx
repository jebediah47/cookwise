import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="space-y-4">
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-64 w-full" />
        </div>
    </div>
  )
}
