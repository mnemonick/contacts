import { useEffect, useState } from "react";

export default function () {
  const [layout, setLayout] = useState(measure);

  useEffect(() => {
    const onResize = () => setLayout(measure());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return layout;

  // Content is capped at 1024px and centered; left and right are its edges in the window.
  function measure() {
    const width = window.innerWidth > 1024 ? 1024 : window.innerWidth;
    const height = window.innerHeight;
    const left = window.innerWidth / 2 - width / 2;
    const right = left + width;

    return { width, height, left, right, desktop: width >= 1024, mobile: width < 1024 };
  }
}
