import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import colors from "#/utils/colors.ts";

// One electron per this many square pixels of the grid, per axis, so the density is the same on any page.
const AREA_PER_ELECTRON = 17_000;
const CELL = 40;
const SPEED = 52;

interface Props {
  side: "left" | "right";
  width: number;
}

interface Track {
  pos: number;
  delay: number;
  duration: number;
  reverse: boolean;
}

export default function ({ side, width }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current!;
    const update = () => setSize({ width: container.offsetWidth, height: container.offsetHeight });
    const observer = new ResizeObserver(update);

    observer.observe(container);
    update();
    return () => observer.disconnect();
  }, []);

  const vDuration = (size.height + 32) / SPEED;
  const hDuration = (size.width + 32) / SPEED;

  const verticals = useMemo(() => tracks(size.width, vDuration, false), [size.width, size.height, vDuration]);
  const horizontals = useMemo(() => tracks(size.height, hDuration, true), [size.width, size.height, hDuration]);

  const $grid: CSSProperties = {
    position: "absolute",
    top: 0,
    bottom: 0,
    [side]: 0,
    width,
    pointerEvents: "none",
    overflow: "hidden",
    WebkitMaskImage: `linear-gradient(to ${side}, transparent, black)`,
    maskImage: `linear-gradient(to ${side}, transparent, black)`,
    backgroundImage: `
      repeating-linear-gradient(to bottom, transparent, transparent ${CELL - 1}px, ${colors.border.medium} ${CELL - 1}px, ${colors.border.medium} ${CELL}px),
      repeating-linear-gradient(to right, transparent, transparent ${CELL - 1}px, ${colors.border.medium} ${CELL - 1}px, ${colors.border.medium} ${CELL}px)
    `
  };

  const $container: CSSProperties = {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    pointerEvents: "none",
    containerType: "size"
  };

  const $base: CSSProperties = {
    position: "absolute",
    opacity: 0,
    borderRadius: 1,
    willChange: "transform, opacity",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite"
  };

  const $vertical: CSSProperties = {
    width: 2,
    height: 12,
    marginLeft: -1,
    background: `linear-gradient(to bottom, transparent, ${colors.electron.vertical} 45%, ${colors.electron.vertical} 55%, transparent)`,
    boxShadow: `0 0 10px ${colors.electron.glow}`,
    animationName: "electron-v"
  };

  const $horizontal: CSSProperties = {
    width: 12,
    height: 2,
    marginTop: -1,
    background: `linear-gradient(to right, transparent, ${colors.electron.vertical} 45%, ${colors.electron.vertical} 55%, transparent)`,
    boxShadow: `0 0 10px ${colors.electron.glow}`,
    animationName: "electron-h"
  };

  return (
    <grid style={$grid}>
      <grid-electrons ref={containerRef} style={$container}>
        {verticals.map((track, index) => (
          <electron
            key={`v-${index}`}
            style={{
              ...$base,
              ...$vertical,
              left: track.pos,
              animationDuration: `${track.duration}s`,
              animationDelay: `${track.delay}s`
            }}
          />
        ))}
        {horizontals.map((track, index) => (
          <electron
            key={`h-${index}`}
            style={{
              ...$base,
              ...$horizontal,
              animationDirection: track.reverse ? "reverse" : "normal",
              top: track.pos,
              animationDuration: `${track.duration}s`,
              animationDelay: `${track.delay}s`
            }}
          />
        ))}
      </grid-electrons>
    </grid>
  );

  function tracks(span: number, duration: number, reversible: boolean): Track[] {
    if (!span) return [];
    const cells = Math.max(1, Math.floor(span / CELL));
    const count = Math.round((size.width * size.height) / AREA_PER_ELECTRON);

    return Array.from({ length: count }, () => ({
      pos: Math.floor(Math.random() * cells) * CELL,
      // A negative delay starts the animation midway, so electrons are spread out from the first frame.
      delay: -Math.random() * duration,
      duration,
      reverse: reversible ? Math.random() > 0.5 : false
    }));
  }
}
