import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function DashboardPage() {
  return (
    <SidebarProvider>
      {/* 1. El Sidebar va a la izquierda */}
      <AppSidebar />
      
      {/* 2. El Inset es el contenedor del contenido principal */}
      <SidebarInset>
        {/* Header con el botón para esconder el sidebar y el breadcrumb */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Gestión</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Mis Tickets</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* 3. Área de contenido real */}
        <div className="flex flex-1 flex-col gap-4 p-4">
           {/* Aquí es donde pondrás tus tablas o tarjetas de tickets */}
           <div className="grid auto-rows-min gap-4 md:grid-cols-3">
             <div className="aspect-video rounded-xl bg-slate-100/50 border" />
             <div className="aspect-video rounded-xl bg-slate-100/50 border" />
             <div className="aspect-video rounded-xl bg-slate-100/50 border" />
           </div>
           <div className="min-h-[100vh] flex-1 rounded-xl bg-slate-100/50 border md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}