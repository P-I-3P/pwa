import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LogOut, BookOpen, Users, Bell, Settings,
  GraduationCap, UserPlus, Clock, TrendingUp,
  RefreshCw, AlertCircle, CheckCircle2, BookMarked,
  Plus, Pencil, Trash2, ChevronDown, ChevronRight, BookCopy,
} from "lucide-react";
import { useCursos, Curso } from "@/hooks/useCursos";
import { deletarCurso } from "@/hooks/useCursosMutations";
import { useDisciplinas, deletarDisciplina, Disciplina } from "@/hooks/useDisciplinas";
import CursoFormModal from "@/components/CursoFormModal";
import DisciplinaFormModal from "@/components/DisciplinaFormModal";

/* ─── Mock data ─────────────────────────────────────── */
const alunosMock = [
  { id: "1", nome: "Ana Paula Souza",     email: "ana.souza@pi.edu",    curso: "TADS", periodo: "3º", status: "ativo" },
  { id: "2", nome: "Bruno Lima",          email: "bruno.lima@pi.edu",   curso: "TADS", periodo: "1º", status: "ativo" },
  { id: "3", nome: "Carla Mendes",        email: "carla.mendes@pi.edu", curso: "GTI",  periodo: "2º", status: "ativo" },
  { id: "4", nome: "Diego Ferreira",      email: "diego.f@pi.edu",      curso: "GTI",  periodo: "4º", status: "inativo" },
  { id: "5", nome: "Eduarda Costa",      email: "eduarda.c@pi.edu",    curso: "TADS", periodo: "5º", status: "ativo" },
  { id: "6", nome: "Felipe Rodrigues",    email: "felipe.r@pi.edu",     curso: "TADS", periodo: "2º", status: "ativo" },
];

const cargaHorariaMock = [
  { id: "1", aluno: "Ana Paula Souza",   disciplina: "Engenharia de Software", horasPrevistas: 80, horasCumpridas: 72, percentual: 90 },
  { id: "2", aluno: "Ana Paula Souza",   disciplina: "Banco de Dados",         horasPrevistas: 60, horasCumpridas: 42, percentual: 70 },
  { id: "3", aluno: "Bruno Lima",        disciplina: "Redes de Computadores",  horasPrevistas: 60, horasCumpridas: 30, percentual: 50 },
  { id: "4", aluno: "Bruno Lima",        disciplina: "P.I — Projeto Integrador",horasPrevistas: 40, horasCumpridas: 38, percentual: 95 },
  { id: "5", aluno: "Carla Mendes",      disciplina: "Inteligência Artificial", horasPrevistas: 80, horasCumpridas: 55, percentual: 69 },
  { id: "6", aluno: "Diego Ferreira",    disciplina: "Compiladores",           horasPrevistas: 60, horasCumpridas: 20, percentual: 33 },
];

type Tab = "cursos" | "alunos" | "carga";

