export const TEXT_MAX = 255;

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isText(value: unknown): value is string {
  return typeof value === "string" && value.length <= TEXT_MAX && !value.includes("\0");
}

export function isEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value);
}

export function isId(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0 && value <= 2_147_483_647;
}
