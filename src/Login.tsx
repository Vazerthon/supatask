import { useEffect } from "react";
import { ThemeMinimal } from "@supabase/auth-ui-shared";
import { Auth } from "@supabase/auth-ui-react";

import { supabase } from "./supabaseClient";
import useSessionStore from "./hooks/useSessionStore";

export default function Login() {
  const { session, setSession } = useSessionStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  if (!session) {
    return (
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeMinimal }}
        providers={[]}
        showLinks={false}
      />
    );
  } else {
    return null;
  }
}
