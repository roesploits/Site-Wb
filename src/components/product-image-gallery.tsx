"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  youtubeVideoId?: string;
}

export function ProductImageGallery({
  images,
  productName,
  youtubeVideoId,
}: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHoveringFirstImage, setIsHoveringFirstImage] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    // Reset video state when changing slides
    if (index !== 0) {
      setIsVideoPlaying(false);
    }
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  };

  // Handle hover on first image
  const handleFirstImageHover = () => {
    if (currentIndex === 0 && !isVideoPlaying) {
      setIsHoveringFirstImage(true);
    }
  };

  const handleFirstImageLeave = () => {
    setIsHoveringFirstImage(false);
  };

  // Handle play button click
  const handlePlayButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVideoPlaying(true);
    setIsHoveringFirstImage(false);
  };

  // Handle video close
  const handleVideoClose = () => {
    setIsVideoPlaying(false);
  };

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isVideoPlaying && e.key === "Escape") {
        handleVideoClose();
        return;
      }

      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isVideoPlaying]);

  // Auto-play functionality (optional) - pause when video is playing
  useEffect(() => {
    if (isVideoPlaying) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex, isVideoPlaying]);

  return (
    <div className="relative group">
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-3 sm:p-4 shadow-lg backdrop-blur-md overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full aspect-video overflow-hidden rounded-2xl sm:rounded-3xl">
          <div
            className="flex transition-transform duration-300 ease-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="w-full h-full flex-shrink-0 relative"
                onMouseEnter={index === 0 ? handleFirstImageHover : undefined}
                onMouseLeave={index === 0 ? handleFirstImageLeave : undefined}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${productName} - Image ${index + 1}`}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                {index === 0 &&
                  currentIndex === 0 &&
                  !isVideoPlaying &&
                  youtubeVideoId && (
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${
                        isHoveringFirstImage
                          ? "bg-black/50 backdrop-blur-sm opacity-100"
                          : "bg-transparent opacity-0 pointer-events-none"
                      }`}
                    >
                      <button
                        onClick={handlePlayButtonClick}
                        className={`playpause-button group/play relative w-20 h-20 bg-accent/80 hover:bg-accent rounded-full flex items-center justify-center shadow-2xl border-4 border-accent transition-all duration-500 ease-out hover:scale-110 hover:shadow-accent/30 ${
                          isHoveringFirstImage
                            ? "scale-100 opacity-100 translate-y-0"
                            : "scale-75 opacity-0 translate-y-4"
                        }`}
                      >
                        <Play
                          className="w-8 h-8 text-white ml-1 group-hover/play:scale-110 transition-transform duration-200"
                          fill="currentColor"
                        />

                        <div
                          className={`absolute inset-0 rounded-full border-2 border-accent transition-opacity duration-300 ${
                            isHoveringFirstImage
                              ? "animate-ping opacity-30"
                              : "opacity-0"
                          }`}
                        ></div>
                      </button>
                    </div>
                  )}
              </div>
            ))}
          </div>

          {currentIndex === 0 && isVideoPlaying && youtubeVideoId && (
            <div className="absolute inset-0 z-20 bg-black rounded-2xl sm:rounded-3xl overflow-hidden animate-in fade-in duration-300">
              <button
                onClick={handleVideoClose}
                className="absolute top-4 right-4 z-30 w-8 h-8 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
                title={`${productName} Video`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {!isVideoPlaying && (
            <>
              <Button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-15"
                disabled={isTransitioning}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <Button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-15"
                disabled={isTransitioning}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {!isVideoPlaying && (
            <div
              className={`absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm z-10 transition-all duration-300 ${
                isHoveringFirstImage && currentIndex === 0
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100"
              }`}
            >
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-accent w-6"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              disabled={isTransitioning}
            />
          ))}
        </div>
      </div>

      <div className="hidden lg:flex gap-2 mt-4 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${
              index === currentIndex
                ? "border-accent opacity-100 ring-2 ring-accent/30"
                : "border-white/20 opacity-60 hover:opacity-80 hover:border-accent/50"
            }`}
            disabled={isTransitioning}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`${productName} - Thumbnail ${index + 1}`}
              className="object-cover"
              sizes="80px"
            />

            {index === 0 && youtubeVideoId && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play className="w-4 h-4 text-accent" fill="currentColor" />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="lg:hidden text-center mt-2">
        <p className="text-xs text-gray-400">
          Swipe left or right to view more images • Hover first image to play
          video
        </p>
      </div>
    </div>
  );
}
