import FormNovoCulto from "@/components/form-culto"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Registro de Culto</h1>
      <div className="max-w-2xl mx-auto">
        <FormNovoCulto />
      </div>
    </main>
  )
}

