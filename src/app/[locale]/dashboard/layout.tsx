import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import { SidebarProvider } from "@/components/dashboard/SidebarProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-primary">
        <Sidebar />

        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto px-6 py-6 pb-24 lg:pb-6">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </SidebarProvider>
  );
}
