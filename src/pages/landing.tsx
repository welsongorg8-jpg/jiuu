import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, Zap, Coins, Shield, Clock, TrendingUp, Star, Gamepad2, CheckCircle2, Globe, Award } from "lucide-react";

const stats = [
  { value: "$2.4M+", label: "Total Paid Out" },
  { value: "85K+", label: "Active Users" },
  { value: "5+", label: "Offerwall Partners" },
  { value: "<24h", label: "Avg Withdrawal Time" },
];

const features = [
  { icon: Gamepad2, title: "5+ Premium Offerwalls", desc: "OfferToro, CPX Research, Lootably, Adgate Media, BitLabs — all in one place." },
  { icon: Coins, title: "Instant USDT Payouts", desc: "Withdraw directly to your crypto wallet via BEP20 or TRC20 with no hidden fees." },
  { icon: Zap, title: "Real-Time Balance", desc: "Your earnings appear instantly the moment an offer is credited to your account." },
  { icon: Shield, title: "Secure & Verified", desc: "Every withdrawal is manually reviewed for security before processing." },
  { icon: Clock, title: "Fast Processing", desc: "Most withdrawals are processed within 24 hours of approval." },
  { icon: TrendingUp, title: "No Earning Cap", desc: "Complete unlimited offers and grow your balance as high as you want." },
];

const testimonials = [
  { name: "ProGamer_99", amount: "$320 withdrawn", text: "Cashed out three times already. Always fast and always accurate. Best GPT site I've used." },
  { name: "CryptoKing88", amount: "$150 withdrawn", text: "The UI is clean and the USDT payouts are real. No shady business, just straight earnings." },
  { name: "OfferHunter", amount: "$500+ withdrawn", text: "Been here since day one. The offerwalls actually pay and support is responsive." },
];

const steps = [
  { num: "01", icon: Gamepad2, title: "Choose Offers", desc: "Browse our premium offerwalls and select the games and tasks that pay the most." },
  { num: "02", icon: Zap, title: "Complete & Earn", desc: "Reach specific levels or finish tasks. Your balance grows instantly upon completion." },
  { num: "03", icon: Coins, title: "Withdraw Crypto", desc: "Request USDT via BEP20 or TRC20. Processed within 24 hours, straight to your wallet." },
];

function CachvioLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_12px_rgba(249,115,22,0.5)]">
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="text-xl font-black tracking-tight text-white">
        Cach<span className="text-primary">vio</span>
      </span>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <CachvioLogo />
          <div className="hidden sm:flex gap-6 text-sm text-muted-foreground items-center">
            <a href="#how-it-works" className="hover:text-primary transition-colors font-medium">How It Works</a>
            <a href="#features" className="hover:text-primary transition-colors font-medium">Features</a>
            <a href="#testimonials" className="hover:text-primary transition-colors font-medium">Reviews</a>
          </div>
          <div className="flex gap-2 sm:gap-3 items-center">
            <Link href="/login">
              <Button variant="ghost" className="hover:text-primary font-semibold text-sm px-3">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary text-white hover:bg-primary/90 font-bold shadow-[0_0_15px_rgba(249,115,22,0.35)] text-sm px-4">
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 md:pt-52 md:pb-36 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-24 right-10 w-48 h-48 bg-orange-500/5 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-56 h-56 bg-primary/8 blur-[70px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-5xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 text-sm text-primary font-bold">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Live payouts — $2.4M+ paid out worldwide
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-none">
            Earn Real <span className="text-primary drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]">USDT</span><br />
            <span className="text-white">From Anywhere</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Complete premium offers, play games, and instantly withdraw <span className="text-white font-semibold">USDT</span> directly to your crypto wallet — no limits, no tricks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/register">
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90 font-bold text-lg px-10 h-14 shadow-[0_0_30px_rgba(249,115,22,0.45)] w-full sm:w-auto group">
                Create Free Account
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 font-bold text-lg border-border hover:border-primary/50 hover:text-primary w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground pt-2">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Free to join</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Instant withdrawals</span>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-primary/5 border-y border-primary/15 py-3 overflow-hidden">
        <div className="flex items-center gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap px-8">
          {["OfferToro", "CPX Research", "Lootably", "Adgate Media", "BitLabs", "OfferToro", "CPX Research", "Lootably", "Adgate Media", "BitLabs"].map((p, i) => (
            <span key={i} className="text-sm font-bold text-primary/70 uppercase tracking-widest flex-shrink-0">{p}</span>
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-card border-b border-border py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-black text-primary drop-shadow-[0_0_10px_rgba(249,115,22,0.35)]">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1.5 uppercase tracking-widest font-bold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-3 block">Simple Process</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Three simple steps to crypto in your wallet.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="bg-card border border-border p-8 rounded-2xl relative overflow-hidden group hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(249,115,22,0.06)]">
                <div className="absolute top-4 right-6 text-7xl font-black text-primary/6 select-none group-hover:text-primary/12 transition-colors">{step.num}</div>
                <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-primary/20">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-card border-y border-border px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-3 block">Why Cachvio</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Everything You Need</h2>
            <p className="text-muted-foreground text-lg">Built to maximize your earnings, secured and verified.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-background border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-200 group hover:shadow-[0_4px_20px_rgba(249,115,22,0.05)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-white">{f.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Reach Banner */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center">
              <Globe className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Available Worldwide</h3>
              <p className="text-muted-foreground text-sm">Withdraw to any BEP20 or TRC20 wallet, anywhere in the world</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center">
              <Award className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Trusted Platform</h3>
              <p className="text-muted-foreground text-sm">Verified payouts, transparent system, no hidden fees</p>
            </div>
          </div>
          <Link href="/register">
            <Button className="bg-primary text-white font-bold px-8 h-12 shadow-[0_0_20px_rgba(249,115,22,0.3)] shrink-0">
              Join Now <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-3 block">Community</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Users Trust Cachvio</h2>
            <p className="text-muted-foreground text-lg">Real users, real withdrawals, real results.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-200 hover:shadow-[0_4px_20px_rgba(249,115,22,0.06)]">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-5 text-sm">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-primary font-bold mt-0.5">{t.amount}</div>
                  </div>
                  <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                    <Coins className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-4 relative overflow-hidden bg-card border-t border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/12 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 text-sm text-primary font-bold">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Join 85,000+ users worldwide
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
            Start Earning <span className="text-primary drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]">Today</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">Sign up free and start earning USDT within minutes. No investment required.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link href="/register">
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90 font-bold text-lg px-12 h-14 shadow-[0_0_35px_rgba(249,115,22,0.4)] w-full sm:w-auto">
                Create Free Account
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-10 font-bold border-border hover:border-primary/50 hover:text-primary w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">Minimum withdrawal: $5 USDT · BEP20 & TRC20 supported</p>
        </div>
      </section>

      <footer className="border-t border-border bg-background py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <CachvioLogo />
          <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} Cachvio. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/register"><span className="hover:text-primary cursor-pointer transition-colors">Sign Up</span></Link>
            <Link href="/login"><span className="hover:text-primary cursor-pointer transition-colors">Login</span></Link>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
