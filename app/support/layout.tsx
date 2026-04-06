"use client";

import Sidebar from "@/app/component/Sidebar";
import TopBar from "@/app/component/Topbar";

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full overflow-x-hidden">
      {/* Sidebar (with spacer) */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        
        {/* TopBar */}
        <TopBar />

        {/* Content */}
        <main
          className="
            mt-[80px]
            p-4 sm:p-6
            pb-[80px] sm:pb-6
            bg-gray-100
            flex-1
          "
        >
          {children}
        </main>

      </div>
    </div>
  );
}