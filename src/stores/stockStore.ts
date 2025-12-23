import { persistentAtom } from '@nanostores/persistent';

// Storage for local stock adjustments (e.g. { "slug": 2 })
// This helps simulate stock updates for the current user session
export const stockAdjustments = persistentAtom<Record<string, number>>('stock_adjustments', {}, {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export function adjustLocalStock(slug: string, quantity: number) {
    const current = stockAdjustments.get();
    const currentVal = current[slug] || 0;
    stockAdjustments.set({
        ...current,
        [slug]: currentVal + quantity
    });
}

export function getAdjustedStock(slug: string, originalStock: number) {
    const adj = stockAdjustments.get()[slug] || 0;
    return Math.max(0, originalStock - adj);
}
