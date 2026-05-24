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
import { Loader2, Zap } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

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

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const loginMutation = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate({ data }, {
      onSuccess: (res) => {
        setToken(res.token);
        toast({ title: "Welcome back!", description: "Login successful." });
        setLocation("/dashboard");
      },
      onError: (error: any) => {
        toast({ variant: "destructive", title: "Login failed", description: error.data?.error || error.message || "An error occurred" });
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/8 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-40 h-40 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/"><CachvioLogo /></Link>
          <p className="text-muted-foreground mt-3">Sign in to your account</p>
        </div>

        <div className="bg-card border border-border p-8 rounded-2xl shadow-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} className="bg-background border-input focus-visible:ring-primary h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Password</FormLabel>
                    <Link href="/forgot-password">
                      <span className="text-xs text-primary hover:underline cursor-pointer">Forgot password?</span>
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} className="bg-background border-input focus-visible:ring-primary h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full h-11 text-white font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)] mt-2" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <>Sign In <Zap className="ml-2 h-4 w-4" /></>}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            New to Cachvio?{" "}
            <Link href="/register"><span className="text-primary hover:underline cursor-pointer font-semibold">Create account</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
