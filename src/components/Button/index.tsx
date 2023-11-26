import { useMemo } from "react";
import { Loading } from "../Loading";

interface Props {
  maxWidth?: string;
  height?: string;
  textSize?: string;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: JSX.Element;
  onClick?: () => void;
  text: string;
  type?: "button" | "reset" | "submit" | undefined;
  outline?: boolean;
}

export const Button = ({
  maxWidth,
  height = "h-[45px]",
  textSize = "text-lg",
  isLoading = false,
  disabled = false,
  icon,
  onClick,
  text,
  type = "button",
  outline = false,
}: Props) => {
  const disable = useMemo(() => disabled || isLoading, [disabled, isLoading]);

  return (
    <button
      type={type}
      className={`${maxWidth} w-full ${height} px-6 py-4 ${
        outline ? "border-brandBlue-200 border" : "bg-brandBlue-200"
      } flex items-center justify-center gap-2.5 rounded-[5px] ${
        disable ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <Loading size={22} />
      ) : (
        <>
          {icon}
          <div className={`${textSize} font-bold text-white`}>{text}</div>
        </>
      )}
    </button>
  );
};
