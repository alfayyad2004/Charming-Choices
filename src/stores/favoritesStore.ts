import { persistentAtom } from '@nanostores/persistent';

export interface FavoriteItem {
    id: string;
    title: string;
    price: number;
    image: string;
}

export const favoritesItems = persistentAtom<FavoriteItem[]>('favorites', [], {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export function toggleFavorite(item: FavoriteItem) {
    const existing = favoritesItems.get().find((i) => i.id === item.id);
    if (existing) {
        favoritesItems.set(favoritesItems.get().filter((i) => i.id !== item.id));
    } else {
        favoritesItems.set([...favoritesItems.get(), item]);
    }
}

export function isFavorite(id: string) {
    return favoritesItems.get().some((i) => i.id === id);
}
