"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
} from "@/components/ui/sidebar";
import { ChefHat, Sparkles, Heart, Settings, ListChecks, Truck, ClipboardList, Target } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";

const navItems = [
  { href: "/app", label: "Generate", icon: Sparkles },
  { href: "/app/favorites", label: "Favorites", icon: Heart },
  { href: "/app/grocery-list", label: "Meal Planner", icon: ListChecks },
  { href: "/app/my-lists", label: "My Lists", icon: ClipboardList },
  { href: "/app/delivery-status", label: "Deliveries", icon: Truck },
  { href: "/app/nutrition-hub", label: "Nutrition Hub", icon: Target },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <>
      <SidebarHeader>
        <Link href="/app" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <ChefHat className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold font-headline group-data-[collapsible=icon]:hidden">Cookwise</span>
        </Link>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                size="lg"
                isActive={pathname === item.href}
                tooltip={{ children: item.label }}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t">
        <SignedIn>
            <div className="flex items-center gap-3 p-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
                <UserButton afterSignOutUrl="/" />
                <div className="group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-semibold truncate">{user?.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
            </div>
        </SignedIn>
      </SidebarFooter>
    </>
  );
}
