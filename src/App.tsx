import { useEffect, useState } from "react";
import  Auth from "./components/auth";
import Tasks from "./components/tasks";
import { supabase } from "./supabase-client";
import { Session } from "@supabase/supabase-js"; 

export default function App() {

  const [session, setSession] = useState<Session | null>(null)

  const fetchSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    setSession(data.session)
    console.log(data)
    if (error){
      console.error("Error fetching session", error.message)
    }
  }

  useEffect( () => {

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {

      console.log(event, session)
      setSession(session)

    })
    
    return () => {
      authListener.subscription.unsubscribe();
    };

  },[]);

  //Logout function
  const logout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div>
      {session ? (
        <>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mb-2 sm:mb-0"
            >
            Logout</button>
          <Tasks session = {session} />
        </>
      ) : 
        (<Auth/>)}
    </div>
  )
}
