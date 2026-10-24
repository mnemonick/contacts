import { useEffect, useState } from "react";

export default function () {
  const [layout, setLayout] = useState(measure);

  useEffect(() => {
    const onResize = () => setLayout(measure());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return layout;

  function measure() {
    const mobile = window.innerWidth <= 1024;
    const width = Math.min(1024, window.innerWidth - (mobile ? 20 : 40));
    const height = window.innerHeight;
    const left = window.innerWidth / 2 - width / 2;
    const right = left + width;

    return { width, height, left, right, desktop: !mobile, mobile, windowWidth: window.innerWidth };
  }
}
