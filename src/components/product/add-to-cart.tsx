"use client";
import { CartItem,Cart } from "@/types";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { addItemToCart, removeItemFromcart } from "@/lib/actions/cart.actions";
import { ToastAction } from "../ui/toast";
import { Loader, Minus, Plus } from "lucide-react";
import {   useTransition } from "react";

const AddtoCart = ({ cart, item } : {cart?:Cart,  item: CartItem }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending,startTransition] = useTransition()

  const HandleAddtoCart = async () => {
    startTransition( async () => {
    const res = await addItemToCart(item);

    if (!res.success) {
      toast({
        variant: "destructive",
        description: res.message,
      });
      return;
    }
    // Hanlde Success to add cart
    toast({
      description: res.message,
      action: (
        <ToastAction
          className="bg-primary  text-white hover:bg-gray-800"
          altText={"Go to Cart"}
          onClick={() => router.push("/cart")}
        >
          Go to Cart
        </ToastAction>
      ),
    });
  })
  };

  const handleRemoveFromcart = async () => {
    startTransition( async () => { 
    const res = await removeItemFromcart(item.productId)
     toast({
      variant : res.message ? 'default' : 'destructive',
      description: res.message,
       
    });
    return;
  });
 
  }
//  Check if item is in Cart
const existingItem = cart && cart.items.find((x) => x.productId === item.productId);
  return existingItem ?(
    <div className="">
    <Button  type="button" variant="outline" onClick={handleRemoveFromcart}>
      {isPending ? (<Loader className="h-4 w-4 animate-spin" />) : (
      <Minus className="h-4 w-4"/>
    )}
    </Button>
    <span className="px-2">{existingItem.qty} </span>
    <Button  type="button" variant="outline" onClick={HandleAddtoCart}>
    {isPending ? (<Loader className="h-4 w-4 animate-spin" />) : (
      <Plus className="h-4 w-4"/>
    )}
    </Button>
    </div>
  ): (
    <Button className="w-full flex gap-4" type="button" onClick={HandleAddtoCart}>
    {isPending ? (<Loader className="h-4 w-4 animate-spin" />) : (
      <Plus className="h-4 w-4"/>
    )}
    </Button>
  )
};
export default AddtoCart;
