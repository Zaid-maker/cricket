import Link from "next/link";
import { ArrowRight, Play, Trophy, Users, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HomePageClient } from "@/components/home-page-client";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-16 md:py-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,white_1px,transparent_1px)] bg-[length:40px_40px]" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4 text-sm">
              🏏 Live Cricket Coverage
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
              Your Home for{" "}
              <span className="text-yellow-300">Live Cricket</span>
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/80 md:text-xl">
              Get real-time scores, ball-by-ball commentary, match updates, and
              comprehensive cricket coverage from around the world.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 text-base"
                asChild
              >
                <Link href="/live">
                  <Play className="h-4 w-4" />
                  Watch Live Matches
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-primary-foreground/30 text-base text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="/matches">
                  View All Matches
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Client-side content with SWR */}
      <HomePageClient />

      {/* Features Section */}
      <section className="border-t bg-muted/30 py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Everything Cricket, One Place
            </h2>
            <p className="text-muted-foreground">
              From live scores to in-depth analysis, we&apos;ve got you covered.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="rounded-lg border bg-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Features Data
const features = [
  {
    title: "Live Scores",
    description: "Ball-by-ball updates with real-time score tracking",
    icon: <Play className="h-6 w-6 text-primary" />,
  },
  {
    title: "Match Analysis",
    description: "In-depth statistics and performance insights",
    icon: <Trophy className="h-6 w-6 text-primary" />,
  },
  {
    title: "Team Tracker",
    description: "Follow your favorite teams and players",
    icon: <Users className="h-6 w-6 text-primary" />,
  },
  {
    title: "Full Schedule",
    description: "Complete cricket calendar across all formats",
    icon: <Calendar className="h-6 w-6 text-primary" />,
  },
];
