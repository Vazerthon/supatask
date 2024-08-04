import { Button } from "@chakra-ui/react";
import { supabase } from "../../../supabaseClient";
import useSessionStore from "../../../state/useSessionStore";

export default function Logout() {
  const { session } = useSessionStore();

  if (session) {
    return <Button onClick={() => supabase.auth.signOut()}>Sign out</Button>;
  } else {
    return null;
  }
}
