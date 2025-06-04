"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useEffect } from "react";

interface ParticlesProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  color?: string;
  vx?: number;
  vy?: number;
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const hexInt = parseInt(hex, 16);
  const red = (hexInt >> 16) & 255;
  const green = (hexInt >> 8) & 255;
  const blue = hexInt & 255;
  return [red, green, blue];
}

type Circle = {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
};

export const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  const rafID = useRef<number | null>(null);

  const circleParams = React.useCallback((): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const pSize = Math.floor(Math.random() * 2) + size;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.1;
    const dy = (Math.random() - 0.5) * 0.1;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  }, [canvasSize, size]);

  const rgb = hexToRgb(color);

  const drawCircle = React.useCallback((circle: Circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  }, [context, dpr, rgb, circles]);

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h,
      );
    }
  };

  // drawParticles is no longer needed as a separate callback. Inline its logic where needed or remove if not used.

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number,
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;

    if (canvas && container) {
      const ctx = canvas.getContext("2d");
      context.current = ctx;

      const resizeCanvas = () => {
        canvasSize.current.w = container.offsetWidth;
        canvasSize.current.h = container.offsetHeight;
        canvas.width = canvasSize.current.w * dpr;
        canvas.height = canvasSize.current.h * dpr;
        if (ctx) {
          ctx.scale(dpr, dpr);
        }
      };

      resizeCanvas();

      window.addEventListener("resize", resizeCanvas);

      for (let i = 0; i < quantity; i++) {
        drawCircle(circleParams());
      }

      const animate = () => {
        clearContext();
        circles.current.forEach((circle: Circle) => {
          const edge = [
            circle.x + circle.translateX - circle.size, // distance from left edge
            canvasSize.current.w - circle.x - circle.translateX - circle.size, // distance from right edge
            circle.y + circle.translateY - circle.size, // distance from top edge
            canvasSize.current.h - circle.y - circle.translateY - circle.size, // distance from bottom edge
          ];
          const closestEdge = edge.reduce((a, b) => Math.min(a, b));
          const remapClosestEdge = parseFloat(
            remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
          );
          if (remapClosestEdge > 1) {
            circle.alpha += 0.02;
            if (circle.alpha > circle.targetAlpha) {
              circle.alpha = circle.targetAlpha;
            }
          } else {
            circle.alpha = circle.targetAlpha * remapClosestEdge;
          }
          circle.x += circle.dx + vx;
          circle.y += circle.dy + vy;
          circle.translateX +=
            (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
            ease;
          circle.translateY +=
            (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
            ease;

          drawCircle(circle, true);
        });
        rafID.current = window.requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        window.cancelAnimationFrame(rafID.current!);
      };
    }
  }, [
    quantity,
    staticity,
    ease,
    size,
    color,
    vx,
    vy,
    dpr,
    canvasRef,
    canvasContainerRef,
    circleParams,
    drawCircle
  ]);

  return (
    <div
      className={cn("pointer-events-none", className)}
      ref={canvasContainerRef}
      aria-hidden="true"
      {...props}
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
};
