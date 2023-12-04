import { useScreenSize } from "./useScreenSize"

export function useIsMobile(): boolean {
  const isScreenSize = useScreenSize()
  const isMobile = !isScreenSize["sm"]

  return isMobile
}
