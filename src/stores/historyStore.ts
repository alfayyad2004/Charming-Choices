import { persistentAtom } from '@nanostores/persistent';

export interface OrderItem {
    title: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    date: string;
    total: string;
    items: OrderItem[];
    status: 'Processing' | 'Completed' | 'Cancelled';
    fulfillment: string;
    payment: string;
}

export const orderHistory = persistentAtom<Order[]>('order_history', [], {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export function addOrderToHistory(order: Order) {
    const currentHistory = orderHistory.get();
    orderHistory.set([order, ...currentHistory]);
}
