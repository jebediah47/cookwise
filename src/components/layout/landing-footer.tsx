import Link from "next/link";
import { ChefHat } from "lucide-react";
import { Icon } from "@iconify/react"

export function LandingFooter() {
  return (
    <footer className="bg-muted text-muted-foreground py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col gap-2">
             <Link href="/" className="flex items-center gap-2 mb-2">
                <ChefHat className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold font-headline text-foreground">Cookwise</span>
            </Link>
            <p className="text-sm">Improving your life, one meal at a time.</p>
            <div className="flex gap-3 mt-4">
              <Link href="https://www.instagram.com/cookwise.gr" className="hover:text-primary"><Icon icon="mdi:instagram" className="w-5 h-5" /></Link>
              <Link href="https://www.tiktok.com/@cookwise.gr" className="hover:text-primary"><Icon icon="ic:baseline-tiktok" className="w-5 h-5" /></Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><Link href="/#features" className="hover:text-primary">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-primary">Pricing</Link></li>
              <li><Link href="/support" className="hover:text-primary">Support</Link></li>
            </ul>
          </div>
           <div>
            <h4 className="font-semibold text-foreground mb-4">About</h4>
            <ul className="space-y-2">
              <li><Link href="/our-team" className="hover:text-primary">Our Team</Link></li>
              <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms-of-use" className="hover:text-primary">Terms of Use</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm">
          <p>&copy; 2025 Cookwise, a YES Team 4 Project. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
