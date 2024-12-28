"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";
import { DEFAULT_PAYMENT_METHODS, PAYMENT_METHODS } from "@/lib/constants";
import { paymentMethodSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHODS,
    },
  });

  const [isPending, startTransition] = useTransition();
  const onSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
    console.log(values)
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values);

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
        return;
      }

     router.push("/place-order");
    });
  };

  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Payment Method</h1>
        <p className="text-sm text-muted-foreground">
          Please select a payment method
        </p>
        <Form {...form}>
          <form className="space-y-4 " onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row gap-5">
              <FormField
                name="type"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        className="flex flex-col space-y-2"
                        onValueChange={field.onChange}
                      >
                        {PAYMENT_METHODS.map((paymentmethod) => (
                          <FormItem
                            key={paymentmethod}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={paymentmethod}
                                checked={field.value === paymentmethod}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {paymentmethod}
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader className="m-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                Contine
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};
export default PaymentMethodForm;
