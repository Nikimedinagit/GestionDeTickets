import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { authService } from "@/services/auth-service";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export function LoginForm({ className, ...props }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError("");
  };

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await authService.login(
        formData.email,
        formData.password,
      );
      const decoded = jwtDecode(response.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          nombreCompleto: decoded.nombreCompleto,
          email: decoded.email || response.unique_name, 
          rol: decoded.role, 
        }),
      );

      localStorage.setItem("token", response.token);

      navigate("/dashboard");
    } catch (err) {
      let errorMsg = err.response?.data?.message || "Error al iniciar sesión";
      if (errorMsg.includes("incorrect")) {
        errorMsg = "Correo o contraseña incorrectos.";
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-8", className)} {...props}>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex flex-col items-center gap-2">
          <img
            src="/logo-completo-tickets.png"
            alt="Logo SlateTicket"
            className="w-90"
          />
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-slate-900">
            Hola, bienvenido de nuevo
          </h2>
          <p className="text-slate-500 text-sm">
            Ingresa con tus credenciales para continuar.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid gap-5">
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-md animate-in fade-in zoom-in">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="grid gap-2 text-left">
          <Label htmlFor="email" className="font-semibold text-slate-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="usuario@empresa.com"
            className="h-10 border-slate-200 focus:border-[#0F172A] focus:ring-[#0F172A]"
            required
            disabled={isLoading}
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2 text-left">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="font-semibold text-slate-700">
              Contraseña
            </Label>
          </div>
          <Input
            id="password"
            type="password"
            className="h-10 border-slate-200 focus:border-[#0F172A] focus:ring-[#0F172A]"
            required
            disabled={isLoading}
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-10 text-base font-bold bg-[#1E293B] hover:bg-[#0F172A] text-white shadow-lg transition-all active:scale-[0.98] mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Verificando...
            </>
          ) : (
            "Iniciar Sesión"
          )}
        </Button>
      </form>
    </div>
  );
}
