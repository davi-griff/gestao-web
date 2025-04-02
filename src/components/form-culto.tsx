"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

// Interface for pastor data
interface Pastor {
  id: string
  nome: string
}

// Interface for form data
export interface CultoFormData {
  id?: string
  nome: string
  data: Date
  pastor: string
  qtd_jovens: number
  qtd_adultos: number
  qtd_criancas: number
  qtd_visitantes: number
  qtd_batismo: number
  qtd_conversao: number
}

// Props for the form component
interface AttendanceFormProps {
  initialData?: CultoFormData
  onSubmitSuccess?: (data: CultoFormData) => void
  onCancel?: () => void
}

const formSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "Nome do culto é obrigatório"),
  data: z.date({
    required_error: "Data é obrigatória",
  }),
  pastor: z.string().min(1, "Pastor é obrigatório"),
  qtd_jovens: z.coerce.number().int("Deve ser um número inteiro").min(0, "Não pode ser negativo"),
  qtd_adultos: z.coerce.number().int("Deve ser um número inteiro").min(0, "Não pode ser negativo"),
  qtd_criancas: z.coerce.number().int("Deve ser um número inteiro").min(0, "Não pode ser negativo"),
  qtd_visitantes: z.coerce.number().int("Deve ser um número inteiro").min(0, "Não pode ser negativo"),
  qtd_batismo: z.coerce.number().int("Deve ser um número inteiro").min(0, "Não pode ser negativo"),
  qtd_conversao: z.coerce.number().int("Deve ser um número inteiro").min(0, "Não pode ser negativo"),
})

export default function AttendanceForm({ initialData, onSubmitSuccess, onCancel }: AttendanceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pastores, setPastores] = useState<Pastor[]>([])
  const [isLoadingPastores, setIsLoadingPastores] = useState(true)
  const [errorLoadingPastores, setErrorLoadingPastores] = useState<string | null>(null)

  // Determine if we're in edit mode
  const isEditMode = !!initialData?.id

  // Set up form with either default values or initialData if provided
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nome: "Culto 1",
      data: new Date("2024-01-01"),
      pastor: "",
      qtd_jovens: 0,
      qtd_adultos: 0,
      qtd_criancas: 0,
      qtd_visitantes: 0,
      qtd_batismo: 0,
      qtd_conversao: 0,
    },
  })

  // Fetch pastors from API
  useEffect(() => {
    const fetchPastores = async () => {
      setIsLoadingPastores(true)
      setErrorLoadingPastores(null)

      try {
        // Replace with your actual API endpoint
        // const response = await fetch('/api/pastores')
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

        setPastores(data)

        // Only set default value if we're not in edit mode and we have pastors
        if (!isEditMode && data.length > 0 && !form.getValues("pastor")) {
          form.setValue("pastor", data[0].id)
        }
      } catch (error) {
        console.error("Erro ao carregar pastores:", error)
        setErrorLoadingPastores("Não foi possível carregar a lista de pastores. Tente novamente mais tarde.")
      } finally {
        setIsLoadingPastores(false)
      }
    }

    fetchPastores()
  }, [form, isEditMode])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get pastor name for display in toast
      const pastorNome = pastores.find((p) => p.id === values.pastor)?.nome || values.pastor

      const submittedData = {
        ...values,
        pastorNome,
      }

      console.log(submittedData)

      // Different message based on create/edit
      toast.success(isEditMode ? "Registro atualizado com sucesso!" : "Registro salvo com sucesso!", {
        description: `Culto "${values.nome}" ${isEditMode ? "atualizado" : "registrado"} para ${format(values.data, "dd/MM/yyyy")}`,
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
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Culto</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Culto de Domingo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </div>

        <FormField
          control={form.control}
          name="pastor"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Pastor</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                disabled={isLoadingPastores}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isLoadingPastores ? "Carregando pastores..." : "Selecione um pastor"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingPastores ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : errorLoadingPastores ? (
                    <div className="p-2 text-center text-sm text-destructive">{errorLoadingPastores}</div>
                  ) : pastores.length === 0 ? (
                    <div className="p-2 text-center text-sm text-muted-foreground">Nenhum pastor encontrado</div>
                  ) : (
                    pastores.map((pastor) => (
                      <SelectItem key={pastor.id} value={pastor.id}>
                        {pastor.nome}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="qtd_jovens"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade de Jovens</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="qtd_adultos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade de Adultos</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="qtd_criancas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade de Crianças</FormLabel>
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
            name="qtd_batismo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade de Batismos</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="qtd_conversao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade de Conversões</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || isLoadingPastores}>
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

