export const Card = ({
  text,
  value,
  isLeft = false,
}: {
  text: string;
  value: string;
  isLeft?: boolean;
}) => {
  return (
    <div className="border-brandBlue-300 bg-primary flex h-[110px] w-[460px] items-center justify-start rounded-xl border border-opacity-30">
      <div
        className={`inline-flex h-14 w-full flex-col ${
          isLeft ? "items-start" : "items-end"
        } justify-center gap-1 px-10`}
      >
        <div className="text-2xl font-semibold leading-loose text-white">
          ${value}
        </div>
        <div className=" text-sm font-normal leading-tight text-white">
          {text}
        </div>
      </div>
    </div>
  );
};
