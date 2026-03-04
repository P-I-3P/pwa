import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<boolean | "unauthorized">;
  logout: () => void;
  getIdToken: () => Promise<string | null>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, async (fbUser) => {
      if (fbUser) {
        // verifica se é admin via custom claims
        const tokenResult = await fbUser.getIdTokenResult();
        const role = tokenResult.claims.role as string | undefined;
        if (role === "admin" || role === "coordenacao") {
          setFirebaseUser(fbUser);
          setUser({
            id: fbUser.uid,
            name: fbUser.displayName ?? fbUser.email ?? "Admin",
            email: fbUser.email ?? "",
            role: "Administrador",
            avatar: (fbUser.displayName ?? "A").slice(0, 2).toUpperCase(),
          });
        } else {
          await signOut(firebaseAuth);
          setFirebaseUser(null);
          setUser(null);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setIsLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string): Promise<boolean | "unauthorized"> => {
    setIsLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const tokenResult = await cred.user.getIdTokenResult(true);
      const role = tokenResult.claims.role as string | undefined;

      if (role !== "admin" && role !== "coordenacao") {
        await signOut(firebaseAuth);
        setIsLoading(false);
        return "unauthorized";
      }
      // onAuthStateChanged vai setar o user
      return true;
    } catch {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => signOut(firebaseAuth);

  const getIdToken = async (): Promise<string | null> => {
    if (!firebaseAuth.currentUser) return null;
    return firebaseAuth.currentUser.getIdToken(true);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, login, logout, getIdToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
