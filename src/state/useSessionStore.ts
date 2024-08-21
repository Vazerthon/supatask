import { create } from "zustand";
import { Session } from "@supabase/supabase-js";

interface SessionState {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

const useSessionStore = create<SessionState>((set) => ({
  session: null,
  setSession: (session: Session | null) => set({ session }),
}));

export const useSession = () => useSessionStore((state) => state.session);
export const useSetSession = () => useSessionStore((state) => state.setSession);
