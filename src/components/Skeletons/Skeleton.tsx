import * as React from "react";

type SkeletonProps = React.ComponentPropsWithoutRef<"div">;

export default function Skeleton({ className, ...rest }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer ${className} rounded-lg`}
      style={{
        backgroundImage: `
          linear-gradient(
            to right, 
            #6cf0db 0%, 
            #edeef1 20%, 
            #f3e3ae 40%, 
            #f3e3ae 100%
          )`,
        backgroundSize: "700px 100%",
        backgroundRepeat: "no-repeat",
      }}
      {...rest}
    />
  );
}
