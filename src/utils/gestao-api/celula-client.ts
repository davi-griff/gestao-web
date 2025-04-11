"use server"

import { Celula } from "@/types/celula"
import { EncontroCelula } from "@/types/encontroCelula"
import { Grupo } from "@/types/grupo"
import { Membro } from "@/types/membro"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function getCelulas(): Promise<Celula[]> {
    const supabase = await createClient()

    const {data: {session}} = await supabase.auth.getSession()
    const token = session?.access_token

    if (!token) {
        redirect('/login')
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/celulas`
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    const celulas = await response.json()
    return celulas
    
}

export async function submitCelula(celula: Grupo, method: "POST" | "PUT") {
    const supabase = await createClient()

    const {data: {session}} = await supabase.auth.getSession()
    const token = session?.access_token

    if (!token) {
        redirect('/login')
    }

    console.log(JSON.stringify(celula))

    const url = `${process.env.NEXT_PUBLIC_API_URL}/celulas` + (method === "PUT" ? `/${celula.ID}` : "")
    const response = await fetch(url, {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(celula)
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao enviar a requisição")
    }

    return response.json()
}

export async function deleteCelula(id: number) {
    const supabase = await createClient()

    const {data: {session}} = await supabase.auth.getSession()
    const token = session?.access_token

    if (!token) {
        redirect('/login')
    }
    
    const url = `${process.env.NEXT_PUBLIC_API_URL}/celulas/${id}`
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("Erro ao deletar a célula")
    }

    return response.json()
}

export async function getCelula(id: number): Promise<Celula> {
    const supabase = await createClient()

    const {data: {session}} = await supabase.auth.getSession()
    const token = session?.access_token

    if (!token) {
        redirect('/login')
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/celulas/${id}`
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("Erro ao buscar a célula")
    }

    return response.json()
}

export async function getEncontros(id: number): Promise<EncontroCelula[]> {
    const supabase = await createClient()

    const {data: {session}} = await supabase.auth.getSession()
    const token = session?.access_token

    if (!token) {
        redirect('/login')
    }
    
    const url = `${process.env.NEXT_PUBLIC_API_URL}/celulas/${id}/encontros`
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response.json()  
}

export async function getMembros(id: number): Promise<Membro[]> {
    const supabase = await createClient()

    const {data: {session}} = await supabase.auth.getSession()
    const token = session?.access_token

    if (!token) {
        redirect('/login')
    }
    
    const url = `${process.env.NEXT_PUBLIC_API_URL}/celulas/${id}/membros`
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response.json()
}


