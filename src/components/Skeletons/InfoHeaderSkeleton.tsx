import { Card } from "../Card";
import Skeleton from "./Skeleton";

export const InfoHeaderSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col items-end justify-between gap-6 lg:flex-row lg:gap-0">
      <div className="flex h-full w-full flex-col items-center justify-center lg:hidden">
        <div className="relative mt-6 h-10 w-[300px]">
          <Skeleton className="mb-2 h-3 w-1/2" />
          <Skeleton className="mb-2 h-3 w-full" />
        </div>
      </div>
      <Card isSkeleton />
      <div className="hidden h-full w-full flex-col items-center justify-center lg:flex">
        <div className="relative mt-6 h-10 w-[300px]">
          <Skeleton className="mb-2 h-3 w-1/2" />
          <Skeleton className="mb-2 h-3 w-full" />
        </div>
      </div>
      <Card isSkeleton isLeft />
    </div>
  );
};
