import { useState } from "react";
import { AdminLayout as Layout } from "@/components/admin-layout";
import { useListAllPlatforms, useCreatePlatform, useUpdatePlatform, useDeletePlatform, getListAllPlatformsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Copy, Check, Trash2, Link2, Globe, Star } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const BASE_URL = window.location.origin;

function PostbackUrl({ platformId }: { platformId: number }) {
  const [copied, setCopied] = useState(false);
  const url = `${BASE_URL}/api/postback/${platformId}?user_id={USER_ID}&amount={AMOUNT}&txid={TXN_ID}&secret={YOUR_SECRET}`;

  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1.5">
      <code className="text-xs font-mono text-primary truncate max-w-[200px]">{url.slice(0, 38)}…</code>
      <button onClick={copy} className="shrink-0 text-muted-foreground hover:text-primary transition-colors">
        {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

export default function AdminPlatforms() {
  const { data, isLoading } = useListAllPlatforms();
  const queryClient = useQueryClient();
  const updatePlatform = useUpdatePlatform();
  const deletePlatform = useDeletePlatform();
  const { toast } = useToast();

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Delete platform "${name}"?`)) return;
    deletePlatform.mutate({ platformId: id }, {
      onSuccess: () => {
        toast({ title: "Platform deleted" });
        queryClient.invalidateQueries({ queryKey: getListAllPlatformsQueryKey() });
      },
      onError: () => toast({ variant: "destructive", title: "Failed to delete" }),
    });
  };

  const handleSetFeatured = (id: number, name: string, currentPlacement: string) => {
    const newPlacement = currentPlacement === "homepage" ? "dedicated" : "homepage";
    const action = newPlacement === "homepage" ? "featured on landing page" : "removed from landing page";

    updatePlatform.mutate(
      { platformId: id, data: { placement: newPlacement as any } },
      {
        onSuccess: () => {
          toast({ title: newPlacement === "homepage" ? `"${name}" is now featured on the landing page!` : `"${name}" removed from landing page` });
          queryClient.invalidateQueries({ queryKey: getListAllPlatformsQueryKey() });
        },
        onError: () => toast({ variant: "destructive", title: `Failed to update placement` }),
      }
    );
  };

  const featuredPlatform = data?.platforms?.find((p: any) => p.placement === "homepage");

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-foreground">Offerwalls</h2>
            <p className="text-muted-foreground text-sm">Manage offerwall platforms. Each gets a unique postback URL.</p>
          </div>
          <PlatformDialog />
        </div>

        {/* Featured platform info */}
        <div className={`rounded-xl p-4 border flex items-start gap-3 ${featuredPlatform ? "bg-orange-50 border-primary/25" : "bg-card border-border"}`}>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${featuredPlatform ? "bg-primary/15 border border-primary/25" : "bg-muted border border-border"}`}>
            <Globe className={`h-4 w-4 ${featuredPlatform ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-bold text-sm ${featuredPlatform ? "text-primary" : "text-foreground"}`}>
              {featuredPlatform ? `Featured on Landing Page: "${featuredPlatform.name}"` : "No Platform Featured on Landing Page"}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {featuredPlatform
                ? "This platform appears in an iframe on the landing page. Visitors can use it before signing up. Click the star icon to change or remove it."
                : "Click the star icon next to any platform to feature it on the landing page inside an iframe for visitors."}
            </p>
          </div>
        </div>

        {/* Postback info */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Link2 className="h-4 w-4 text-primary" />
            <h4 className="font-bold text-foreground text-sm">How Automatic Crediting Works</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Each platform has a unique <span className="text-primary font-mono font-semibold">Postback URL</span>.
            Paste it in the offerwall's dashboard. When a user completes an offer, the offerwall calls this URL and the user's balance is credited automatically.
          </p>
        </div>

        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="border-border">
                    <TableHead className="font-bold">Name</TableHead>
                    <TableHead className="font-bold">Postback URL</TableHead>
                    <TableHead className="font-bold">Offer URL</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold text-center">Featured</TableHead>
                    <TableHead className="text-right font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-10"><Loader2 className="animate-spin h-6 w-6 mx-auto text-primary" /></TableCell></TableRow>
                  ) : data?.platforms?.map((p: any) => {
                    const isFeatured = p.placement === "homepage";
                    return (
                      <TableRow key={p.id} className={`border-border transition-colors ${isFeatured ? "bg-orange-50/60 hover:bg-orange-50" : "hover:bg-muted/30"}`}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {p.logoUrl && <img src={p.logoUrl} alt={p.name} className="w-6 h-6 rounded object-cover border border-border" />}
                            <span className="font-bold text-foreground">{p.name}</span>
                            {isFeatured && (
                              <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Featured</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell><PostbackUrl platformId={p.id} /></TableCell>
                        <TableCell>
                          {p.apiEndpoint ? (
                            <span className="text-xs font-mono text-muted-foreground truncate block max-w-[130px]">
                              {p.apiEndpoint.slice(0, 28)}{p.apiEndpoint.length > 28 ? "…" : ""}
                            </span>
                          ) : <span className="text-muted-foreground text-sm">—</span>}
                        </TableCell>
                        <TableCell>
                          <Badge variant={p.isEnabled ? 'default' : 'secondary'} className={p.isEnabled ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100" : ""}>
                            {p.isEnabled ? 'Active' : 'Disabled'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <button
                            onClick={() => handleSetFeatured(p.id, p.name, p.placement)}
                            disabled={updatePlatform.isPending}
                            title={isFeatured ? "Remove from landing page" : "Set as featured on landing page"}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-all duration-200 ${
                              isFeatured
                                ? "bg-primary text-white shadow-[0_2px_8px_rgba(249,115,22,0.3)]"
                                : "bg-muted text-muted-foreground hover:bg-primary/15 hover:text-primary"
                            }`}
                          >
                            <Star className={`h-4 w-4 ${isFeatured ? "fill-white" : ""}`} />
                          </button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <PlatformDialog platform={p} />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-0"
                              onClick={() => handleDelete(p.id, p.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {(!data?.platforms || data.platforms.length === 0) && !isLoading && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        No platforms yet. Add your first offerwall above.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

function PlatformDialog({ platform }: { platform?: any }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createPlatform = useCreatePlatform();
  const updatePlatform = useUpdatePlatform();
  const [open, setOpen] = useState(false);

  const [name, setName] = useState(platform?.name || "");
  const [description, setDescription] = useState(platform?.description || "");
  const [logoUrl, setLogoUrl] = useState(platform?.logoUrl || "");
  const [apiEndpoint, setApiEndpoint] = useState(platform?.apiEndpoint || "");
  const [secretKey, setSecretKey] = useState(platform?.secretKey || "");
  const [placement, setPlacement] = useState<any>(platform?.placement || "dedicated");
  const [isEnabled, setIsEnabled] = useState(platform?.isEnabled ?? true);

  const handleSave = () => {
    const payload = { name, description, logoUrl, apiEndpoint, secretKey, placement, isEnabled };
    const mutation = platform
      ? updatePlatform.mutateAsync({ platformId: platform.id, data: payload })
      : createPlatform.mutateAsync({ data: payload });

    mutation.then(() => {
      toast({ title: platform ? "Platform updated" : "Platform created" });
      queryClient.invalidateQueries({ queryKey: getListAllPlatformsQueryKey() });
      setOpen(false);
    }).catch(err => {
      toast({ variant: "destructive", title: "Error", description: err.data?.error || "Failed" });
    });
  };

  const isPending = createPlatform.isPending || updatePlatform.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {platform ? (
          <Button variant="outline" size="sm" className="border-border hover:border-primary/40 hover:text-primary text-xs h-8">Edit</Button>
        ) : (
          <Button className="bg-primary text-white font-bold hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Add Offerwall
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-card border-border max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{platform ? 'Edit Offerwall' : 'Add Offerwall'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Platform Name *</Label>
            <Input placeholder="e.g. OfferToro" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Description</Label>
            <Input placeholder="Short description" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Offer Wall URL</Label>
            <Input placeholder="https://example.com/wall?uid={USER_ID}" value={apiEndpoint} onChange={e => setApiEndpoint(e.target.value)} className="font-mono text-sm" />
            <p className="text-xs text-muted-foreground">Use <code className="text-primary">{"{USER_ID}"}</code> as a placeholder — it will be replaced automatically.</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Secret Key</Label>
            <Input placeholder="Secret key from offerwall dashboard" value={secretKey} onChange={e => setSecretKey(e.target.value)} className="font-mono text-sm" />
          </div>
          {platform && (
            <div className="bg-orange-50 border border-primary/20 rounded-lg p-3 space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Postback URL</Label>
              <PostbackUrl platformId={platform.id} />
              <p className="text-xs text-muted-foreground">Paste this URL in the offerwall's postback settings.</p>
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Logo URL</Label>
            <Input placeholder="https://..." value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className="font-mono text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Placement</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={placement} onChange={e => setPlacement(e.target.value)}>
              <option value="dedicated">Dedicated Page</option>
              <option value="homepage">Featured on Homepage (Landing Page iframe)</option>
              <option value="sidebar">Sidebar</option>
            </select>
            {placement === "homepage" && <p className="text-xs text-primary font-medium">This platform will appear in an iframe on the landing page for all visitors.</p>}
          </div>
          <div className="flex items-center gap-3 py-1">
            <Switch id="enabled" checked={isEnabled} onCheckedChange={setIsEnabled} />
            <Label htmlFor="enabled" className="cursor-pointer">{isEnabled ? "Platform is Active" : "Platform is Disabled"}</Label>
          </div>
          <Button onClick={handleSave} disabled={isPending || !name} className="w-full bg-primary text-white font-bold hover:bg-primary/90">
            {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : (platform ? "Save Changes" : "Create Platform")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
