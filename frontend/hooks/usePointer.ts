export default function () {
  return window.matchMedia("(pointer: coarse)").matches ? "TOUCH" : "MOUSE";
}
