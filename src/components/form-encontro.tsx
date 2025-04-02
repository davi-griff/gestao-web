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

// Interface for preacher data
interface Pregador {
  id: string
  nome: string
}

// Interface for member data
interface Membro {
  id: string
  nome: string
  telefone?: string
  email?: string
}

// Interface for form data
export interface ServicoFormData {
  id?: number
  data: Date
  pregador: string
  qtd_presentes: number
  qtd_visitantes: number
  oferta_arrecadada: number
  membros_presentes: string[] // Array of member IDs who are present
}

// Props for the form component
interface ServicoFormProps {
  initialData?: ServicoFormData
  onSubmitSuccess?: (data: ServicoFormData) => void
  onCancel?: () => void
}

const formSchema = z.object({
  id: z.number().optional(),
  data: z.date({
    required_error: "Data é obrigatória",
  }),
  pregador: z.string().min(1, "Pregador é obrigatório"),
  qtd_presentes: z.coerce.number().int("Deve ser um número inteiro").min(0, "Não pode ser negativo"),
  qtd_visitantes: z.coerce.number().int("Deve ser um número inteiro").min(0, "Não pode ser negativo"),
  oferta_arrecadada: z.coerce.number().min(0, "Não pode ser negativo"),
  membros_presentes: z.array(z.string()),
})

export default function ServicoForm({ initialData, onSubmitSuccess, onCancel }: ServicoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pregadores, setPregadores] = useState<Pregador[]>([])
  const [isLoadingPregadores, setIsLoadingPregadores] = useState(true)
  const [errorLoadingPregadores, setErrorLoadingPregadores] = useState<string | null>(null)

  // Member states
  const [membros, setMembros] = useState<Membro[]>([])
  const [isLoadingMembros, setIsLoadingMembros] = useState(true)
  const [errorLoadingMembros, setErrorLoadingMembros] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Determine if we're in edit mode
  const isEditMode = !!initialData?.id

  // Set up form with either default values or initialData if provided
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      data: new Date("2024-01-01"),
      pregador: "",
      qtd_presentes: 10,
      qtd_visitantes: 0,
      oferta_arrecadada: 100,
      membros_presentes: [],
    },
  })

  // Fetch preachers from API
  useEffect(() => {
    const fetchPregadores = async () => {
      setIsLoadingPregadores(true)
      setErrorLoadingPregadores(null)

      try {
        // Replace with your actual API endpoint
        // const response = await fetch('/api/pregadores')
        // const data = await response.json()

        // Simulating API response for demonstration
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const data = [
          { id: "1", nome: "Pastor João Silva" },
          { id: "2", nome: "Pastor Carlos Oliveira" },
          { id: "3", nome: "Pastor Marcos Santos" },
          { id: "4", nome: "Pastor André Souza" },
          { id: "5", nome: "Pastor Lucas Ferreira" },
        ]

        setPregadores(data)

        // Only set default value if we're not in edit mode and we have preachers
        if (!isEditMode && data.length > 0 && !form.getValues("pregador")) {
          form.setValue("pregador", data[0].id)
        }
      } catch (error) {
        console.error("Erro ao carregar pregadores:", error)
        setErrorLoadingPregadores("Não foi possível carregar a lista de pregadores. Tente novamente mais tarde.")
      } finally {
        setIsLoadingPregadores(false)
      }
    }

    fetchPregadores()
  }, [form, isEditMode])

  // Fetch members from API
  useEffect(() => {
    const fetchMembros = async () => {
      setIsLoadingMembros(true)
      setErrorLoadingMembros(null)

      try {
        // Replace with your actual API endpoint
        // const response = await fetch('/api/membros')
        // const data = await response.json()

        // Simulating API response for demonstration
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const data = [
          { id: "1", nome: "Ana Silva", telefone: "(11) 98765-4321", email: "ana@example.com" },
          { id: "2", nome: "Bruno Oliveira", telefone: "(11) 91234-5678", email: "bruno@example.com" },
          { id: "3", nome: "Carla Santos", telefone: "(11) 99876-5432", email: "carla@example.com" },
          { id: "4", nome: "Daniel Souza", telefone: "(11) 98765-1234", email: "daniel@example.com" },
          { id: "5", nome: "Eduarda Lima", telefone: "(11) 91234-8765", email: "eduarda@example.com" },
          { id: "6", nome: "Fábio Costa", telefone: "(11) 99876-1234", email: "fabio@example.com" },
          { id: "7", nome: "Gabriela Pereira", telefone: "(11) 98765-8765", email: "gabriela@example.com" },
          { id: "8", nome: "Henrique Alves", telefone: "(11) 91234-1234", email: "henrique@example.com" },
          { id: "9", nome: "Isabela Ferreira", telefone: "(11) 99876-8765", email: "isabela@example.com" },
          { id: "10", nome: "João Ribeiro", telefone: "(11) 98765-5678", email: "joao@example.com" },
          { id: "11", nome: "Karina Martins", telefone: "(11) 91234-4321", email: "karina@example.com" },
          { id: "12", nome: "Lucas Barbosa", telefone: "(11) 99876-5678", email: "lucas@example.com" },
          { id: "13", nome: "Mariana Dias", telefone: "(11) 98765-4321", email: "mariana@example.com" },
          { id: "14", nome: "Nelson Gomes", telefone: "(11) 91234-5678", email: "nelson@example.com" },
          { id: "15", nome: "Olívia Castro", telefone: "(11) 99876-5432", email: "olivia@example.com" },
        ]

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
  const handleMemberCheckboxChange = (memberId: string, checked: boolean) => {
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get preacher name for display in toast
      const pregadorNome = pregadores.find((p) => p.id === values.pregador)?.nome || values.pregador

      const submittedData = {
        ...values,
        pregadorNome,
      }

      console.log(submittedData)

      // Different message based on create/edit
      toast.success(isEditMode ? "Registro atualizado com sucesso!" : "Registro salvo com sucesso!", {
        description: `Serviço de ${format(values.data, "dd/MM/yyyy")} ${isEditMode ? "atualizado" : "registrado"} com sucesso`,
      })

      // Call the success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess(values)
      }
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  disabled={isLoadingPregadores}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={isLoadingPregadores ? "Carregando pregadores..." : "Selecione um pregador"}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingPregadores ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : errorLoadingPregadores ? (
                      <div className="p-2 text-center text-sm text-destructive">{errorLoadingPregadores}</div>
                    ) : pregadores.length === 0 ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">Nenhum pregador encontrado</div>
                    ) : (
                      pregadores.map((pregador) => (
                        <SelectItem key={pregador.id} value={pregador.id}>
                          {pregador.nome}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
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
                            const isChecked = form.getValues("membros_presentes").includes(membro.id)

                            return (
                              <div
                                key={membro.id}
                                className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md"
                              >
                                <Checkbox
                                  id={`membro-${membro.id}`}
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    handleMemberCheckboxChange(membro.id, checked as boolean)
                                  }}
                                />
                                <label
                                  htmlFor={`membro-${membro.id}`}
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
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || isLoadingPregadores}>
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

