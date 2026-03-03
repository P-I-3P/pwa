import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LogOut, BookOpen, Users, BarChart2, Bell, Settings,
  CheckCircle2, Clock, TrendingUp, GraduationCap,
} from "lucide-react";

const stats = [
  { label: "Disciplinas", value: "6", icon: BookOpen, color: "hsl(213 94% 58%)" },
  { label: "Colegas", value: "32", icon: Users, color: "hsl(150 60% 50%)" },
  { label: "Tarefas Pendentes", value: "4", icon: Clock, color: "hsl(40 90% 55%)" },
  { label: "Progresso Geral", value: "78%", icon: TrendingUp, color: "hsl(280 70% 60%)" },
];

const recent = [
  { title: "Entrega: Relatório Final", subject: "Engenharia de Software", due: "Amanhã", status: "urgent" },
  { title: "Prova Teórica", subject: "Banco de Dados", due: "Em 3 dias", status: "warning" },
  { title: "Apresentação do Projeto", subject: "P.I — Projeto Integrador", due: "Em 7 dias", status: "ok" },
  { title: "Atividade Prática", subject: "Redes de Computadores", due: "Concluída", status: "done" },
];

const statusColors: Record<string, string> = {
  urgent: "hsl(0 72% 65%)",
  warning: "hsl(40 90% 60%)",
  ok: "hsl(213 94% 58%)",
  done: "hsl(150 60% 50%)",
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      {/* Top nav */}
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
            <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: "hsl(var(--secondary))", color: "hsl(var(--muted-foreground))" }}>
              <Bell className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: "hsl(var(--secondary))", color: "hsl(var(--muted-foreground))" }}>
              <Settings className="w-4 h-4" />
            </button>
            <Button variant="ghost" size="sm" onClick={handleLogout}
              className="flex items-center gap-2 text-sm"
              style={{ color: "hsl(var(--muted-foreground))" }}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Welcome */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl btn-gradient flex items-center justify-center text-lg font-bold"
            style={{ color: "hsl(var(--primary-foreground))" }}>
            {user?.avatar}
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "hsl(var(--foreground))" }}>
              Olá, {user?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
              {user?.role} · Bem-vindo ao Projeto Integrador
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl p-5 card-elevated border"
              style={{ borderColor: "hsl(var(--border))" }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}22` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
              </div>
              <p className="text-2xl font-bold" style={{ color: "hsl(var(--foreground))" }}>{value}</p>
              <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Recent tasks */}
        <div className="rounded-2xl card-elevated border p-6" style={{ borderColor: "hsl(var(--border))" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-lg" style={{ color: "hsl(var(--foreground))" }}>
              Atividades Recentes
            </h2>
            <span className="text-xs px-3 py-1 rounded-full"
              style={{ background: "hsl(var(--secondary))", color: "hsl(var(--muted-foreground))" }}>
              {recent.length} itens
            </span>
          </div>
          <div className="space-y-3">
            {recent.map(({ title, subject, due, status }) => (
              <div key={title} className="flex items-center justify-between p-4 rounded-xl transition-colors"
                style={{ background: "hsl(var(--secondary))" }}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: statusColors[status] }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{title}</p>
                    <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {status === "done" && <CheckCircle2 className="w-4 h-4" style={{ color: statusColors.done }} />}
                  <span className="text-xs font-medium" style={{ color: statusColors[status] }}>{due}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disciplines */}
        <div className="rounded-2xl card-elevated border p-6" style={{ borderColor: "hsl(var(--border))" }}>
          <h2 className="font-semibold text-lg mb-5" style={{ color: "hsl(var(--foreground))" }}>
            Minhas Disciplinas
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { name: "Engenharia de Software", code: "ES301", progress: 82 },
              { name: "Banco de Dados", code: "BD201", progress: 70 },
              { name: "Redes de Computadores", code: "RC302", progress: 65 },
              { name: "P.I — Projeto Integrador", code: "PI401", progress: 90 },
              { name: "Inteligência Artificial", code: "IA303", progress: 55 },
              { name: "Compiladores", code: "CO304", progress: 45 },
            ].map(({ name, code, progress }) => (
              <div key={code} className="p-4 rounded-xl border transition-all hover:scale-[1.02]"
                style={{ background: "hsl(var(--muted))", borderColor: "hsl(var(--border))" }}>
                <p className="text-xs font-mono mb-1" style={{ color: "hsl(var(--primary))" }}>{code}</p>
                <p className="text-sm font-medium leading-tight mb-3" style={{ color: "hsl(var(--foreground))" }}>{name}</p>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--border))" }}>
                  <div className="h-full rounded-full btn-gradient transition-all"
                    style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{progress}%</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
