"use server"
import { signInFormSchema, signUpFormSchema } from "../validators";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/db/prisma";
import { hashSync } from "bcrypt-ts-edge";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError } from "../utils";

// sign in the uer wth credentials

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const data = signInFormSchema.parse({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });


    await signIn("credentials",data);

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid email or password" };
  }
}


// sign use out 
export async function signOutUser() {
  await signOut();
}

// Signup users
export async function signUpUser(prevState : unknown, formData:FormData){
    
    try {
        const user = signUpFormSchema.parse({

        email: formData.get("email")  ,
        password: formData.get("password")  ,
        confirmPassword: formData.get("confirmPassword")  ,
        name: formData.get("name") ,
        });

  
        const plainPassword = user.password;
        user.password = hashSync(user.password, 10);


        await prisma.user.create({data:{
            email: user.email,
            password: user.password,
            name: user.name,
        }});

     
        await signIn('credentials', {email: user.email, password: plainPassword});
     
    
        return { success: true, message: "User Registerd Successfully" };

    } catch (error) {
   



        if (isRedirectError(error)) {

        throw error;
        }
        return { success: false, message: formatError(error) };
    }
}