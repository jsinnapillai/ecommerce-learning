"use server"
import { signInFormSchema } from "../validators";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

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