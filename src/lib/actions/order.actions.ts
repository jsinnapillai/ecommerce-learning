"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError } from "../utils";
import { auth } from "@/auth";

export async function createOrder(){
    try {
        const session = await auth();
        console.log(session)

        
    return { success: true, message: "payment method updated  Successfully" };
     
   } catch (error) {
    if(isRedirectError(error)) throw error;
     return { success: false, message: formatError(error) };
   }
}