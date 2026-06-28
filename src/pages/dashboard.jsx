import React from "react";
import { LayoutDashboard } from "lucide-react";
import { AppSidebar } from "@/layouts/app-sidebar.jsx";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppChart } from "@/layouts/app-chart";
import { StatisticsCards } from "@/layouts/app-statistic-card";
import { AppTitlePage } from "@/layouts/app-titlepage";

function Dashboard() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside>
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      </aside>

      {/* Main Content */}  
      <main className="flex-1  bg-gray-100 p-8 flex flex-col items-center justify-center">
        <section>
          <AppTitlePage title="Dashboard" Icon={LayoutDashboard} /> 
        </section>
        {/* Chart and Statistics Section */}
        <section className="flex flex-row bg-white shadow-md rounded-b-lg p-15 w-[1368px] h-[782px] shadow-slate-200">
          {/* Chart Section */}
          <div className="flex-1 px-4">
            <AppChart />
          </div>

          {/* Statistics Section */}
          <div className="flex-1 pl-4 flex flex-col space-y-1">
            <StatisticsCards />
          </div>
        </section>

      </main>
    </div>
  );
}

export default Dashboard;