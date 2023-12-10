export const Apr = ({
  aprPercent = 0,
  aprMax = 0,
}: {
  aprPercent: number;
  aprMax: number;
}) => {
  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - (aprPercent / aprMax));

  return (
    <div className=" flex h-[150px] w-[150px] items-center justify-center overflow-hidden rounded-full">
      <svg className="h-full w-full" viewBox="0 0 150 150">
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#6cf0db", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#f3e3ae", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
        <circle
          className="text-gray-400"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="75"
          cy="75"
        />
        <circle
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={-strokeDashoffset}
          strokeLinecap="round"
          stroke="url(#progressGradient)"
          fill="transparent"
          r={radius}
          cx="75"
          cy="75"
          transform="rotate(-90 75 75)"
        />
      </svg>
      <div className="absolute inline-flex h-[52px] w-full max-w-[72px] transform flex-col items-center justify-center">
        <div className="text-center text-2xl font-semibold leading-loose text-white">
          {`${aprPercent.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}%`}
        </div>
        <div className="text-center text-sm font-normal leading-tight text-white">
          APR Liquid
        </div>
      </div>
    </div>
  );
};
