import { useState } from "react";
import { AdminLayout as Layout } from "@/components/admin-layout";
import { useListAllPlatforms, useCreatePlatform, useUpdatePlatform, useDeletePlatform, getListAllPlatformsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Copy, Check, Trash2, Link2 } from "lucide-react";
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
      <code className="text-xs font-mono text-primary truncate max-w-[220px]">{url.slice(0, 40)}…</code>
      <button onClick={copy} className="shrink-0 text-muted-foreground hover:text-primary transition-colors">
        {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

export default function AdminPlatforms() {
  const { data, isLoading } = useListAllPlatforms();
  const queryClient = useQueryClient();
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tight uppercase text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Offerwalls</h2>
            <p className="text-muted-foreground">Manage offerwall platforms. Each platform gets a unique postback URL.</p>
          </div>
          <PlatformDialog />
        </div>

        {/* Postback info box */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Link2 className="h-4 w-4 text-primary" />
            <h4 className="font-bold text-white text-sm">How automatic crediting works</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Each platform has a unique <span className="text-primary font-mono font-semibold">Postback URL</span>.
            Copy it and paste it in the offerwall's dashboard as the postback/callback URL.
            When a user completes an offer, the offerwall calls this URL and the user's balance is credited automatically.
          </p>
          <p className="text-xs text-muted-foreground">
            Set a <span className="text-primary font-semibold">Secret Key</span> in the platform settings — the same one you enter in the offerwall dashboard — to validate that postbacks are genuine.
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent">
                  <TableRow className="border-border">
                    <TableHead>Name</TableHead>
                    <TableHead>Postback URL</TableHead>
                    <TableHead>Offer URL</TableHead>
                    <TableHead>Placement</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="animate-spin h-6 w-6 mx-auto text-primary" /></TableCell></TableRow>
                  ) : data?.platforms?.map((p: any) => (
                    <TableRow key={p.id} className="border-border">
                      <TableCell className="font-bold text-white">{p.name}</TableCell>
                      <TableCell><PostbackUrl platformId={p.id} /></TableCell>
                      <TableCell>
                        {p.apiEndpoint ? (
                          <span className="text-xs font-mono text-muted-foreground truncate block max-w-[140px]">
                            {p.apiEndpoint.slice(0, 30)}{p.apiEndpoint.length > 30 ? "…" : ""}
                          </span>
                        ) : <span className="text-muted-foreground text-sm">—</span>}
                      </TableCell>
                      <TableCell className="uppercase text-xs text-muted-foreground">{p.placement}</TableCell>
                      <TableCell>
                        <Badge variant={p.isEnabled ? 'default' : 'secondary'} className={p.isEnabled ? "shadow-[0_0_6px_rgba(0,255,135,0.3)]" : ""}>
                          {p.isEnabled ? 'Active' : 'Disabled'}
                        </Badge>
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
                  ))}
                  {(!data?.platforms || data.platforms.length === 0) && !isLoading && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No platforms yet. Add your first offerwall above.</TableCell>
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
          <Button variant="outline" size="sm" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-black">Edit</Button>
        ) : (
          <Button className="bg-primary text-black font-bold hover:bg-primary/90">
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
            <Input placeholder="e.g. MyChips" value={name} onChange={e => setName(e.target.value)} className="bg-background" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Description</Label>
            <Input placeholder="Short description" value={description} onChange={e => setDescription(e.target.value)} className="bg-background" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Offer Wall URL</Label>
            <Input
              placeholder="https://mychips.com/wall?uid={USER_ID}"
              value={apiEndpoint}
              onChange={e => setApiEndpoint(e.target.value)}
              className="bg-background font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Use <code className="text-primary">{"{USER_ID}"}</code> as a placeholder — it will be replaced with the user's ID automatically.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Secret Key</Label>
            <Input
              placeholder="Enter the secret key from the offerwall dashboard"
              value={secretKey}
              onChange={e => setSecretKey(e.target.value)}
              className="bg-background font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Enter the same secret key configured in the offerwall's postback settings. Used to verify postback requests are genuine.
            </p>
          </div>

          {platform && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Postback URL</Label>
              <PostbackUrl platformId={platform.id} />
              <p className="text-xs text-muted-foreground">Copy this URL and paste it in the offerwall's postback/callback settings.</p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Logo URL</Label>
            <Input placeholder="https://..." value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className="bg-background font-mono text-sm" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Placement</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={placement} onChange={e => setPlacement(e.target.value)}
            >
              <option value="dedicated">Dedicated Page</option>
              <option value="homepage">Homepage</option>
              <option value="sidebar">Sidebar</option>
            </select>
          </div>

          <div className="flex items-center gap-3 py-1">
            <Switch id="enabled" checked={isEnabled} onCheckedChange={setIsEnabled} />
            <Label htmlFor="enabled" className="cursor-pointer">
              {isEnabled ? "Platform is Active" : "Platform is Disabled"}
            </Label>
          </div>

          <Button onClick={handleSave} disabled={isPending || !name} className="w-full bg-primary text-black font-bold hover:bg-primary/90">
            {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : (platform ? "Save Changes" : "Create Platform")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
