"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AttendanceForm, { type CultoFormData } from "@/components/form-novo-culto"
import { Loader2 } from "lucide-react"

export default function EditCultoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [culto, setCulto] = useState<CultoFormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCulto = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Replace with your actual API endpoint
        // const response = await fetch(`/api/cultos/${params.id}`)
        // const data = await response.json()

        // Simulating API response for demonstration
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data for demonstration
        const data = {
          id: params.id,
          nome: "Culto de Domingo",
          data: new Date("2024-05-15"),
          pastor: "2", // ID do pastor
          qtd_jovens: 15,
          qtd_adultos: 25,
          qtd_criancas: 10,
          qtd_visitantes: 30,
          qtd_batismo: 5,
          qtd_conversao: 2,
        }

        setCulto(data)
      } catch (error) {
        console.error("Erro ao carregar culto:", error)
        setError("Não foi possível carregar os dados do culto. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCulto()
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
        <p className="text-muted-foreground">Carregando dados do culto...</p>
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
      <h1 className="text-3xl font-bold mb-6 text-center">Editar Registro de Culto</h1>
      <div className="max-w-2xl mx-auto">
        {culto && <AttendanceForm initialData={culto} onSubmitSuccess={handleSubmitSuccess} onCancel={handleCancel} />}
      </div>
    </main>
  )
}

