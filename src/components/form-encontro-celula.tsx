"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Loader2, Search } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Membro } from "@/types/membro"
import { createNewEncontro, getMembros } from "@/utils/gestao-api/celula-client"
import { EncontroCelula } from "@/types/encontroCelula"
import { useRouter, useParams } from "next/navigation"

interface EncontroCelulaFormProps {
  initialData?: EncontroCelula
}

const formSchema = z.object({
  data: z.date({
    required_error: "Data é obrigatória",
  }),
  pregador: z.string().min(1, "Pregador é obrigatório"),
  qtd_presentes: z.coerce.number().int("Deve ser um número inteiro").min(0, "Não pode ser negativo"),
  qtd_visitantes: z.coerce.number().int("Deve ser um número inteiro").min(0, "Não pode ser negativo"),
  oferta_arrecadada: z.coerce.number().min(0, "Não pode ser negativo"),
  membros_presentes: z.array(z.number()),
})

export default function EncontroCelulaForm({  initialData }: EncontroCelulaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const params = useParams();
  const id_celula = params.id_celula;
  const router = useRouter();

  // Member states
  const [membros, setMembros] = useState<Membro[]>([])
  const [isLoadingMembros, setIsLoadingMembros] = useState(true)
  const [errorLoadingMembros, setErrorLoadingMembros] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Determine if we're in edit mode
  const isEditMode = !!initialData?.ID

  // Set up form with either default values or initialData if provided
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      data: new Date(),
      pregador: "",
      qtd_presentes: 0,
      qtd_visitantes: 0,
      oferta_arrecadada: 0,
      membros_presentes: []
    },
  })

  // Fetch members from API
  useEffect(() => {
    const fetchMembros = async () => {
      setIsLoadingMembros(true)
      setErrorLoadingMembros(null)

      try {
        
        const data = await getMembros(Number(id_celula))

        setMembros(data)
      } catch (error) {
        console.error("Erro ao carregar membros:", error)
        setErrorLoadingMembros("Não foi possível carregar a lista de membros. Tente novamente mais tarde.")
      } finally {
        setIsLoadingMembros(false)
      }
    }

    fetchMembros()
  }, [])

  // Filter members based on search term
  const filteredMembros = membros.filter((membro) => membro.nome.toLowerCase().includes(searchTerm.toLowerCase()))

  // Handle member checkbox change
  const handleMemberCheckboxChange = (memberId: number, checked: boolean) => {
    const currentMembrosPresentes = form.getValues("membros_presentes")

    if (checked) {
      // Add member to the list if not already present
      if (!currentMembrosPresentes.includes(memberId)) {
        form.setValue("membros_presentes", [...currentMembrosPresentes, memberId])
      }
    } else {
      // Remove member from the list
      form.setValue(
        "membros_presentes",
        currentMembrosPresentes.filter((id) => id !== memberId),
      )
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      let response: EncontroCelula

      if (isEditMode) {
        const encontro: EncontroCelula = {
          ...values,
          ID: initialData?.ID || 0,
          id_celula: Number(id_celula),
        }
        response = await createNewEncontro(Number(id_celula), encontro)
      } else {
        const encontro: EncontroCelula = {
          ...values,
          ID: 0,
          id_celula: Number(id_celula),
        }
        response = await createNewEncontro(Number(id_celula), encontro)
        console.log(`Encontro salvo com sucesso: ${response.ID}`)
      }

      // Different message based on create/edit
      toast.success(isEditMode ? "Registro atualizado com sucesso!" : "Registro salvo com sucesso!", {
        description: `Serviço de ${format(values.data, "dd/MM/yyyy")} ${isEditMode ? "atualizado" : "registrado"} com sucesso`,
      })

      router.push(`/celulas/${id_celula}`)
    } catch (error) {
      toast.error(isEditMode ? "Erro ao atualizar" : "Erro ao salvar", {
        description: `Ocorreu um erro ao ${isEditMode ? "atualizar" : "salvar"} o registro. Tente novamente.`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="data"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pregador"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pregador</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Pastor ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="qtd_presentes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade de Presentes</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="qtd_visitantes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade de Visitantes</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="oferta_arrecadada"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Oferta Arrecadada</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    {...field}
                    onChange={(e) => {
                      field.onChange(Number.parseFloat(e.target.value))
                    }}
                    placeholder="R$ 0,00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Member attendance section */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Presença</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar membro..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <FormField
                control={form.control}
                name="membros_presentes"
                render={() => (
                  <FormItem>
                    <div className="border rounded-md">
                      {isLoadingMembros ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      ) : errorLoadingMembros ? (
                        <div className="p-4 text-center text-sm text-destructive">{errorLoadingMembros}</div>
                      ) : filteredMembros.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          {searchTerm ? "Nenhum membro encontrado com esse termo" : "Nenhum membro cadastrado"}
                        </div>
                      ) : (
                        <div className="max-h-60 overflow-y-auto p-1">
                          {filteredMembros.map((membro) => {
                            const isChecked = form.getValues("membros_presentes").includes(membro.ID)

                            return (
                              <div
                                key={membro.ID}
                                className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md"
                              >
                                <Checkbox
                                  id={`membro-${membro.ID}`}
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    handleMemberCheckboxChange(membro.ID, checked as boolean)
                                  }}
                                />
                                <label
                                  htmlFor={`membro-${membro.ID}`}
                                  className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  <div className="flex flex-col">
                                    <span>{membro.nome}</span>
                                    {membro.telefone && (
                                      <span className="text-xs text-muted-foreground mt-1">{membro.telefone}</span>
                                    )}
                                  </div>
                                </label>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {form.getValues("membros_presentes").length} membro(s) marcado(s) como presente
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(`/celulas/${id_celula}`)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "Atualizando..." : "Salvando..."}
              </>
            ) : isEditMode ? (
              "Atualizar Registro"
            ) : (
              "Salvar Registro"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

