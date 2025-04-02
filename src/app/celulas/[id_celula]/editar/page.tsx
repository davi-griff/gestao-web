"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import HopeGroupForm, { type HopeGroupData } from "@/components/form-celula"
import { Loader2 } from "lucide-react"

export default function EditHopeGroupPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [grupo, setGrupo] = useState<HopeGroupData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGrupo = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Replace with your actual API endpoint
        // const response = await fetch(`/api/grupos/${params.id}`)
        // const data = await response.json()

        // Simulating API response for demonstration
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data for demonstration
        const data = {
          id: Number.parseInt(params.id),
          nome: "Hope 1",
          lider: "Pastor Lucas",
          supervisor: "1", // ID do supervisor
          qtd_membros: 10,
          local: "Tv. Jose Pio 157",
          rede: "Hope",
          dia_da_semana: "Sabado",
          horario: "17:00",
        }

        setGrupo(data)
      } catch (error) {
        console.error("Erro ao carregar grupo:", error)
        setError("Não foi possível carregar os dados do grupo. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchGrupo()
  }, [params.id])

  const handleSubmitSuccess = () => {
    // Navigate back to the list or detail page after successful update
    router.push("/")
  }

  const handleCancel = () => {
    router.back()
  }

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
      <h1 className="text-3xl font-bold mb-6 text-center">Editar Grupo Hope</h1>
      <div className="max-w-2xl mx-auto">
        {grupo && <HopeGroupForm initialData={grupo} onSubmitSuccess={handleSubmitSuccess} onCancel={handleCancel} />}
      </div>
    </main>
  )
}

