import { firebaseAuth } from "@/lib/firebase";

const API_BASE = import.meta.env.VITE_API_URL ?? "https://www.meuservdidor.com";

async function getToken() {
  return firebaseAuth.currentUser?.getIdToken(true);
}

export interface CursoPayload {
  nome: string;
  codigo?: string | null;
  periodo?: string | null;
  cargaHoraria?: number | null;
  ativo?: boolean;
  tipo: "tecnologo" | "bacharel";
}

export async function criarCurso(payload: CursoPayload) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/cursos/criar`, {
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

export async function atualizarCurso(id: string, payload: Partial<CursoPayload>) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/cursos/editar${id}`, {
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

export async function deletarCurso(id: string) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/cursos/delete${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Erro ${res.status}`);
  }
  return res.json();
}
