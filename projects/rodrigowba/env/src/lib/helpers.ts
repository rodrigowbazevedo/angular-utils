declare const __env: Record<string, unknown>;

let data: Map<string, unknown>;

const initializeMap = () => {
  data = new Map<string, unknown>(Object.entries(__env || {}));
};

export const get = <T>(property: string, fallback: T = null) => {
  if (!data) {
    initializeMap();
  }

  return (data.get(property) as T) || fallback;
}
