import { Layout } from "@/components/layout";
import { useGetDashboardStats, useGetRecentActivity, useGetBalance, useListPlatforms } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import {
  Coins, Download, CheckCircle2, History, ArrowUpRight, Gamepad2, Zap, ChevronRight
} from "lucide-react";

const formatMoney = (value?: string | number | null) => {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
};

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: balanceData } = useGetBalance();
  const { data: activity, isLoading: activityLoading } = useGetRecentActivity();
  const { data: platformsData } = useListPlatforms();

  const statCards = [
    {
      label: "Current Balance",
      value: `$${formatMoney(balanceData?.balance)}`,
      icon: Coins,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
      glow: "shadow-[0_0_20px_rgba(0,255,135,0.08)]",
    },
    {
      label: "Total Earned",
      value: `$${formatMoney(stats?.totalEarned)}`,
      icon: CheckCircle2,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      glow: "",
    },
    {
      label: "Total Withdrawn",
      value: `$${formatMoney(stats?.totalWithdrawn)}`,
      icon: Download,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      glow: "",
    },
    {
      label: "Pending",
      value: `$${formatMoney(stats?.pendingWithdrawals)}`,
      icon: History,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      glow: "",
    },
  ];

  return (
    <Layout>
      <div className="space-y-8 max-w-7xl">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight uppercase">Dashboard</h2>
            <p className="text-muted-foreground mt-1">Welcome back — here's your earnings overview.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/platforms">
              <Button variant="outline" className="border-border hover:border-primary/40 hover:text-primary">
                <Gamepad2 className="h-4 w-4 mr-2" />
                Browse Offers
              </Button>
            </Link>
            <Link href="/withdraw">
              <Button className="bg-primary text-black font-bold hover:bg-primary/90 shadow-[0_0_12px_rgba(0,255,135,0.2)]">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Withdraw
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className={`bg-card border-border ${stat.glow} transition-all duration-300 hover:scale-[1.02]`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</CardTitle>
                <div className={`w-8 h-8 rounded-lg ${stat.bg} border ${stat.border} flex items-center justify-center`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <Skeleton className="h-9 w-28 mt-1" />
                ) : (
                  <div className={`text-3xl font-black ${stat.label === "Current Balance" ? "text-primary" : "text-white"}`}>
                    {stat.value}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">USDT</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="uppercase tracking-wider text-sm font-bold">Recent Activity</CardTitle>
              <Link href="/transactions">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
                  View All <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {activityLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
                </div>
              ) : activity?.activities?.length ? (
                <div className="space-y-2">
                  {activity.activities.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl bg-background border border-border hover:border-border/80 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          item.type === 'earning' ? 'bg-primary/10 border border-primary/20' :
                          item.type === 'withdrawal' ? 'bg-blue-500/10 border border-blue-500/20' :
                          'bg-accent border border-border'
                        }`}>
                          {item.type === 'earning' ? <Zap className="h-3.5 w-3.5 text-primary" /> :
                           item.type === 'withdrawal' ? <Download className="h-3.5 w-3.5 text-blue-400" /> :
                           <Coins className="h-3.5 w-3.5 text-muted-foreground" />}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm leading-tight">{item.description}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>
                      {item.amount && (
                        <div className={`font-bold text-sm shrink-0 ml-3 ${parseFloat(item.amount) > 0 ? 'text-primary' : 'text-foreground'}`}>
                          {parseFloat(item.amount) > 0 ? '+' : ''}{item.amount} USDT
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-semibold text-white mb-1">No activity yet</p>
                  <p className="text-sm text-muted-foreground">Start completing offers to see your earnings here.</p>
                  <Link href="/platforms">
                    <Button size="sm" className="mt-4 bg-primary text-black font-bold">Browse Offerwalls</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Access */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="uppercase tracking-wider text-sm font-bold">Available Offerwalls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!platformsData?.platforms ? (
                <div className="space-y-2">
                  {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
                </div>
              ) : platformsData.platforms.slice(0, 4).map((platform: any) => (
                <div key={platform.id} className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Gamepad2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{platform.name}</p>
                    <p className="text-xs text-muted-foreground">{platform.placement}</p>
                  </div>
                  {platform.apiEndpoint && (
                    <a href={platform.apiEndpoint} target="_blank" rel="noopener noreferrer">
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  )}
                </div>
              ))}
              <Link href="/platforms">
                <Button variant="outline" className="w-full mt-2 border-border hover:border-primary/40 hover:text-primary">
                  View All Offerwalls
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
