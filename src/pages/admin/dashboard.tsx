import { AdminLayout as Layout } from "@/components/admin-layout";
import { useGetAdminStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Gamepad2, Coins, ArrowDownUp, Clock, TrendingUp, UserCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStats();

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers,
      sub: `${stats?.activeUsers} active`,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    {
      label: "System Balance",
      value: `${stats?.totalBalanceInSystem} USDT`,
      sub: "across all wallets",
      icon: Coins,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    },
    {
      label: "Total Withdrawn",
      value: `${stats?.totalWithdrawnAllTime} USDT`,
      sub: "all time",
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      label: "Pending Withdrawals",
      value: stats?.pendingWithdrawals,
      sub: "awaiting review",
      icon: Clock,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
    {
      label: "Active Platforms",
      value: stats?.totalPlatforms,
      sub: "offerwalls",
      icon: Gamepad2,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Admins",
      value: "—",
      sub: "manage access",
      icon: UserCheck,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight uppercase text-white">Admin Overview</h2>
          <p className="text-muted-foreground">System-wide metrics and status.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => (
            <Card key={stat.label} className="bg-card border-border hover:border-border/80 transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</CardTitle>
                <div className={`w-8 h-8 rounded-lg ${stat.bg} border ${stat.border} flex items-center justify-center`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-9 w-28 mt-1" />
                ) : (
                  <div className="text-3xl font-black text-white">{stat.value ?? "—"}</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Link href="/admin/withdrawals">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-1 border-border hover:border-primary/40 hover:text-primary">
                  <ArrowDownUp className="h-5 w-5" />
                  <span className="text-xs font-bold">Manage Withdrawals</span>
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-1 border-border hover:border-primary/40 hover:text-primary">
                  <Users className="h-5 w-5" />
                  <span className="text-xs font-bold">Manage Users</span>
                </Button>
              </Link>
              <Link href="/admin/platforms">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-1 border-border hover:border-primary/40 hover:text-primary">
                  <Gamepad2 className="h-5 w-5" />
                  <span className="text-xs font-bold">Offerwalls</span>
                </Button>
              </Link>
              <Link href="/admin/verifications">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-1 border-border hover:border-primary/40 hover:text-primary">
                  <Clock className="h-5 w-5" />
                  <span className="text-xs font-bold">Verif. Codes</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {stats?.pendingWithdrawals && Number(stats.pendingWithdrawals) > 0 ? (
            <Card className="bg-orange-500/5 border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-orange-400">⚠ Action Required</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-white font-bold text-2xl">{stats.pendingWithdrawals} withdrawal{Number(stats.pendingWithdrawals) !== 1 ? 's' : ''} pending</p>
                <p className="text-muted-foreground text-sm">These requests are waiting for your review and approval.</p>
                <Link href="/admin/withdrawals">
                  <Button className="bg-orange-500 text-white hover:bg-orange-600 font-bold w-full">
                    Review Now <ArrowDownUp className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">All Clear</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-white font-bold text-lg">No pending withdrawals</p>
                <p className="text-muted-foreground text-sm">All withdrawal requests have been processed. Great work!</p>
                <div className="flex items-center gap-2 text-primary">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-sm font-bold">System healthy</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
