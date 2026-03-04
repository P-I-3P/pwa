import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { criarCurso, atualizarCurso, CursoPayload } from "@/hooks/useCursosMutations";
import type { Curso } from "@/hooks/useCursos";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingCurso?: Curso | null;
}

export default function CursoFormModal({ open, onClose, onSuccess, editingCurso }: Props) {
  const isEdit = !!editingCurso;
  const [nome, setNome] = useState(editingCurso?.nome ?? "");
  const [codigo, setCodigo] = useState(editingCurso?.codigo ?? "");
  const [periodo, setPeriodo] = useState(editingCurso?.periodo ?? "");
  const [cargaHoraria, setCargaHoraria] = useState(editingCurso?.cargaHoraria?.toString() ?? "");
  const [tipo, setTipo] = useState<"tecnologo" | "bacharel">((editingCurso as any)?.tipo ?? "tecnologo");
  const [ativo, setAtivo] = useState(editingCurso?.ativo ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) { setError("Nome é obrigatório"); return; }
    setLoading(true);
    setError(null);
    try {
      const payload: CursoPayload = {
        nome: nome.trim(),
        codigo: codigo.trim() || null,
        periodo: periodo.trim() || null,
        cargaHoraria: cargaHoraria ? Number(cargaHoraria) : null,
        tipo,
        ativo,
      };
      if (isEdit && editingCurso) {
        await atualizarCurso(editingCurso.id, payload);
      } else {
        await criarCurso(payload);
      }
      onSuccess();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao salvar curso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
        <DialogHeader>
          <DialogTitle style={{ color: "hsl(var(--foreground))" }}>
            {isEdit ? "Editar Curso" : "Novo Curso"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label style={{ color: "hsl(var(--foreground))" }}>Nome *</Label>
            <Input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Tecnologia em Análise e Desenvolvimento de Sistemas" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label style={{ color: "hsl(var(--foreground))" }}>Código</Label>
              <Input value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Ex: TADS" />
            </div>
            <div className="space-y-1.5">
              <Label style={{ color: "hsl(var(--foreground))" }}>Período</Label>
              <Input value={periodo} onChange={e => setPeriodo(e.target.value)} placeholder="Ex: Noturno" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label style={{ color: "hsl(var(--foreground))" }}>Carga Horária (h)</Label>
              <Input type="number" value={cargaHoraria} onChange={e => setCargaHoraria(e.target.value)} placeholder="Ex: 2400" />
            </div>
            <div className="space-y-1.5">
              <Label style={{ color: "hsl(var(--foreground))" }}>Tipo *</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as "tecnologo" | "bacharel")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tecnologo">Tecnólogo (5 sem.)</SelectItem>
                  <SelectItem value="bacharel">Bacharel (10 sem.)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={ativo} onCheckedChange={setAtivo} />
            <Label style={{ color: "hsl(var(--muted-foreground))" }}>Curso ativo</Label>
          </div>
          {error && (
            <p className="text-sm px-3 py-2 rounded-lg" style={{ background: "hsl(var(--destructive) / 0.15)", color: "hsl(var(--destructive))" }}>
              {error}
            </p>
          )}
          <div className="flex gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancelar</Button>
            <Button type="submit" disabled={loading} className="flex-1 btn-gradient">
              {loading ? "Salvando…" : isEdit ? "Salvar alterações" : "Criar curso"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
