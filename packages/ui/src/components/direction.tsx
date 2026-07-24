"use client"

import * as React from "react"

type Direction = "ltr" | "rtl"

const DirectionContext = React.createContext<Direction>("ltr")

function DirectionProvider({
  direction = "ltr",
  children,
}: {
  direction?: Direction
  children?: React.ReactNode
}) {
  return (
    <DirectionContext.Provider value={direction}>
      {children}
    </DirectionContext.Provider>
  )
}

function useDirection(): Direction {
  return React.useContext(DirectionContext)
}

export { DirectionProvider, useDirection }
