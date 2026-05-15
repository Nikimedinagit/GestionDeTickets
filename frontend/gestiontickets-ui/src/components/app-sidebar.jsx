"use client";
import * as React from "react";
import {
  ChevronRight,
  Ticket,
  LayoutDashboard,
  Users,
  Code2,
  Network,
  Layers,
  BarChart3,
  User,
  LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HeaderSidebar } from "@/components/header-sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setOpenMobile } = useSidebar();

  const [openGroup, setOpenGroup] = React.useState(null);

  React.useEffect(() => {
    data.navCollapsible.forEach(group => {
      if (group.items.some(item => location.pathname === item.url)) {
        setOpenGroup(group.title);
      }
    });
  }, [location.pathname]);

  const handleNavigation = () => {
    setOpenMobile(false);
  };

  const userJson = localStorage.getItem("user");
  const user = userJson
    ? JSON.parse(userJson)
    : { nombreCompleto: "Usuario", email: "", rol: "" };
  const userRole = user.rol;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const filtrarPorRol = (items) => {
    return items.filter((item) => {
      if (!item.roles) return true;
      return item.roles.includes(userRole);
    });
  };

  const isActive = (url) => location.pathname === url;
  return (
    <Sidebar className="bg-white border-r-0" {...props}>
      <SidebarHeader className="p-2">
        <HeaderSidebar />
      </SidebarHeader>

     <SidebarContent className="px-1 mt-0">
        <SidebarGroup>
          <SidebarMenu>
            {filtrarPorRol(data.navMain).map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.url)}
                  className={`h-9 px-3 transition-all duration-300 rounded-lg ${
                    isActive(item.url) ? "bg-[#1e293b]/10 text-[#1e293b] font-bold" : "hover:bg-[#1e293b]/5"
                  }`}
                >
                  <Link to={item.url} onClick={handleNavigation}>
                    <item.icon className={`size-4 ${isActive(item.url) ? "text-[#1e293b]" : "text-slate-500"}`} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 font-bold text-[11px] uppercase mb-1 px-1">
            Navegación
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {filtrarPorRol(data.navCollapsible).map((group) => (
              <Collapsible 
                key={group.title} 
                className="group/collapsible"
                open={openGroup === group.title}
                onOpenChange={() => {
                  setOpenGroup(openGroup === group.title ? null : group.title);
                }}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="h-9 px-3 transition-all duration-300 rounded-lg hover:bg-[#1e293b]/5">
                      <group.icon className="size-4 text-[#1e293b]" />
                      <span className="font-medium">{group.title}</span>
                      <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90 opacity-50" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-1 ml-4 flex flex-col gap-1 border-l border-slate-200">
                      {filtrarPorRol(group.items).map((item) => (
                        <Link
                          key={item.title}
                          to={item.url}
                          onClick={handleNavigation} 
                          className={`block py-1 pl-4 text-[13.5px] font-medium rounded-lg transition-colors ${
                            isActive(item.url) 
                              ? "text-[#1e293b] bg-[#1e293b]/5 border-l-2 border-[#1e293b] -ml-[1px] font-bold" 
                              : "text-slate-500 hover:bg-[#1e293b]/5 hover:text-[#1e293b]"
                          }`}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />

      <SidebarFooter className="border-t border-slate-100 p-2">
        <SidebarMenu className="gap-1">
          <div className="flex items-center gap-3 px-2 py-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1e293b] text-white font-bold text-xs shadow-sm">
              IM
            </div>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[14px] font-bold text-slate-900">
                {user.nombreCompleto || "-"}
              </span>
              <span className="text-[12px] font-medium text-slate-400">
                {user.email}
              </span>
            </div>
          </div>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              asChild
              className="h-9 px-3 transition-all duration-300 outline-none rounded-lg
                      hover:bg-red-50 hover:text-[#1e293b]
                      data-[state=open]:text-[#1e293b] data-[state=open]:bg-[#1e293b]/5
                      focus-visible:ring-0"
            >
              <button className="group flex items-center gap-3 w-full px-2 py-2 rounded-lg transition-colors hover:bg-red-50">
                <LogOut className="size-4 text-[#1e293b] group-hover:text-red-500 transition-colors" />

                <span className="text-sm font-semibold text-slate-700 group-hover:text-red-600 transition-colors">
                  Cerrar Sesión
                </span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

const data = {
  navMain: [
    {
      title: "Panel Principal",
      url: "/dashboard",
      icon: LayoutDashboard,
      roles: ["ADMINISTRADOR", "CLIENTE", "DESARROLLADOR"],
    },
  ],
  navCollapsible: [
    {
      title: "Tickets",
      icon: Ticket,
      roles: ["ADMINISTRADOR", "CLIENTE", "DESARROLLADOR"],
      items: [
        {
          title: "Gestión Tickets",
          url: "/tickets/ticket",
          roles: ["ADMINISTRADOR", "CLIENTE", "DESARROLLADOR"],
        },
        {
          title: "Gestión Tareas",
          url: "/tickets/tarea",
          roles: ["ADMINISTRADOR", "DESARROLLADOR"],
        },
      ],
    },
    {
      title: "Clientes",
      icon: Users,
      roles: ["ADMINISTRADOR"],
      items: [{ title: "Gestión Clientes", url: "/clientes/cliente" }],
    },
    {
      title: "Desarrolladores",
      icon: Code2,
      roles: ["ADMINISTRADOR"],
      items: [
        {
          title: "Gestión Desarrolladores",
          url: "/desarrolladores/desarrollador",
        },
      ],
    },
    {
      title: "Puestos",
      icon: Network,
      roles: ["ADMINISTRADOR"],
      items: [{ title: "Gestión Puestos", url: "/puestos/puesto" }],
    },
    {
      title: "Categorías",
      icon: Layers,
      roles: ["ADMINISTRADOR"],
      items: [{ title: "Gestión Categorías", url: "/categorias/categoria" }],
    },
    {
      title: "Resultados",
      icon: BarChart3,
      roles: ["ADMINISTRADOR", "DESARROLLADOR"],
      items: [
        { title: "Gráficos", url: "/resultados/grafico" },
        { title: "Clientes Estadísticos", url: "/resultados/cliente-estadistico" },
        { title: "Desarrolladores Estadísticos", url: "/resultados/desarrollador-estadistico" },
      ],
    },
  ],
};
