import { Link, useLocation } from "wouter";
import { useGetMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Wallet, History, Send, Gamepad2, Settings, ShieldAlert, Menu, Languages } from "lucide-react";
import { removeToken } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useMemo, useState } from "react";

type NavLabel = "Dashboard" | "Balance" | "Transactions" | "Withdraw" | "Platforms" | "Settings" | "Admin Panel" | "لوحة التحكم" | "الرصيد" | "العمليات" | "سحب" | "المنصات" | "الإعدادات" | "لوحة الأدمن";

type NavItem = {
  href: string;
  label: NavLabel;
  icon: typeof Home;
};

const translations = {
  en: {
    dashboard: "Dashboard",
    balance: "Balance",
    transactions: "Transactions",
    withdraw: "Withdraw",
    platforms: "Platforms",
    settings: "Settings",
    adminPanel: "Admin Panel",
    logout: "Logout",
    loading: "Loading...",
  },
  ar: {
    dashboard: "لوحة التحكم",
    balance: "الرصيد",
    transactions: "العمليات",
    withdraw: "سحب",
    platforms: "المنصات",
    settings: "الإعدادات",
    adminPanel: "لوحة الأدمن",
    logout: "تسجيل الخروج",
    loading: "جاري التحميل...",
  },
} as const;

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useGetMe();
  const [language, setLanguage] = useState<"en" | "ar">(() => (localStorage.getItem("gr-language") as "en" | "ar") || "en");

  useEffect(() => {
    localStorage.setItem("gr-language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [isLoading, user, setLocation]);

  const t = useMemo(() => translations[language], [language]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">{t.loading}</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    removeToken();
    queryClient.clear();
    setLocation("/login");
  };

  const navItems: NavItem[] = [
    { href: "/dashboard", label: t.dashboard, icon: Home },
    { href: "/balance", label: t.balance, icon: Wallet },
    { href: "/transactions", label: t.transactions, icon: History },
    { href: "/withdraw", label: t.withdraw, icon: Send },
    { href: "/platforms", label: t.platforms, icon: Gamepad2 },
    { href: "/settings", label: t.settings, icon: Settings },
  ];

  if (user.isAdmin || user.isSuperAdmin) {
    navItems.push({ href: "/admin/dashboard", label: t.adminPanel, icon: ShieldAlert });
  }

  const NavLinks = ({ closeSheet }: { closeSheet?: () => void }) => (
    <>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} onClick={closeSheet}>
          <div
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer text-sm font-medium ${
              location === item.href
                ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_8px_rgba(0,255,135,0.08)]"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <item.icon className={`h-4 w-4 shrink-0 ${location === item.href ? "text-primary" : ""}`} />
            {item.label}
            {item.href === "/admin/dashboard" && (
              <span className="ml-auto text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Admin</span>
            )}
          </div>
        </Link>
      ))}
    </>
  );

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-60 border-r border-border bg-card shrink-0">
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between gap-3">
            <Link href="/">
              <h1 className="text-xl font-bold text-primary tracking-tight cursor-pointer drop-shadow-[0_0_10px_rgba(0,255,135,0.3)]">
                GAME<span className="text-white">REWARDS</span>
              </h1>
            </Link>
            <Button variant="outline" size="sm" onClick={() => setLanguage(language === "en" ? "ar" : "en")} className="gap-2">
              <Languages className="h-4 w-4" />
              {language === "en" ? "AR" : "EN"}
            </Button>
          </div>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          <NavLinks />
        </nav>
        <div className="p-3 border-t border-border space-y-2">
          <div className="px-3 py-2.5 rounded-lg bg-accent/50">
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <p className="text-xs font-bold text-white mt-0.5 truncate">{user.username}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t.logout}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card sticky top-0 z-50">
          <Link href="/">
            <h1 className="text-lg font-bold text-primary tracking-tight cursor-pointer drop-shadow-[0_0_10px_rgba(0,255,135,0.3)]">
              GAME<span className="text-white">REWARDS</span>
            </h1>
          </Link>
          <Button variant="outline" size="sm" onClick={() => setLanguage(language === "en" ? "ar" : "en")} className="gap-2">
            <Languages className="h-4 w-4" />
            {language === "en" ? "AR" : "EN"}
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-0 bg-card border-border">
              <div className="p-5 border-b border-border">
                <div className="flex items-center justify-between gap-3">
                  <h1 className="text-xl font-bold text-primary tracking-tight drop-shadow-[0_0_10px_rgba(0,255,135,0.3)]">
                    GAME<span className="text-white">REWARDS</span>
                  </h1>
                  <Button variant="outline" size="sm" onClick={() => setLanguage(language === "en" ? "ar" : "en")} className="gap-2">
                    <Languages className="h-4 w-4" />
                    {language === "en" ? "AR" : "EN"}
                  </Button>
                </div>
              </div>
              <nav className="p-3 flex flex-col gap-1">
                <NavLinks />
              </nav>
              <div className="p-3 border-t border-border">
                <div className="px-3 py-2 rounded-lg bg-accent/50 mb-2">
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  <p className="text-xs font-bold text-white mt-0.5">{user.username}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t.logout}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
