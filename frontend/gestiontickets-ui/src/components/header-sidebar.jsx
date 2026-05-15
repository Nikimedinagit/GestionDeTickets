"use client"
import * as React from "react"
import { 
  SidebarMenu, 
  SidebarMenuItem 
} from "@/components/ui/sidebar"

export function HeaderSidebar() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex w-full items-start justify-start px-2 py-4">
          <div className="flex w-full items-start justify-start">
            <img 
              src="/logo-completo-tickets.png" 
              alt="Logo TicketApp" 
              className="h-auto w-full max-w-[180px] object-contain" 
            />
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}