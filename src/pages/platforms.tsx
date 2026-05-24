import { Layout } from "@/components/layout";
import { useListPlatforms, useGetMe } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Zap } from "lucide-react";

function buildOfferUrl(template: string, userId: number): string {
  return template
    .replace(/\{USER_ID\}/g, String(userId))
    .replace(/\[USER_ID\]/g, String(userId))
    .replace(/%7BUSER_ID%7D/g, String(userId));
}

export default function Platforms() {
  const { data: platformsData, isLoading: loadingPlatforms } = useListPlatforms();
  const { data: user } = useGetMe();

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight uppercase">Offerwalls</h2>
          <p className="text-muted-foreground">Complete tasks and play games to earn USDT. Click "Open Wall" to start earning.</p>
        </div>

        {loadingPlatforms ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-52 w-full rounded-xl" />
            ))}
          </div>
        ) : platformsData?.platforms && platformsData.platforms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformsData.platforms.map((platform: any) => {
              const offerUrl = platform.apiEndpoint && user?.id
                ? buildOfferUrl(platform.apiEndpoint, user.id)
                : platform.apiEndpoint;

              return (
                <Card
                  key={platform.id}
                  className="bg-card border-border overflow-hidden group hover:border-primary/40 transition-all duration-300 flex flex-col hover:shadow-[0_0_20px_rgba(0,255,135,0.05)]"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      {platform.logoUrl ? (
                        <img src={platform.logoUrl} alt={platform.name} className="w-10 h-10 rounded-lg object-cover border border-border" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <Zap className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <CardTitle className="text-lg font-bold uppercase tracking-wide">{platform.name}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                      {platform.description || "Complete offers and tasks on this platform to earn USDT rewards."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto pt-0">
                    {offerUrl ? (
                      <a href={offerUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                        <Button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-black font-bold transition-all border border-primary/20 group-hover:border-primary/40">
                          Open Wall <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
                    ) : (
                      <Button disabled className="w-full bg-accent text-muted-foreground font-bold border border-border cursor-not-allowed">
                        Coming Soon
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="col-span-full text-center py-20 bg-card border border-border rounded-2xl">
            <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">No offerwalls available yet</h3>
            <p className="text-muted-foreground">New platforms are being added. Check back soon!</p>
          </div>
        )}

        {platformsData?.platforms && platformsData.platforms.length > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">How earnings work</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Complete the offers on each platform. Once you finish an offer, the offerwall automatically notifies us and your GameRewards balance updates instantly.
                  Minimum withdrawal is <span className="text-primary font-semibold">$5 USDT</span>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
