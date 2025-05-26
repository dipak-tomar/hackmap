import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Users, Trophy } from "lucide-react"

export function HeroSection() {
  return (
    <section className="py-20 px-4 text-center bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Find Hackathons, Build Teams, Create Amazing Projects
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          HackMap connects developers, designers, and innovators to participate in hackathons, form winning teams, and
          showcase groundbreaking project ideas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" asChild>
            <Link href="/auth/signup">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/hackathons">Browse Hackathons</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Discover Events</h3>
            <p className="text-muted-foreground">Find hackathons that match your interests and skill level</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Form Teams</h3>
            <p className="text-muted-foreground">Connect with like-minded developers and build winning teams</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Win Prizes</h3>
            <p className="text-muted-foreground">Showcase your projects and compete for amazing prizes</p>
          </div>
        </div>
      </div>
    </section>
  )
}
