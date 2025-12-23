import { defineCollection, z } from 'astro:content';

const products = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        price: z.number(),
        category: z.enum(['Home Decor', 'Electronics', 'Fashion', 'Gifts']),
        image: z.string(),
        badge: z.enum(['New Arrival', 'Best Seller', 'Sale']).optional(),
        featured: z.boolean().default(false),
        stock: z.number().default(10),
    }),
});

export const collections = { products };
