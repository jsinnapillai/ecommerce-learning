import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import PaymentMethodForm from "./payment-method-form";
 
import CheckoutSteps from "@/components/shared/chekout-steps";

export  const metadata: Metadata ={
    title:'Select Payment Methid'
}

const PaymentMethodPage = async () => {
    const session = await auth();
    const userId = session?.user?.id;
   
    if(!userId) throw new Error("User Not found")
        const user = await getUserById(userId);


    return ( <>
          <CheckoutSteps current={2} />
    <PaymentMethodForm preferredPaymentMethod={ user.paymentMethod} />
    </> );
}
 
export default PaymentMethodPage;