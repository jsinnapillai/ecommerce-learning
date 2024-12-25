import {z } from 'zod';
import { formatNumberWithDecimal } from './utils';

// Schema for inserting Products
const currencyValue = z.string()
.refine((value) => /^\d+(\.\d{2})$/.test(formatNumberWithDecimal(Number(value))), "Price must have exactly two decimal places")

export const insertProductSchema = z.object({
    name: z.string().min(3,"Name must be at least 3 characters long").max(255,"Name must be at most 255 characters long"),
    slug: z.string().min(3,"Name must be at least 3 characters long").max(255,"Name must be at most 255 characters long"),
    category: z.string().min(3,"Name must be at least 3 characters long"),
    description: z.string().min(3,"Name must be at least 3 characters long"),
    brand: z.string().min(3,"Name must be at least 3 characters long"),
    images: z.array(z.string()).min(1, "Product must have at least 1 image"),
    isFeatured: z.boolean(),
    numReviews: z.number(),
    banner: z.string().nullable(),
    stock: z.number(),
    price: currencyValue
  
});


// Schema for sIGNING USERS IN

export const signInFormSchema = z.object({
    email: z.string().email("Invalid Email address"),
    password: z.string().min(6,"Password must be at least 6 characters long")
})


// Schema forSignin IN

export const signUpFormSchema = z.object({
    name: z.string().min(3,"Name must be at least 3 characters"),
    email: z.string().email("Invalid Email address"),
    password: z.string().min(6,"Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6,"Password must be at least 6 characters long")

}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path:["confirmPassword"]
});