import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, GraduationCap, AlertCircle } from "lucide-react";

export default function Login() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result === true) {
      navigate("/dashboard");
    } else if (result === "unauthorized") {
      setError("Acesso restrito à Coordenação. Alunos e professores não possuem acesso a este portal.");
    } else {
      setError("E-mail ou senha incorretos. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(213 94% 58%), transparent)" }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(220 80% 65%), transparent)" }} />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, hsl(213 94% 58%), transparent)" }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 glow-primary"
            style={{ background: "var(--gradient-btn)" }}>
            <GraduationCap className="w-10 h-10" style={{ color: "hsl(var(--primary-foreground))" }} />
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-gradient">P.I</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            Projeto Integrador
          </p>
          <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            Faculdade de Tecnologia
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 card-elevated border" style={{ borderColor: "hsl(var(--border))" }}>
          <h2 className="text-xl font-semibold mb-6" style={{ color: "hsl(var(--foreground))" }}>
            Entrar na plataforma
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: "hsl(var(--foreground))" }}>E-mail institucional</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@pi.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
                style={{
                  background: "hsl(var(--input))",
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: "hsl(var(--foreground))" }}>Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-11"
                  style={{
                    background: "hsl(var(--input))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm p-3 rounded-lg"
                style={{ background: "hsl(0 72% 51% / 0.1)", color: "hsl(0 72% 65%)", border: "1px solid hsl(0 72% 51% / 0.3)" }}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 font-semibold btn-gradient glow-primary transition-all hover:opacity-90"
              style={{ color: "hsl(var(--primary-foreground))", border: "none" }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : "Entrar"}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "hsl(var(--muted-foreground))" }}>
          © 2025 P.I — Projeto Integrador · Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
