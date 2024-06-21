"use client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import useOpenSenseMapAuth from "@/lib/useOpenSenseMapAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"; // import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useToast } from "../ui/use-toast";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Loader2Icon } from "lucide-react";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function OpenSenseMapLogin({
  setAlreadyLoggedIn,
}: {
  setAlreadyLoggedIn?: (value: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const { login } = useOpenSenseMapAuth();
  const { toast } = useToast();

  const email = useAuthStore((state) => state.email);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
    },
  });

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      if (setAlreadyLoggedIn) setAlreadyLoggedIn(true);
      console.log("Login successful");
    } catch (e) {
      console.log(e);
      toast({ variant: "destructive", title: "Login fehlgeschlagen" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col content-center justify-center gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-Mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="E-Mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passwort</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Passwort" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="float-right" type="submit">
            {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Anmelden
          </Button>
        </form>
      </Form>
    </div>
  );
}