/* ─── Disciplinas sub-panel ─────────────────────────── */
function DisciplinasPanel({ curso }: { curso: Curso & { semestres?: number } }) {
  const { disciplinas, loading, error, refetch } = useDisciplinas(curso.id);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Disciplina | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Deletar disciplina?")) return;
    setDeleting(id);
    try { await deletarDisciplina(curso.id, id); refetch(); } catch (e: unknown) { alert(e instanceof Error ? e.message : "Erro"); }
    setDeleting(null);
  };

  const semestresCount = (curso as any).semestres ?? (((curso as any).tipo === "bacharel") ? 10 : 5);
  const grouped = Array.from({ length: semestresCount }, (_, i) => i + 1).map(s => ({
    sem: s,
    items: disciplinas.filter(d => d.semestre === s),
  }));

  return (
    <div className="mt-3 rounded-xl border overflow-hidden" style={{ borderColor: "hsl(var(--border))" }}>
      <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "hsl(var(--secondary))" }}>
        <span className="text-xs font-semibold" style={{ color: "hsl(var(--primary))" }}>
          Disciplinas · {disciplinas.length}
        </span>
        <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" style={{ color: "hsl(var(--primary))" }}
          onClick={() => { setEditing(null); setShowModal(true); }}>
          <Plus className="w-3 h-3" /> Nova
        </Button>
      </div>
      {loading && <p className="text-xs px-4 py-3" style={{ color: "hsl(var(--muted-foreground))" }}>Carregando…</p>}
      {error && <p className="text-xs px-4 py-3" style={{ color: "hsl(var(--destructive))" }}>{error}</p>}
      {!loading && !error && (
        <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
          {grouped.map(({ sem, items }) => items.length > 0 && (
            <div key={sem} className="px-4 py-2">
              <p className="text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>{sem}º Semestre</p>
              <div className="space-y-1">
                {items.map(d => (
                  <div key={d.id} className="flex items-center justify-between gap-2 py-1 px-2 rounded-lg"
                    style={{ background: "hsl(var(--muted))" }}>
                    <div>
                      {d.codigo && <span className="text-xs font-mono mr-1.5" style={{ color: "hsl(var(--primary))" }}>{d.codigo}</span>}
                      <span className="text-xs font-medium" style={{ color: "hsl(var(--foreground))" }}>{d.nome}</span>
                      {d.cargaHoraria && <span className="ml-1.5 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>· {d.cargaHoraria}h</span>}
                      {!d.obrigatoria && <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full" style={{ background: "hsl(40 90% 55% / 0.15)", color: "hsl(40 90% 60%)" }}>optativa</span>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => { setEditing(d); setShowModal(true); }} className="w-6 h-6 flex items-center justify-center rounded"
                        style={{ color: "hsl(var(--muted-foreground))" }}>
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDelete(d.id)} disabled={deleting === d.id} className="w-6 h-6 flex items-center justify-center rounded"
                        style={{ color: "hsl(var(--destructive))" }}>
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {disciplinas.length === 0 && (
            <p className="text-xs px-4 py-3" style={{ color: "hsl(var(--muted-foreground))" }}>Nenhuma disciplina cadastrada.</p>
          )}
        </div>
      )}
      {showModal && (
        <DisciplinaFormModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={refetch}
          cursoId={curso.id}
          cursoSemestres={semestresCount}
          editingDisciplina={editing}
        />
      )}
    </div>
  );
}

/* ─── Component ─────────────────────────────────────── */
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("cursos");
  const { cursos, loading: cursosLoading, error: cursosError, refetch } = useCursos();
  const [cursoModal, setCursoModal] = useState(false);
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);
  const [expandedCurso, setExpandedCurso] = useState<string | null>(null);
  const [deletingCurso, setDeletingCurso] = useState<string | null>(null);

  const handleDeleteCurso = async (id: string) => {
    if (!confirm("Deletar curso e todas as disciplinas?")) return;
    setDeletingCurso(id);
    try { await deletarCurso(id); refetch(); } catch (e: unknown) { alert(e instanceof Error ? e.message : "Erro"); }
    setDeletingCurso(null);
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "cursos",  label: "Cursos",        icon: BookOpen },
    { key: "alunos",  label: "Alunos",        icon: Users },
    { key: "carga",   label: "Carga Horária", icon: Clock },
  ];

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      {/* ── Header ── */}
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
            <Button variant="ghost" size="sm" onClick={() => navigate("/cadastrar-aluno")}
              className="flex items-center gap-2 text-sm font-semibold"
              style={{ color: "hsl(var(--primary))" }}>
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Cadastrar Aluno</span>
            </Button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "hsl(var(--secondary))", color: "hsl(var(--muted-foreground))" }}>
              <Bell className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center"
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* ── Welcome ── */}
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
              {user?.role} · Painel de Coordenação
            </p>
          </div>
        </div>

        {/* ── Quick stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Cursos",  value: cursosLoading ? "…" : String(cursos.length),    icon: BookOpen,   color: "hsl(213 94% 58%)" },
            { label: "Alunos",  value: String(alunosMock.length),                      icon: Users,      color: "hsl(150 60% 50%)" },
            { label: "Ativos",  value: String(alunosMock.filter(a => a.status === "ativo").length), icon: CheckCircle2, color: "hsl(150 60% 50%)" },
            { label: "Média CH",value: "72%",                                           icon: TrendingUp, color: "hsl(280 70% 60%)" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl p-5 card-elevated border" style={{ borderColor: "hsl(var(--border))" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}22` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <p className="text-2xl font-bold" style={{ color: "hsl(var(--foreground))" }}>{value}</p>
              <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="rounded-2xl card-elevated border overflow-hidden" style={{ borderColor: "hsl(var(--border))" }}>
          {/* Tab bar */}
          <div className="flex border-b" style={{ borderColor: "hsl(var(--border))" }}>
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="flex items-center gap-2 px-5 py-4 text-sm font-medium transition-colors relative"
                style={{
                  color: tab === key ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  background: tab === key ? "hsl(var(--primary) / 0.07)" : "transparent",
                  borderBottom: tab === key ? "2px solid hsl(var(--primary))" : "2px solid transparent",
                }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* ── Tab: Cursos ── */}
          {tab === "cursos" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-lg" style={{ color: "hsl(var(--foreground))" }}>
                  Cursos cadastrados
                </h2>
                <div className="flex gap-2">
                  <button onClick={refetch} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
                    style={{ background: "hsl(var(--secondary))", color: "hsl(var(--muted-foreground))" }}>
                    <RefreshCw className="w-3.5 h-3.5" />
                    Atualizar
                  </button>
                  <button onClick={() => { setEditingCurso(null); setCursoModal(true); }}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold btn-gradient"
                    style={{ color: "hsl(var(--primary-foreground))" }}>
                    <Plus className="w-3.5 h-3.5" />
                    Novo Curso
                  </button>
                </div>
              </div>

              {cursosLoading && (
                <div className="flex items-center justify-center py-12 gap-3" style={{ color: "hsl(var(--muted-foreground))" }}>
                  <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Carregando cursos da API…
                </div>
              )}

              {cursosError && (
                <div className="flex items-center gap-2 text-sm p-4 rounded-xl"
                  style={{ background: "hsl(0 72% 51% / 0.1)", color: "hsl(0 72% 65%)", border: "1px solid hsl(0 72% 51% / 0.3)" }}>
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Erro ao carregar cursos: {cursosError}
                </div>
              )}

              {!cursosLoading && !cursosError && cursos.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 gap-3"
                  style={{ color: "hsl(var(--muted-foreground))" }}>
                  <BookMarked className="w-10 h-10 opacity-40" />
                  <p className="text-sm">Nenhum curso cadastrado ainda.</p>
                </div>
              )}

              {!cursosLoading && !cursosError && cursos.length > 0 && (
                <div className="space-y-3">
                  {cursos.map((curso) => (
                    <div key={curso.id} className="rounded-xl border overflow-hidden"
                      style={{ borderColor: "hsl(var(--border))" }}>
                      {/* Curso header row */}
                      <div className="flex items-center justify-between gap-2 p-4"
                        style={{ background: "hsl(var(--muted))" }}>
                        <div className="flex items-center gap-3 min-w-0">
                          <button onClick={() => setExpandedCurso(expandedCurso === curso.id ? null : curso.id)}
                            className="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg transition-colors"
                            style={{ color: "hsl(var(--primary))" }}>
                            {expandedCurso === curso.id
                              ? <ChevronDown className="w-4 h-4" />
                              : <ChevronRight className="w-4 h-4" />}
                          </button>
                          <div className="min-w-0">
                            {curso.codigo && (
                              <p className="text-xs font-mono" style={{ color: "hsl(var(--primary))" }}>{curso.codigo}</p>
                            )}
                            <p className="text-sm font-semibold leading-tight" style={{ color: "hsl(var(--foreground))" }}>
                              {curso.nome}
                            </p>
                            <div className="flex gap-3 mt-0.5 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                              {curso.periodo && <span>📅 {curso.periodo}</span>}
                              {curso.cargaHoraria && <span>⏱ {curso.cargaHoraria}h</span>}
                              {(curso as any).tipo && <span>🎓 {(curso as any).tipo}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              background: curso.ativo ? "hsl(150 60% 50% / 0.15)" : "hsl(0 72% 51% / 0.15)",
                              color: curso.ativo ? "hsl(150 60% 55%)" : "hsl(0 72% 65%)",
                            }}>
                            {curso.ativo ? "Ativo" : "Inativo"}
                          </span>
                          <button onClick={() => { setEditingCurso(curso); setCursoModal(true); }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg"
                            style={{ color: "hsl(var(--muted-foreground))" }}>
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteCurso(curso.id)} disabled={deletingCurso === curso.id}
                            className="w-7 h-7 flex items-center justify-center rounded-lg"
                            style={{ color: "hsl(var(--destructive))" }}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setExpandedCurso(expandedCurso === curso.id ? null : curso.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-xs gap-1 hidden sm:flex"
                            style={{ color: "hsl(var(--primary))", background: "hsl(var(--primary) / 0.1)" }}>
                            <BookCopy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      {/* Disciplinas panel */}
                      {expandedCurso === curso.id && (
                        <div className="px-4 pb-4">
                          <DisciplinasPanel curso={curso as any} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {cursoModal && (
                <CursoFormModal
                  open={cursoModal}
                  onClose={() => setCursoModal(false)}
                  onSuccess={refetch}
                  editingCurso={editingCurso}
                />
              )}
            </div>
          )}

          {/* ── Tab: Alunos (mock) ── */}
          {tab === "alunos" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-lg" style={{ color: "hsl(var(--foreground))" }}>
                  Alunos matriculados
                </h2>
                <span className="text-xs px-3 py-1 rounded-full"
                  style={{ background: "hsl(var(--secondary))", color: "hsl(var(--muted-foreground))" }}>
                  {alunosMock.length} alunos · dados de exemplo
                </span>
              </div>
              <div className="space-y-2">
                {alunosMock.map((aluno) => (
                  <div key={aluno.id} className="flex items-center justify-between p-4 rounded-xl transition-colors"
                    style={{ background: "hsl(var(--secondary))" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ color: "hsl(var(--primary-foreground))" }}>
                        {aluno.nome.split(" ").map(n => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{aluno.nome}</p>
                        <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{aluno.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <div className="hidden sm:block">
                        <p className="text-xs font-medium" style={{ color: "hsl(var(--foreground))" }}>{aluno.curso}</p>
                        <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{aluno.periodo} período</p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                          background: aluno.status === "ativo" ? "hsl(150 60% 50% / 0.15)" : "hsl(0 72% 51% / 0.15)",
                          color: aluno.status === "ativo" ? "hsl(150 60% 55%)" : "hsl(0 72% 65%)",
                        }}>
                        {aluno.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tab: Carga Horária (mock) ── */}
          {tab === "carga" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-lg" style={{ color: "hsl(var(--foreground))" }}>
                  Carga Horária por Aluno
                </h2>
                <span className="text-xs px-3 py-1 rounded-full"
                  style={{ background: "hsl(var(--secondary))", color: "hsl(var(--muted-foreground))" }}>
                  dados de exemplo
                </span>
              </div>
              <div className="space-y-3">
                {cargaHorariaMock.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border"
                    style={{ background: "hsl(var(--muted))", borderColor: "hsl(var(--border))" }}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>{item.aluno}</p>
                        <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{item.disciplina}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold" style={{ color: "hsl(var(--foreground))" }}>{item.percentual}%</p>
                        <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                          {item.horasCumpridas}h / {item.horasPrevistas}h
                        </p>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--border))" }}>
                      <div className="h-full rounded-full transition-all"
                        style={{
                          width: `${item.percentual}%`,
                          background: item.percentual >= 75
                            ? "hsl(150 60% 50%)"
                            : item.percentual >= 50
                              ? "hsl(40 90% 55%)"
                              : "hsl(0 72% 65%)",
                        }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
