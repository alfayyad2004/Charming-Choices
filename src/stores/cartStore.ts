import { atom, map } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';

export interface CartItem {
    id: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
}

export const cartItems = persistentAtom<CartItem[]>('cart', [], {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export function addToCart(item: Omit<CartItem, 'quantity'>) {
    const existing = cartItems.get().find((i) => i.id === item.id);
    if (existing) {
        cartItems.set(
            cartItems.get().map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
        );
    } else {
        cartItems.set([...cartItems.get(), { ...item, quantity: 1 }]);
    }
}

export function removeFromCart(id: string) {
    cartItems.set(cartItems.get().filter((i) => i.id !== id));
}

export function clearCart() {
    cartItems.set([]);
}

export const cartTotal = atom(0);

cartItems.subscribe((items) => {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    cartTotal.set(total);
});
