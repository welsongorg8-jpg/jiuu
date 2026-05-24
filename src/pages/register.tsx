import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { setToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { customFetch } from "@/lib/api-client/custom-fetch";
import type { AuthResponse } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", username: "", password: "" },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormValues) =>
      customFetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (res) => {
      setToken(res.token);
      toast({ title: "Account created!", description: "Welcome to GameRewards." });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.data?.error || error.message,
      });
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
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
          <p className="text-muted-foreground text-lg">Create your account</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground uppercase text-xs tracking-wider font-bold">Username</FormLabel>
                  <FormControl>
                    <Input placeholder="ProGamer99" {...field} className="bg-background border-input focus-visible:ring-primary h-12" />
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
                  <FormLabel className="text-muted-foreground uppercase text-xs tracking-wider font-bold">Password</FormLabel>
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
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Account"}
            </Button>
          </form>
        </Form>

        <div className="mt-8 text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login">
            <span className="text-primary hover:underline cursor-pointer font-medium">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
