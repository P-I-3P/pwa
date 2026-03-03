import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GraduationCap, LogOut, ArrowLeft, UserPlus,
  Eye, EyeOff, CheckCircle2, AlertCircle,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function CadastrarAluno() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!nome.trim() || !email.trim() || !password.trim()) {
      setError("Preencha todos os campos.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/alunos/criar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome.trim(), email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Erro ao cadastrar aluno.");
      } else {
        setSuccess(true);
        setNome("");
        setEmail("");
        setPassword("");
      }
    } catch {
      setError("Não foi possível conectar ao servidor. Verifique a API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b px-4 sm:px-6"
        style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center btn-gradient">
              <GraduationCap className="w-5 h-5" style={{ color: "hsl(var(--primary-foreground))" }} />
            </div>
            <span className="font-bold text-xl text-gradient">P.I</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-sm"
              style={{ color: "hsl(var(--muted-foreground))" }}>
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}
              className="flex items-center gap-2 text-sm"
              style={{ color: "hsl(var(--muted-foreground))" }}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        {/* Title */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 btn-gradient glow-primary">
            <UserPlus className="w-7 h-7" style={{ color: "hsl(var(--primary-foreground))" }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "hsl(var(--foreground))" }}>
            Cadastrar Aluno
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            Cria a conta do aluno no sistema via API
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl p-8 card-elevated border" style={{ borderColor: "hsl(var(--border))" }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="nome" style={{ color: "hsl(var(--foreground))" }}>Nome completo</Label>
              <Input
                id="nome"
                type="text"
                placeholder="Ex: João da Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="h-11"
                style={{
                  background: "hsl(var(--input))",
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                }}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: "hsl(var(--foreground))" }}>E-mail institucional</Label>
              <Input
                id="email"
                type="email"
                placeholder="aluno@pi.edu"
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

            {/* Senha */}
            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: "hsl(var(--foreground))" }}>Senha inicial</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
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

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-sm p-3 rounded-lg"
                style={{ background: "hsl(0 72% 51% / 0.1)", color: "hsl(0 72% 65%)", border: "1px solid hsl(0 72% 51% / 0.3)" }}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-center gap-2 text-sm p-3 rounded-lg"
                style={{ background: "hsl(150 60% 50% / 0.1)", color: "hsl(150 60% 55%)", border: "1px solid hsl(150 60% 50% / 0.3)" }}>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Aluno cadastrado com sucesso!
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 font-semibold btn-gradient glow-primary transition-all hover:opacity-90"
              style={{ color: "hsl(var(--primary-foreground))", border: "none" }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Cadastrando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Cadastrar Aluno
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Info */}
        <p className="text-center text-xs mt-6" style={{ color: "hsl(var(--muted-foreground))" }}>
          O aluno receberá acesso com o e-mail e senha definidos acima.
        </p>
      </main>
    </div>
  );
}
