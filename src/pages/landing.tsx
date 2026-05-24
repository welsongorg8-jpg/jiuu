import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, Gamepad2, Coins, Zap, Shield, Clock, TrendingUp, Star } from "lucide-react";

const stats = [
  { value: "$2.4M+", label: "Total Paid Out" },
  { value: "85K+", label: "Active Gamers" },
  { value: "5+", label: "Offerwall Partners" },
  { value: "<24h", label: "Avg Withdrawal Time" },
];

const features = [
  {
    icon: Gamepad2,
    title: "5+ Premium Offerwalls",
    desc: "OfferToro, CPX Research, Lootably, Adgate Media, BitLabs — all in one place.",
  },
  {
    icon: Coins,
    title: "Instant USDT Payouts",
    desc: "Withdraw directly to your crypto wallet via BEP20 or TRC20 with no hidden fees.",
  },
  {
    icon: Zap,
    title: "Real-Time Balance",
    desc: "Your earnings appear instantly the moment an offer is credited to your account.",
  },
  {
    icon: Shield,
    title: "Secure & Verified",
    desc: "Every withdrawal is manually reviewed for security before processing.",
  },
  {
    icon: Clock,
    title: "Fast Processing",
    desc: "Most withdrawals are processed within 24 hours of approval.",
  },
  {
    icon: TrendingUp,
    title: "No Earning Cap",
    desc: "Complete unlimited offers and grow your balance as high as you want.",
  },
];

const testimonials = [
  { name: "ProGamer_99", amount: "$320 withdrawn", text: "Cashed out three times already. Always fast and always accurate. Best GPT site I've used." },
  { name: "CryptoKing88", amount: "$150 withdrawn", text: "The UI is clean and the USDT payouts are real. No shady business, just straight earnings." },
  { name: "OfferHunter", amount: "$500+ withdrawn", text: "Been here since day one. The offerwalls actually pay and support is responsive." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary tracking-tight drop-shadow-[0_0_10px_rgba(0,255,135,0.3)]">
            GAME<span className="text-white">REWARDS</span>
          </h1>
          <div className="flex gap-3 items-center">
            <Link href="/login">
              <Button variant="ghost" className="hover:text-primary font-medium">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary text-black hover:bg-primary/90 font-bold shadow-[0_0_15px_rgba(0,255,135,0.3)]">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 md:pt-52 md:pb-36 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-green-500/5 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-5xl space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm text-primary font-bold mb-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Live payouts — $2.4M+ paid to gamers
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
            Turn Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-green-300 to-primary drop-shadow-[0_0_25px_rgba(0,255,135,0.4)]">
              Gaming Skills
            </span><br />
            Into Crypto
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Complete high-paying offers, play games, and instantly withdraw <span className="text-white font-semibold">USDT</span> directly to your crypto wallet.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="bg-primary text-black hover:bg-primary/90 font-bold text-lg px-10 h-14 shadow-[0_0_25px_rgba(0,255,135,0.4)] w-full sm:w-auto group">
                Start Earning Now
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 font-bold text-lg border-border hover:border-primary/50 hover:text-primary w-full sm:w-auto">
                I already have an account
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">Free to join · No credit card required · Instant withdrawals</p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-card border-y border-border py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-black text-primary drop-shadow-[0_0_10px_rgba(0,255,135,0.4)]">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1 uppercase tracking-wider font-bold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase mb-4">HOW IT WORKS</h2>
            <p className="text-muted-foreground text-lg">Three simple steps to crypto in your wallet.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: "01", icon: Gamepad2, title: "Choose Offers", desc: "Browse our premium offerwalls and select the games and tasks that pay the most." },
              { num: "02", icon: Zap, title: "Complete & Earn", desc: "Reach specific levels or finish tasks. Your balance grows instantly upon completion." },
              { num: "03", icon: Coins, title: "Withdraw Crypto", desc: "Request USDT via BEP20 or TRC20. Processed within 24 hours, straight to your wallet." },
            ].map((step) => (
              <div key={step.num} className="bg-card border border-border p-8 rounded-2xl relative overflow-hidden group hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,135,0.05)]">
                <div className="absolute top-4 right-6 text-7xl font-black text-primary/5 select-none group-hover:text-primary/10 transition-colors">{step.num}</div>
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
      <section className="py-24 bg-card border-y border-border px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase mb-4">WHY GAMEREWARDS?</h2>
            <p className="text-muted-foreground text-lg">Everything you need to maximize your earnings.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-background border border-border rounded-xl p-6 hover:border-primary/30 transition-colors group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                    <f.icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-bold text-white">{f.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase mb-4">GAMERS TRUST US</h2>
            <p className="text-muted-foreground text-lg">Real users, real withdrawals.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-primary font-bold mt-0.5">{t.amount}</div>
                  </div>
                  <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                    <Gamepad2 className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <h2 className="text-4xl md:text-7xl font-black mb-4 uppercase tracking-tighter">
            Ready to<br />
            <span className="text-primary drop-shadow-[0_0_20px_rgba(0,255,135,0.4)]">dominate?</span>
          </h2>
          <p className="text-xl text-muted-foreground">Join thousands of gamers who are already earning real USDT.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-primary text-black hover:bg-primary/90 font-bold text-xl px-12 h-16 shadow-[0_0_40px_rgba(0,255,135,0.5)] w-full sm:w-auto">
                CREATE YOUR ACCOUNT
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">Minimum withdrawal: $5 USDT · BEP20 & TRC20 supported</p>
        </div>
      </section>

      <footer className="border-t border-border bg-card py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-primary tracking-tight">
            GAME<span className="text-white">REWARDS</span>
          </h1>
          <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} GameRewards. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/register"><span className="hover:text-primary cursor-pointer transition-colors">Sign Up</span></Link>
            <Link href="/login"><span className="hover:text-primary cursor-pointer transition-colors">Login</span></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
