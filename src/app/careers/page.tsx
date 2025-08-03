import { LandingHeader } from '@/components/layout/landing-header';
import { LandingFooter } from '@/components/layout/landing-footer';
import { ScrollReveal } from '@/components/scroll-reveal';
import { Button } from '@/components/ui/button';
import { Briefcase, Github, Users } from 'lucide-react';
import Link from 'next/link';

export default function CareersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      <main className="flex-1 pt-16 flex items-center">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 max-w-2xl">
             <ScrollReveal className="flex flex-col items-center justify-center space-y-4 text-center">
                <Briefcase className="w-16 h-16 text-primary" />
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                  Careers at Cookwise
                </h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  So... this is a little awkward.
                </p>
            </ScrollReveal>
             <ScrollReveal delay={200} className="mt-12 text-center space-y-6">
                <p className="text-lg">
                    We're incredibly flattered that you're interested in joining our team. It means we're doing something right! However, Cookwise is a passion project brought to life by the dedicated students of <strong>YES Team 4</strong>.
                </p>
                <p className="text-lg text-muted-foreground">
                   Right now, our "team" is more about pull requests than paychecks. We don't have open positions, a ping-pong table, or a fancy office—just a shared goal of making cooking fun and accessible for everyone.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Button asChild size="lg">
                        <Link href="/our-team">
                            <Users className="mr-2 h-5 w-5" />
                            Meet the (Student) Team
                        </Link>
                    </Button>
                     <Button asChild size="lg" variant="secondary">
                        <Link href="https://github.com/jebediah47/cookwise" target="_blank">
                             <Github className="mr-2 h-5 w-5" />
                            View the Project
                        </Link>
                    </Button>
                </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
