"use client"

import Image from "next/image"
import { useState } from "react"

interface ImageWithFallbackProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  fill,
  className,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      onError={() => setImgSrc("/placeholder.svg?height=300&width=300")}
    />
  )
} 