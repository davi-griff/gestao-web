"use client"

import { use, useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Celula } from "@/types/celula"
import { Loader2 } from "lucide-react"
import { getCelula } from "@/utils/gestao-api/celula-client"
import GroupForm from "@/components/form-celula"

export default function EditHopeGroupPage() {
  const router = useRouter()
  const [grupo, setGrupo] = useState<Celula | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const params = useParams<{ id_celula: string }>();
  const id_celula = params.id_celula;

  useEffect(() => {
    const fetchGrupo = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getCelula(Number.parseInt(id_celula))

        setGrupo(data)
      } catch (error) {
        console.error("Erro ao carregar grupo:", error)
        setError("Não foi possível carregar os dados do grupo. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchGrupo()
  }, [id_celula])

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Carregando dados do grupo...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-2xl mx-auto p-6 bg-destructive/10 rounded-lg text-center">
          <p className="text-destructive font-medium">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Editar Grupo</h1>
      <div className="max-w-2xl mx-auto">
        {grupo && <GroupForm initialData={grupo}/>}
      </div>
    </main>
  )
}

