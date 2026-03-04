import { useEffect, useState } from "react";
import { firebaseAuth } from "@/lib/firebase";

const API_BASE = import.meta.env.VITE_API_URL ?? "https://www.meuservdidor.com";

export interface Curso {
  id: string;
  nome: string;
  codigo: string | null;
  periodo: string | null;
  cargaHoraria: number | null;
  ativo: boolean;
}

export function useCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCursos = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await firebaseAuth.currentUser?.getIdToken(true);
      const res = await fetch(`${API_BASE}/cursos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data = await res.json();
      setCursos(data.cursos ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao carregar cursos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCursos(); }, []);

  return { cursos, loading, error, refetch: fetchCursos };
}
