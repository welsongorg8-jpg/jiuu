import { useState } from "react";
import { Layout } from "@/components/layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateWithdrawal, useListWithdrawals, useGetBalance, getGetBalanceQueryKey, getListWithdrawalsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, ExternalLink } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const formatMoney = (value?: string | number | null) => {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
};

const withdrawSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  network: z.enum(["BEP20", "TRC20"]),
  walletAddress: z.string().min(10, "Invalid wallet address"),
});

export default function Withdraw() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: balanceData } = useGetBalance();
  const { data: historyData, isLoading: historyLoading } = useListWithdrawals({ page: 1, limit: 10 });
  const withdrawMutation = useCreateWithdrawal();

  const form = useForm<z.infer<typeof withdrawSchema>>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: "",
      network: "BEP20",
      walletAddress: "",
    },
  });

  const onSubmit = (data: z.infer<typeof withdrawSchema>) => {
    withdrawMutation.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "Withdrawal Requested", description: "Your request is being processed." });
        form.reset();
        queryClient.invalidateQueries({ queryKey: getGetBalanceQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListWithdrawalsQueryKey({ page: 1, limit: 10 }) });
      },
      onError: (error: any) => {
        toast({ variant: "destructive", title: "Withdrawal Failed", description: error.data?.error || "Could not process request" });
      },
    });
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div>
          <h2 className="text-3xl font-black tracking-tight uppercase">Withdraw Funds</h2>
          <p className="text-muted-foreground">Transfer USDT to your crypto wallet.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="uppercase tracking-wider">Request Withdrawal</CardTitle>
                <CardDescription>Minimum withdrawal: 5 USDT</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 p-4 bg-accent rounded-lg border border-border flex justify-between items-center">
                  <span className="text-muted-foreground uppercase text-xs font-bold">Available</span>
                  <span className="font-bold text-white">{formatMoney(balanceData?.balance)} USDT</span>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground uppercase text-xs font-bold">Amount (USDT)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="10.00" {...field} className="bg-background border-input focus-visible:ring-primary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="network"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground uppercase text-xs font-bold">Network</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background border-input focus-visible:ring-primary">
                                <SelectValue placeholder="Select network" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="BEP20">BNB Smart Chain (BEP20)</SelectItem>
                              <SelectItem value="TRC20">Tron (TRC20)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="walletAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground uppercase text-xs font-bold">Wallet Address</FormLabel>
                          <FormControl>
                            <Input placeholder="0x..." {...field} className="bg-background border-input focus-visible:ring-primary font-mono text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-primary text-black font-bold uppercase tracking-wider hover:bg-primary/90 shadow-[0_0_15px_rgba(0,255,135,0.2)] mt-4"
                      disabled={withdrawMutation.isPending}
                    >
                      {withdrawMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Withdraw Now"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-card border-border h-full">
              <CardHeader>
                <CardTitle className="uppercase tracking-wider">Withdrawal History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-accent">
                      <TableRow className="border-border">
                        <TableHead className="font-bold text-muted-foreground">Date</TableHead>
                        <TableHead className="font-bold text-muted-foreground">Amount</TableHead>
                        <TableHead className="font-bold text-muted-foreground">Network</TableHead>
                        <TableHead className="font-bold text-muted-foreground">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historyLoading ? (
                        <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="animate-spin h-6 w-6 mx-auto text-primary"/></TableCell></TableRow>
                      ) : historyData?.withdrawals?.length ? (
                        historyData.withdrawals.map((w) => (
                          <TableRow key={w.id} className="border-border">
                            <TableCell className="text-muted-foreground whitespace-nowrap">
                              {new Date(w.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="font-bold text-white">{w.amount} USDT</TableCell>
                            <TableCell><Badge variant="outline" className="font-mono">{w.network}</Badge></TableCell>
                            <TableCell>
                              <Badge variant={w.status === 'paid' ? 'default' : w.status === 'rejected' ? 'destructive' : 'secondary'} className="uppercase tracking-wider text-[10px]">
                                {w.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                            No withdrawals yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
