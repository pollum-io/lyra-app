export const ProgressBar = ({ progress }: { progress: number }) => {
  const progressWidth = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="relative top-[24px] h-4 w-full max-w-[400px]">
      <div className="absolute top-[5px] h-1.5 w-full rounded-sm bg-gray-400 bg-opacity-25" />

      <div
        className="absolute top-0 h-4 items-center justify-center py-[5px]"
        style={{ width: `${progressWidth}%` }}
      >
        <div className="from-brandBlue-50 to-yellow h-1.5 w-full rounded-sm bg-gradient-to-r" />
      </div>
    </div>
  );
};
