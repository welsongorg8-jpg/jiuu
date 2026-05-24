import { Layout } from "@/components/layout";
import { useListPlatforms, useGetMe } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, ExternalLink, ChevronRight, Play } from "lucide-react";
import { useState } from "react";

function buildOfferUrl(template: string, userId: number): string {
  return template
    .replace(/\{USER_ID\}/g, String(userId))
    .replace(/\[USER_ID\]/g, String(userId))
    .replace(/%7BUSER_ID%7D/g, String(userId));
}

export default function Platforms() {
  const { data: platformsData, isLoading: loadingPlatforms } = useListPlatforms();
  const { data: user } = useGetMe();
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null);

  const platforms = platformsData?.platforms ?? [];

  const getOfferUrl = (platform: any) => {
    if (!platform.apiEndpoint || !user?.id) return platform.apiEndpoint;
    return buildOfferUrl(platform.apiEndpoint, user.id);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Offerwalls</h2>
          <p className="text-muted-foreground text-sm mt-1">Select a platform to start earning USDT.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-200px)] min-h-[500px]">
          {/* Platform List */}
          <div className="w-full lg:w-72 shrink-0 flex flex-col gap-2 overflow-y-auto pr-1">
            {loadingPlatforms ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))
            ) : platforms.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border rounded-2xl">
                <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <p className="font-semibold text-sm">No platforms yet</p>
                <p className="text-muted-foreground text-xs mt-1">Check back soon!</p>
              </div>
            ) : (
              platforms.map((platform: any) => {
                const isSelected = selectedPlatform?.id === platform.id;
                const hasUrl = !!platform.apiEndpoint;
                return (
                  <button
                    key={platform.id}
                    onClick={() => hasUrl && setSelectedPlatform(platform)}
                    disabled={!hasUrl}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 group ${
                      isSelected
                        ? "bg-primary/15 border-primary/40 shadow-[0_0_12px_rgba(249,115,22,0.12)]"
                        : hasUrl
                        ? "bg-card border-border hover:border-primary/30 hover:bg-primary/5 cursor-pointer"
                        : "bg-card border-border opacity-50 cursor-not-allowed"
                    }`}
                  >
                    {platform.logoUrl ? (
                      <img src={platform.logoUrl} alt={platform.name} className="w-9 h-9 rounded-lg object-cover border border-border shrink-0" />
                    ) : (
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${isSelected ? "bg-primary/20 border-primary/40" : "bg-primary/10 border-primary/20"}`}>
                        <Zap className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm truncate ${isSelected ? "text-primary" : "text-white"}`}>{platform.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {hasUrl ? "Click to open" : "Coming soon"}
                      </p>
                    </div>
                    {hasUrl && (
                      <ChevronRight className={`h-4 w-4 shrink-0 transition-colors ${isSelected ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Iframe Panel */}
          <div className="flex-1 bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
            {selectedPlatform ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/50">
                  {selectedPlatform.logoUrl ? (
                    <img src={selectedPlatform.logoUrl} alt={selectedPlatform.name} className="w-7 h-7 rounded-md object-cover border border-border" />
                  ) : (
                    <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                    </div>
                  )}
                  <span className="font-bold text-sm text-white">{selectedPlatform.name}</span>
                  <a
                    href={getOfferUrl(selectedPlatform)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                  >
                    Open in new tab <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <iframe
                  key={selectedPlatform.id}
                  src={getOfferUrl(selectedPlatform)}
                  className="flex-1 w-full border-0"
                  allow="fullscreen"
                  title={selectedPlatform.name}
                />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                  <Play className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Select a Platform</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Choose an offerwall from the list on the left to start completing offers and earning USDT.
                </p>
                <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4 max-w-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-white">How earnings work</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Complete offers inside the platform. Once done, your Cachvio balance updates automatically. Minimum withdrawal is <span className="text-primary font-semibold">$5 USDT</span>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
