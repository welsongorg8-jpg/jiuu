import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "@workspace/api-client-react";
import { setToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const loginMutation = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate({ data }, {
      onSuccess: (res) => {
        setToken(res.token);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        setLocation("/dashboard");
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.data?.error || error.message || "An error occurred",
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold text-primary tracking-tight cursor-pointer drop-shadow-[0_0_10px_rgba(0,255,135,0.3)] mb-2">
              GAME<span className="text-white">REWARDS</span>
            </h1>
          </Link>
          <p className="text-muted-foreground text-lg">Enter the arena</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground uppercase text-xs tracking-wider font-bold">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="gamer@example.com" {...field} className="bg-background border-input focus-visible:ring-primary h-12" />
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
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-muted-foreground uppercase text-xs tracking-wider font-bold">Password</FormLabel>
                    <Link href="/forgot-password">
                      <span className="text-xs text-primary hover:underline cursor-pointer">Forgot password?</span>
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} className="bg-background border-input focus-visible:ring-primary h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full h-12 text-black font-bold uppercase tracking-wider hover:bg-primary/90 shadow-[0_0_15px_rgba(0,255,135,0.2)]"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Authenticate"}
            </Button>
          </form>
        </Form>

        <div className="mt-8 text-center text-muted-foreground">
          New here?{" "}
          <Link href="/register">
            <span className="text-primary hover:underline cursor-pointer font-medium">Create an account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
