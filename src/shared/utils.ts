// ─── Utility Functions ───

/**
 * Throttles a function to be called at most once per specified interval
 * Uses requestAnimationFrame for smooth animations
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limitMs: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: number | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= limitMs) {
      lastCall = now;
      func.apply(this, args);
    } else {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        lastCall = Date.now();
        func.apply(this, args);
        timeoutId = null;
      }, limitMs - timeSinceLastCall);
    }
  };
}

/**
 * Checks if two items can merge based on their definitions
 */
export function canItemsMerge(itemDefIdA: string | undefined, itemDefIdB: string | undefined, itemMap: Record<string, any>): boolean {
  if (!itemDefIdA || !itemDefIdB || itemDefIdA !== itemDefIdB) {
    return false;
  }
  
  const itemDef = itemMap[itemDefIdA];
  return !!(itemDef && itemDef.mergesInto);
}
