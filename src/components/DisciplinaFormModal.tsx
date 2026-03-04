import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { criarDisciplina, atualizarDisciplina, DisciplinaPayload, Disciplina } from "@/hooks/useDisciplinas";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cursoId: string;
  cursoSemestres: number;
  editingDisciplina?: Disciplina | null;
}

export default function DisciplinaFormModal({ open, onClose, onSuccess, cursoId, cursoSemestres, editingDisciplina }: Props) {
  const isEdit = !!editingDisciplina;
  const [nome, setNome] = useState(editingDisciplina?.nome ?? "");
  const [codigo, setCodigo] = useState(editingDisciplina?.codigo ?? "");
  const [semestre, setSemestre] = useState(editingDisciplina?.semestre?.toString() ?? "1");
  const [cargaHoraria, setCargaHoraria] = useState(editingDisciplina?.cargaHoraria?.toString() ?? "");
  const [obrigatoria, setObrigatoria] = useState(editingDisciplina?.obrigatoria ?? true);
  const [ativo, setAtivo] = useState(editingDisciplina?.ativo ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) { setError("Nome é obrigatório"); return; }
    const semestreNum = Number(semestre);
    if (!semestreNum || semestreNum < 1) { setError("Semestre inválido"); return; }
    setLoading(true);
    setError(null);
    try {
      const payload: DisciplinaPayload = {
        nome: nome.trim(),
        codigo: codigo.trim() || null,
        semestre: semestreNum,
        cargaHoraria: cargaHoraria ? Number(cargaHoraria) : null,
        obrigatoria,
        ativo,
      };
      if (isEdit && editingDisciplina) {
        await atualizarDisciplina(cursoId, editingDisciplina.id, payload);
      } else {
        await criarDisciplina(cursoId, payload);
      }
      onSuccess();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao salvar disciplina");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
        <DialogHeader>
          <DialogTitle style={{ color: "hsl(var(--foreground))" }}>
            {isEdit ? "Editar Disciplina" : "Nova Disciplina"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label style={{ color: "hsl(var(--foreground))" }}>Nome *</Label>
            <Input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Engenharia de Software" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label style={{ color: "hsl(var(--foreground))" }}>Código</Label>
              <Input value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Ex: ES001" />
            </div>
            <div className="space-y-1.5">
              <Label style={{ color: "hsl(var(--foreground))" }}>Semestre * (1–{cursoSemestres})</Label>
              <Input type="number" min={1} max={cursoSemestres} value={semestre} onChange={e => setSemestre(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label style={{ color: "hsl(var(--foreground))" }}>Carga Horária (h)</Label>
            <Input type="number" value={cargaHoraria} onChange={e => setCargaHoraria(e.target.value)} placeholder="Ex: 80" />
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={obrigatoria} onCheckedChange={setObrigatoria} />
              <Label style={{ color: "hsl(var(--muted-foreground))" }}>Obrigatória</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={ativo} onCheckedChange={setAtivo} />
              <Label style={{ color: "hsl(var(--muted-foreground))" }}>Ativa</Label>
            </div>
          </div>
          {error && (
            <p className="text-sm px-3 py-2 rounded-lg" style={{ background: "hsl(var(--destructive) / 0.15)", color: "hsl(var(--destructive))" }}>
              {error}
            </p>
          )}
          <div className="flex gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancelar</Button>
            <Button type="submit" disabled={loading} className="flex-1 btn-gradient">
              {loading ? "Salvando…" : isEdit ? "Salvar alterações" : "Criar disciplina"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
