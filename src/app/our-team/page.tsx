import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LandingHeader } from "@/components/layout/landing-header";
import { LandingFooter } from "@/components/layout/landing-footer";
import { ScrollReveal } from "@/components/scroll-reveal";

const teamMembers = [
  {
    name: "Christian Llupo",
    role: "1st Vocational High School of Nea Filadelfeia",
    imageUrl: "https://placehold.co/400x400.png",
  },
  {
    name: "Dimitris Violantis",
    role: "3rd General Lyceum of Petroupoli",
    imageUrl: "https://placehold.co/400x400.png",
  },
  {
    name: "Aphrodite Toula",
    role: "9th General Lyceum of Peristeri",
    imageUrl: "https://placehold.co/400x400.png",
  },
  {
    name: "Aggelos Giachanatzis",
    role: "2nd Model Lyceum of Athens",
    imageUrl: "https://placehold.co/400x400.png",
  },
  {
    name: "Marianna Misarli",
    role: "1st General Lyceum of Metsovo",
    imageUrl: "https://placehold.co/400x400.png",
  },
  {
    name: "Socrates Chalivides",
    role: "Costeas Geitonas Schools",
    imageUrl: "https://placehold.co/400x400.png",
  },
  {
    name: "Odysseas Lesses",
    role: "Lyceum of Evdilou, Ikaria",
    imageUrl: "https://placehold.co/400x400.png",
  },
];

export default function OurTeamPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      <main className="flex-1 pt-16">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <ScrollReveal className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                Meet the Minds Behind{" "}
                <span className="text-primary">Cookwise</span>
              </h1>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We are YES Team 4, a passionate group of students, developers,
                and innovators dedicated to making cooking accessible and fun
                for everyone.
              </p>
            </ScrollReveal>
            <div className="flex flex-wrap items-stretch justify-center gap-8">
              {teamMembers.map((member, index) => (
                <ScrollReveal
                  key={member.name}
                  delay={index * 150}
                  className="w-72"
                >
                  <Card className="text-center h-full flex flex-col">
                    <CardHeader className="items-center">
                      <Image
                        src={member.imageUrl}
                        alt={`Portrait of ${member.name}`}
                        width={150}
                        height={150}
                        className="rounded-full object-cover mb-4 border-4 border-primary/20"
                      />
                      <CardTitle>{member.name}</CardTitle>
                      <CardDescription className="text-primary font-semibold">
                        {member.role}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
