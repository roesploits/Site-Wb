import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function ChristmasDecorations() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
      aria-hidden="true"
    >
      {/* Snowflakes */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute top-[-20px] bg-white rounded-full animate-snow"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            animationDuration: `${Math.random() * 10 + 5}s`,
            animationDelay: `-${Math.random() * 10}s`,
            opacity: Math.random() * 0.4 + 0.2,
          }}
        />
      ))}
    </div>,
    document.body
  );
}
