import { BREAKPOINTS } from "@/types/breakpoints"
import _ from "lodash";
import { useEffect, useState } from "react"

const isClient = typeof window !== "undefined"

function getScreenSize(): Record<keyof typeof BREAKPOINTS, boolean> {
  return Object.keys(BREAKPOINTS).reduce(
    (obj, key) =>
      Object.assign(obj, {
        [key]: isClient
          ? window.innerWidth >= BREAKPOINTS[key as keyof typeof BREAKPOINTS]
          : false,
      }),
    {} as Record<keyof typeof BREAKPOINTS, boolean>,
  )
}

export function useScreenSize(): Record<keyof typeof BREAKPOINTS, boolean> {
  const [screenSize, setScreenSize] = useState(getScreenSize())

  useEffect(() => {
    if (isClient) {
      window.addEventListener(
        "resize",
        _.throttle(() => setScreenSize(getScreenSize()), 1000),
      )
      return () => {
        window.removeEventListener(
          "resize",
          _.throttle(() => setScreenSize(getScreenSize()), 1000),
        )
      }
    }
    return undefined
  }, [])

  return screenSize
}
