import { cartItemSchema, insertCartSchema, insertOrderItemSchema, insertOrderSchema, insertProductSchema, paymentMethodSchema, shippingAddressSchema } from '@/lib/validators';
import {z} from 'zod';

export type Product = z.infer<typeof insertProductSchema> & {
    id:string;
    rating: string;
    createdAt : Date,
     
    
}

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>
export type PaymentMethod = z.infer<typeof paymentMethodSchema>
export type OrderItem = z.infer<typeof insertOrderItemSchema>
export type Order = z.infer<typeof insertOrderSchema> & {
    id: string,
    createdat:Date;
    isPaid: boolean;
    isDelivered: Date | null;
    orderitems: OrderItem[];
    user: {name: string; email:string}
    

}
