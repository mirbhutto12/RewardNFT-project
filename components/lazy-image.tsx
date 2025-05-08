"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

interface LazyImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  threshold?: number
  rootMargin?: string
}

export function LazyImage({ src, alt, threshold = 0.1, rootMargin = "0px", className, ...props }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!src) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        threshold,
        rootMargin,
      },
    )

    const element = document.querySelector(`[data-image-src="${src}"]`)
    if (element) {
      observer.observe(element)
    }

    return () => {
      observer.disconnect()
    }
  }, [src, threshold, rootMargin])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setError(true)
    setIsLoaded(true)
  }

  return (
    <div className={`relative ${className}`} data-image-src={src || "/placeholder.svg"}>
      {(!isInView || !isLoaded) && <Skeleton className="absolute inset-0" />}

      {isInView && (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          onLoadingComplete={handleLoad}
          onError={handleError}
          {...props}
        />
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
          <span className="text-sm text-gray-500">Failed to load image</span>
        </div>
      )}
    </div>
  )
}
