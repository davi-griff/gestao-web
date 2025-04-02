"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Clock, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Interface for supervisor data
interface Supervisor {
  id: string
  nome: string
}

// Interface for form data
export interface HopeGroupData {
  id?: number
  nome: string
  lider: string
  supervisor: string
  qtd_membros: number
  local: string
  rede: string
  dia_da_semana: string
  horario: string
}

// Props for the form component
interface HopeGroupFormProps {
  initialData?: HopeGroupData
  onSubmitSuccess?: (data: HopeGroupData) => void
  onCancel?: () => void
}

const formSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(1, "Nome do grupo é obrigatório"),
  lider: z.string().min(1, "Líder é obrigatório"),
  supervisor: z.string().min(1, "Supervisor é obrigatório"),
  qtd_membros: z.coerce.number().int("Deve ser um número inteiro").min(0, "Não pode ser negativo"),
  local: z.string().min(1, "Local é obrigatório"),
  rede: z.string().min(1, "Rede é obrigatória"),
  dia_da_semana: z.string().min(1, "Dia da semana é obrigatório"),
  horario: z.string().min(1, "Horário é obrigatório"),
})

const diasDaSemana = [
  { value: "Domingo", label: "Domingo" },
  { value: "Segunda", label: "Segunda-feira" },
  { value: "Terca", label: "Terça-feira" },
  { value: "Quarta", label: "Quarta-feira" },
  { value: "Quinta", label: "Quinta-feira" },
  { value: "Sexta", label: "Sexta-feira" },
  { value: "Sabado", label: "Sábado" },
]

const redes = [
  { value: "Hope", label: "Hope" },
  { value: "Rede de Mulheres", label: "Rede de Mulheres" },
  { value: "Rede de Homens", label: "Rede de Homens" },
]

export default function HopeGroupForm({ initialData, onSubmitSuccess, onCancel }: HopeGroupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [supervisores, setSupervisores] = useState<Supervisor[]>([])
  const [isLoadingSupervisores, setIsLoadingSupervisores] = useState(true)
  const [errorLoadingSupervisores, setErrorLoadingSupervisores] = useState<string | null>(null)

  // Determine if we're in edit mode
  const isEditMode = !!initialData?.id

  // Set up form with either default values or initialData if provided
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nome: "Hope 1",
      lider: "Pastor Lucas",
      supervisor: "",
      qtd_membros: 10,
      local: "Tv. Jose Pio 157",
      rede: "Hope",
      dia_da_semana: "Sabado",
      horario: "17:00",
    },
  })

  // Fetch supervisors from API
  useEffect(() => {
    const fetchSupervisores = async () => {
      setIsLoadingSupervisores(true)
      setErrorLoadingSupervisores(null)

      try {
        // Replace with your actual API endpoint
        // const response = await fetch('/api/supervisores')
        // const data = await response.json()

        // Simulating API response for demonstration
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const data = [
          { id: "1", nome: "Pastor Rodolfo" },
          { id: "2", nome: "Pastor Marcos" },
          { id: "3", nome: "Pastor André" },
          { id: "4", nome: "Pastor Carlos" },
          { id: "5", nome: "Pastor João" },
        ]

        setSupervisores(data)

        // Only set default value if we're not in edit mode and we have supervisors
        if (!isEditMode && data.length > 0 && !form.getValues("supervisor")) {
          form.setValue("supervisor", data[0].id)
        }
      } catch (error) {
        console.error("Erro ao carregar supervisores:", error)
        setErrorLoadingSupervisores("Não foi possível carregar a lista de supervisores. Tente novamente mais tarde.")
      } finally {
        setIsLoadingSupervisores(false)
      }
    }

    fetchSupervisores()
  }, [form, isEditMode])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get supervisor name for display in toast
      const supervisorNome = supervisores.find((p) => p.id === values.supervisor)?.nome || values.supervisor

      const submittedData = {
        ...values,
        supervisorNome,
      }

      console.log(submittedData)

      // Different message based on create/edit
      toast.success(isEditMode ? "Grupo atualizado com sucesso!" : "Grupo salvo com sucesso!", {
        description: `Grupo "${values.nome}" ${isEditMode ? "atualizado" : "registrado"} com sucesso`,
      })

      // Call the success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess(values)
      }
    } catch (error) {
      toast.error(isEditMode ? "Erro ao atualizar" : "Erro ao salvar", {
        description: `Ocorreu um erro ao ${isEditMode ? "atualizar" : "salvar"} o grupo. Tente novamente.`,
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
                <FormLabel>Nome do Grupo</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Hope 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rede"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Rede</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma rede" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {redes.map((rede) => (
                      <SelectItem key={rede.value} value={rede.value}>
                        {rede.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="lider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Líder</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Pastor Lucas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supervisor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supervisor</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  disabled={isLoadingSupervisores}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={isLoadingSupervisores ? "Carregando supervisores..." : "Selecione um supervisor"}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingSupervisores ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : errorLoadingSupervisores ? (
                      <div className="p-2 text-center text-sm text-destructive">{errorLoadingSupervisores}</div>
                    ) : supervisores.length === 0 ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">Nenhum supervisor encontrado</div>
                    ) : (
                      supervisores.map((supervisor) => (
                        <SelectItem key={supervisor.id} value={supervisor.id}>
                          {supervisor.nome}
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

        <FormField
          control={form.control}
          name="local"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Tv. Jose Pio 157" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="dia_da_semana"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia da Semana</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um dia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {diasDaSemana.map((dia) => (
                      <SelectItem key={dia.value} value={dia.value}>
                        {dia.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="horario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value || <span>Selecione um horário</span>}
                        <Clock className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-4 grid gap-2">
                      <div className="grid grid-cols-4 gap-2">
                        {["17:00", "18:00", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"].map((time) => (
                          <Button
                            key={time}
                            variant={field.value === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              field.onChange(time)
                              document.dispatchEvent(new Event("pointerdown"))
                            }}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="qtd_membros"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade de Membros</FormLabel>
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
          <Button type="submit" disabled={isSubmitting || isLoadingSupervisores}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "Atualizando..." : "Salvando..."}
              </>
            ) : isEditMode ? (
              "Atualizar Grupo"
            ) : (
              "Salvar Grupo"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

