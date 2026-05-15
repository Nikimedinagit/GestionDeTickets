import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative min-h-svh w-full overflow-hidden bg-slate-50">
      <div className="absolute inset-0 md:hidden">
        <img
          src="/imagen-login.avif"
          alt="Background Mobile"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" />
      </div>

      <div className="relative grid min-h-svh grid-cols-1 md:grid-cols-2 lg:grid-cols-[30%_1fr] z-10">
        <div className="flex flex-col items-center justify-center p-4 sm:p-8 md:bg-white">
          <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-2xl md:shadow-none md:rounded-none md:p-0">
            <LoginForm />
          </div>
        </div>

        <div className="hidden md:flex flex-col justify-center items-center p-12 lg:p-24 text-white relative overflow-hidden">
          <img
            src="/imagen-login.avif"
            alt="Gestión de Tickets"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0F172A]/80" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-transparent to-[#0F172A]/40" />

          <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight ">
                Gestiona tus <br />
                <span className="text-[#22D3EE]">Tickets</span>
              </h2>

              <p className="text-lg lg:text-xl text-slate-300 font-medium leading-relaxed max-w-md mx-auto">
                Prioriza, organiza y resuelve todos tus requerimientos en un
                solo lugar de forma rápida, sencilla y eficiente.
              </p>
            </div>

            <div className="w-20 h-1 bg-[#22D3EE] mt-8 rounded-full opacity-50 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
