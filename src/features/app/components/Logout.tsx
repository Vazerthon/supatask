import { Button } from "@chakra-ui/react";
import { supabase } from "../../../supabaseClient";
import { useSession } from "../../../state/useSessionStore";

export default function Logout() {
  const session = useSession();

  if (session) {
    return <Button onClick={() => supabase.auth.signOut()}>Sign out</Button>;
  } else {
    return null;
  }
}
