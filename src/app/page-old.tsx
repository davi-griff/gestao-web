"use client"

import { useState, useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react"
import { User, createClient } from "@supabase/supabase-js"
import { ThemeSupa } from "@supabase/auth-ui-shared";


const supabaseProjectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)


export default function Home() {

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for existing session on component mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session?.user || null)
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    })

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [])



  return user ? <LoggedIn /> : <LoggedOut />
}

function LoggedOut() {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{
        theme: ThemeSupa
      }}
      providers={[]}
      theme="dark"
      redirectTo="/"
      showLinks
      />
  )
}

function LoggedIn() {
  const [ourSecretData, setOurSecretData] = useState();

  useEffect(() => {
    fetch("http://localhost:8080/secret", {
      method: "POST",
      headers: {
        Authorization: getToken(),
      },
    })
    .then((res) => res.json())
    .then((data) => setOurSecretData(data))
  }, [])

  const handleSignOut = () => {
    supabase.auth.signOut().then(() => {
      window.location.reload()
    })
  }

  return (
    <>
      <div>{JSON.stringify(ourSecretData)}</div>
      <button onClick={handleSignOut}>Sign Out</button>
    </>
  )


}

const getToken = () => {
  const storageKey = `sb-${supabaseProjectId}-auth-token`
  const sessionDataString = localStorage.getItem(storageKey)
  const sessionData = JSON.parse(sessionDataString || "null")
  const token = sessionData?.access_token;

  return token
}
