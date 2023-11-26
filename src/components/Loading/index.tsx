import { RiLoader2Line } from "react-icons/ri"

export const Loading = ({ size }: { size: number }) => {
  return (
    <div className="rotate-260">
      <RiLoader2Line size={size} />
    </div>
  )
}
