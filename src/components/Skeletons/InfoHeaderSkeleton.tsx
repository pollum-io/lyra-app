import { Card } from "../Card";
import Skeleton from "./Skeleton";

export const InfoHeaderSkeleton = () => {
  return (
    <div className="flex h-full w-full items-end justify-between">
      <Card isSkeleton />
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="relative mt-6 h-10 w-[300px]">
          <Skeleton className="mb-2 h-3 w-1/2" />
          <Skeleton className="mb-2 h-3 w-full" />
        </div>
      </div>
      <Card isSkeleton isLeft />
    </div>
  );
};
