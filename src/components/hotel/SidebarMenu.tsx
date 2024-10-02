"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@clerk/nextjs";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  value?: string;
}
export default function SidebarMenu({
  setActiveSection,
  activeSection,
  sidebarItems,
}: {
  setActiveSection: (section: string) => void;
  activeSection: string;
  sidebarItems: SidebarItem[];
}) {
  const { userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const handleClick = (item: any) => {
    if (pathname !== `/${userId}/author/dashboard`) {
      router.push(`/${userId}/author/dashboard`);
    }
    setActiveSection(item.value);
  };

  return (
    <div className="flex h-fit">
      <TooltipProvider>
        <aside className="w-16 bg-white dark:bg-slate-900 p-3 flex flex-col items-center space-y-4 rounded-md border">
          {sidebarItems?.map((item) => (
            <Tooltip key={item.value}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleClick(item)}
                  className={`text-gray-400 hover:text-white ${
                    activeSection === item.value ? "bg-gray-800 text-white" : ""
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </aside>
      </TooltipProvider>
    </div>
  );
}
