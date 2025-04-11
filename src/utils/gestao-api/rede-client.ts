"use server"

import { Rede } from "@/types/rede"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function getRedes(): Promise<Rede[]> {
    const supabase = await createClient()

    const {data: {session}} = await supabase.auth.getSession()
    const token = session?.access_token
    console.log(token)

    if (!token) {
        redirect('/login')
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/redes`
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    const redes = await response.json()
    return redes
}
