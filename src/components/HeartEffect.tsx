import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface FlyingHeart {
  id: number;
  startX: number;
  startY: number;
}

export function HeartEffect() {
  const [hearts, setHearts] = useState<FlyingHeart[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleHeartFly = (e: CustomEvent<{ x: number; y: number }>) => {
      const newHeart = {
        id: Date.now() + Math.random(),
        startX: e.detail.x,
        startY: e.detail.y,
      };
      setHearts((prev) => [...prev, newHeart]);

      // Remove after animation completes (1.2s)
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 1200);
    };

    window.addEventListener("heart-fly" as any, handleHeartFly);
    return () => window.removeEventListener("heart-fly" as any, handleHeartFly);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {hearts.map((heart) => (
        <HeartAnimation key={heart.id} {...heart} />
      ))}
    </div>
  );
}

function HeartAnimation({ startX, startY }: FlyingHeart) {
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const targetEl = document.getElementById("header-nav-my-course");
    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      setTargetPos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    } else {
      setTargetPos({ x: window.innerWidth / 2, y: 50 });
    }
  }, []);

  return (
    <div
      className="absolute animate-heart-fly"
      style={
        {
          "--start-x": `${startX}px`,
          "--start-y": `${startY}px`,
          "--target-x": `${targetPos.x - startX}px`,
          "--target-y": `${targetPos.y - startY}px`,
        } as any
      }
    >
      <Heart className="size-6 fill-rose-500 text-rose-500" />
    </div>
  );
}

export function triggerHeartFly(x: number, y: number) {
  const event = new CustomEvent("heart-fly", { detail: { x, y } });
  window.dispatchEvent(event);
}
