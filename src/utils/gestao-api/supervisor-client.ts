"use server"

import { Supervisor } from "@/types/supervisor"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"


export async function getSupervisores(): Promise<Supervisor[]> {
    const supabase = await createClient()

    const {data: {session}} = await supabase.auth.getSession()
    const token = session?.access_token

    if (!token) {
        redirect('/login')
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/supervisores`
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    const supervisores = await response.json()
    return supervisores
}

export async function getSupervisor(id: number): Promise<Supervisor> {
    const supabase = await createClient()

    const {data: {session}} = await supabase.auth.getSession()
    const token = session?.access_token

    if (!token) {
        redirect('/login')
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/supervisores/${id}`
    const response = await fetch(url, { 
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response.json()
}   
