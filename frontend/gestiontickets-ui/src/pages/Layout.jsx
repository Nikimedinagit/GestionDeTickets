import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet, useLocation } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Clock, Calendar } from "lucide-react";

const data = {
  navMain: [
    {
      title: "Panel Principal",
      url: "/dashboard",
    },
  ],
  navCollapsible: [
    {
      title: "Tickets",
      items: [
        {
          title: "Gestión Tickets",
          url: "/tickets/ticket",
          roles: ["ADMINISTRADOR", "CLIENTE", "DESARROLLADOR"],
        },
        {
          title: "Gestión Tareas",
          url: "/tickets/tarea",
        },
      ],
    },
    {
      title: "Clientes",
      items: [{ title: "Gestión Clientes", url: "/clientes/cliente" }],
    },
    {
      title: "Desarrolladores",
      items: [
        {
          title: "Gestión Desarrolladores",
          url: "/desarrolladores/desarrollador",
        },
      ],
    },
    {
      title: "Puestos",
      items: [{ title: "Gestión Puestos", url: "/puestos/puesto" }],
    },
    {
      title: "Categorías",
      items: [{ title: "Gestión Categorías", url: "/categorias/categoria" }],
    },
    {
      title: "Resultados",
      items: [
        { title: "Gráficos", url: "/resultados/grafico" },
        {
          title: "Clientes Estadísticos",
          url: "/resultados/cliente-estadistico",
        },
        {
          title: "Desarrolladores Estadísticos",
          url: "/resultados/desarrollador-estadistico",
        },
      ],
    },
  ],
};

export default function DashboardLayout() {
  const location = useLocation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const day = time.getDate();
  const year = time.getFullYear();
  const monthRaw = time.toLocaleDateString("es-ES", { month: "short" });
  const month =
    monthRaw.charAt(0).toUpperCase() + monthRaw.slice(1).replace(".", "");

  const formattedDate = `${day} ${month} ${year}`;

  const formattedTime = time.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const getBreadcrumbs = () => {
    const currentPath = location.pathname;
    let breadcrumb = { parent: "Escritorio", child: "Panel Principal" };

    const mainItem = data.navMain.find((item) => item.url === currentPath);
    if (mainItem) return { parent: "Escritorio", child: mainItem.title };

    data.navCollapsible.forEach((group) => {
      const subItem = group.items.find((item) => item.url === currentPath);
      if (subItem) {
        breadcrumb = { parent: group.title, child: subItem.title };
      }
    });

    return breadcrumb;
  };

  const { parent, child } = getBreadcrumbs();

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="bg-white sticky top-0 flex h-14 shrink-0 items-center justify-between border-b px-6 transition-all z-50">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 text-slate-600 hover:text-slate-900" />
            <Separator orientation="vertical" className="mx-2 h-4" />
            <nav className="flex items-center gap-2 text-[13px]">
              <span className="text-slate-400 font-medium">{parent}</span>
              <ChevronRight className="size-3 text-slate-300" />
              <span className="text-[#1e293b] font-bold">{child}</span>
            </nav>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-[13px]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-[#1e293b]" />
                <span className="text-[#1e293b] font-medium whitespace-nowrap text-[14px]">
                  {formattedDate}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-[#1e293b]/5 px-3 py-1 rounded-md">
                <Clock className="size-4 text-[#1e293b]" />
                <span className="text-[#1e293b] font-bold tabular-nums text-[14px]">
                  {formattedTime}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-3 bg-[#F8FAFC] min-h-screen">
          <div className="max-w-[1440px] mx-auto">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
