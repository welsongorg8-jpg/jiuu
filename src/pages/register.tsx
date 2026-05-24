import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { setToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2 } from "lucide-react";
import { customFetch } from "@/lib/api-client/custom-fetch";
import type { AuthResponse } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type RegisterFormValues = z.infer<typeof registerSchema>;

function CachvioLogo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_16px_rgba(249,115,22,0.5)]">
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="text-2xl font-black tracking-tight text-white">
        Cach<span className="text-primary">vio</span>
      </span>
    </div>
  );
}

const perks = [
  "Free to join — no credit card required",
  "Withdraw USDT instantly to your wallet",
  "Access to 5+ premium offerwalls",
];

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", username: "", password: "" },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormValues) =>
      customFetch<AuthResponse>("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: (res) => {
      setToken(res.token);
      toast({ title: "Account created!", description: "Welcome to Cachvio." });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Registration failed", description: error.data?.error || error.message });
    },
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/8 blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/"><CachvioLogo /></Link>
          <p className="text-muted-foreground mt-3">Create your free account and start earning</p>
        </div>

        <div className="bg-card border border-border p-8 rounded-2xl shadow-2xl">
          {/* Perks */}
          <div className="flex flex-col gap-2 mb-6 bg-primary/5 border border-primary/15 rounded-xl p-4">
            {perks.map((p) => (
              <div key={p} className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                {p}
              </div>
            ))}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(registerMutation.mutate)} className="space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} className="bg-background border-input focus-visible:ring-primary h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Username</FormLabel>
                  <FormControl>
                    <Input placeholder="YourUsername" {...field} className="bg-background border-input focus-visible:ring-primary h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Min. 8 characters" {...field} className="bg-background border-input focus-visible:ring-primary h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full h-11 text-white font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)] mt-2" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Account"}
              </Button>
            </form>
          </Form>

          <div className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login"><span className="text-primary hover:underline cursor-pointer font-semibold">Sign in</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
