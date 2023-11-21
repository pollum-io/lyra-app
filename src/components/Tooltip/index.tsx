export const TooltipContainer = ({ children }: any) => {
  return (
    <div className='pointer-events-auto absolute left-1/2 max-w-xs -translate-x-1/2 cursor-default break-words rounded-lg border border-gray-300 bg-white p-2 text-xs font-normal leading-4 text-black shadow'>
      {children}
    </div>
  );
};
