import { AppLayout } from "@/components/layout/app-layout";

export default function AppPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
