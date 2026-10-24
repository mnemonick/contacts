import { useEffect, useState } from "react";

export default function () {
  const [layout, setLayout] = useState(measure);

  useEffect(() => {
    const onResize = () => setLayout(measure());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return layout;

  // Content is capped at 1200px, centered, and keeps the resume's gap to the window edge: 20px on desktop, 10px on mobile.
  function measure() {
    const mobile = window.innerWidth <= 1024;
    const width = Math.min(1200, window.innerWidth - (mobile ? 20 : 40));
    const height = window.innerHeight;
    const left = window.innerWidth / 2 - width / 2;
    const right = left + width;

    return { width, height, left, right, desktop: !mobile, mobile, windowWidth: window.innerWidth };
  }
}
