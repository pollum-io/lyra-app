import Skeleton from "../Skeletons/Skeleton";

export const Card = ({
  text,
  value,
  isLeft = false,
  isSkeleton = false,
}: {
  text?: string;
  value?: string;
  isLeft?: boolean;
  isSkeleton?: boolean;
}) => {
  return (
    <div className="border-brandBlue-300 bg-primary flex h-[110px] w-full max-w-[360px] items-center justify-start rounded-xl border border-opacity-30">
      <div
        className={`inline-flex h-14 w-full flex-col ${
          isLeft ? "item-center lg:items-start" : "item-center lg:items-end"
        } justify-center gap-1 px-10`}
      >
        {isSkeleton ? (
          <>
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-2 h-3 w-1/2" />
          </>
        ) : (
          <>
            <div className="text-2xl font-semibold leading-loose text-white">
              {value}
            </div>
            <div className=" text-sm font-normal leading-tight text-white">
              {text}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
