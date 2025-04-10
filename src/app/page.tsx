"use client"

import { createClient, User } from "@supabase/supabase-js"
import { useEffect } from "react"
import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.push('/dashboard')
  }, [])
  return null
}