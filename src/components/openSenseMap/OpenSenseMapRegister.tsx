"use client";
import { useSwiper } from "swiper/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
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
import { register } from "@/lib/api/openSenseMapClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const formSchema = z
  .object({
    name: z.string().min(3).max(40),
    email: z.string().email(),
    password: z.string(),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

export default function OpenSenseMapRegister() {
  const swiper = useSwiper();
  const [loading, setLoading] = useState(false);
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
      await register(values.name, values.email, values.password);
      toast({
        title:
          "Registrierung erfolgreich, Bestätige die EMail und melde dich an!",
        duration: 5000,
      });
      swiper.slideNext();
    } catch (e) {
      toast({ variant: "destructive", title: "Registrierung fehlgeschlagen" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col content-center justify-center gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Bei der openSenseMap registrieren</CardTitle>
          <CardDescription>
            Du erhältst im Anschluss eine Email, mit der du deine Registrierung
            bestätigen musst!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="space-y-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">E-Mail</FormLabel>
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
                    <FormLabel className="font-bold">Passwort</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Passwort"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      Passwort wiederholen
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Passwort"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col">
                <Button
                  disabled={loading}
                  className="float-right"
                  type="submit"
                >
                  {loading && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Registrieren
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
