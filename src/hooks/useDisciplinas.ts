import { useEffect, useState } from "react";
import { firebaseAuth } from "@/lib/firebase";

const API_BASE = import.meta.env.VITE_API_URL ?? "https://www.meuservdidor.com";

async function getToken() {
  return firebaseAuth.currentUser?.getIdToken(true);
}

export interface Disciplina {
  id: string;
  nome: string;
  codigo: string | null;
  semestre: number;
  cargaHoraria: number | null;
  obrigatoria: boolean;
  ativo: boolean;
}

export interface DisciplinaPayload {
  nome: string;
  codigo?: string | null;
  semestre: number;
  cargaHoraria?: number | null;
  obrigatoria?: boolean;
  ativo?: boolean;
}

export function useDisciplinas(cursoId: string | null) {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDisciplinas = async () => {
    if (!cursoId) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/cursos/${cursoId}/disciplinas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data = await res.json();
      setDisciplinas(data.disciplinas ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao carregar disciplinas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDisciplinas(); }, [cursoId]);

  return { disciplinas, loading, error, refetch: fetchDisciplinas };
}

export async function criarDisciplina(cursoId: string, payload: DisciplinaPayload) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/cursos/${cursoId}/disciplinas`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Erro ${res.status}`);
  }
  return res.json();
}

export async function atualizarDisciplina(cursoId: string, id: string, payload: Partial<DisciplinaPayload>) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/cursos/${cursoId}/disciplinas/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Erro ${res.status}`);
  }
  return res.json();
}

export async function deletarDisciplina(cursoId: string, id: string) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/cursos/${cursoId}/disciplinas/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Erro ${res.status}`);
  }
  return res.json();
}
