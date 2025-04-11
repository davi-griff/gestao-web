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
import { getRedes } from "@/utils/gestao-api/rede-client"
import { Rede } from "@/types/rede"
import { getSupervisores } from "@/utils/gestao-api/supervisor-client"
import { Supervisor } from "@/types/supervisor"
import { Grupo } from "@/types/grupo"
import { submitCelula } from "@/utils/gestao-api/celula-client"
import { useRouter } from "next/navigation"
import { Celula } from "@/types/celula"
// Props for the form component
interface HopeGroupFormProps {
  initialData?: Celula
  onSubmitSuccess?: (data: Celula) => void
  onCancel?: () => void
}

const formSchema = z.object({
  ID: z.number().optional(),
  nome: z.string().min(1, "Nome do grupo é obrigatório"),
  lider: z.string().min(1, "Líder é obrigatório"),
  supervisor: z.number().min(1, "Supervisor é obrigatório"),
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

export default function GroupForm({ initialData, onSubmitSuccess, onCancel }: HopeGroupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [supervisores, setSupervisores] = useState<Supervisor[]>([])
  const [redes, setRedes] = useState<Rede[]>([])
  const [isLoadingSupervisores, setIsLoadingSupervisores] = useState(true)
  const [isLoadingRedes, setIsLoadingRedes] = useState(true)
  const [errorLoadingSupervisores, setErrorLoadingSupervisores] = useState<string | null>(null)
  const [errorLoadingRedes, setErrorLoadingRedes] = useState<string | null>(null)
  const router = useRouter()

  // Determine if we're in edit mode
  const isEditMode = !!initialData?.ID

  // Set up form with either default values or initialData if provided
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nome: "",
      lider: "",
      supervisor: 0,
      qtd_membros: 0,
      local: "",
      rede: "",
      dia_da_semana: "",
      horario: "00:00",
    },
  })

  // Fetch supervisors from API
  useEffect(() => {
    const fetchSupervisores = async () => {
      setIsLoadingSupervisores(true)
      setErrorLoadingSupervisores(null)

      try {
        const data = await getSupervisores()

        setSupervisores(data)

        // Only set default value if we're not in edit mode and we have supervisors
        if (!isEditMode && data.length > 0 && !form.getValues("supervisor")) {
          form.setValue("supervisor", data[0].ID)
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

  useEffect(() => {
    const fetchRedes = async () => {
      setIsLoadingRedes(true)
      setErrorLoadingRedes(null)
      try {
        const redes = await getRedes()
        setRedes(redes)

        if (!isEditMode && redes.length > 0 && !form.getValues("rede")) {
          form.setValue("rede", redes[0].nome)
        }
      } catch (error) {
        console.error("Erro ao carregar redes:", error)
        setErrorLoadingRedes("Não foi possível carregar a lista de redes. Tente novamente mais tarde.")
      } finally {
        setIsLoadingRedes(false)
      }
    }
    fetchRedes()
  }, [form, isEditMode])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      let response: Grupo
      if (isEditMode) {
        const celula: Grupo = {
          ...values,
          ID: initialData?.ID || 0,
          supervisor: Number(values.supervisor),
        }
        response = await submitCelula(celula, "PUT")
      } else {
        const celula: Grupo = {
          ...values,
          ID: 0,
          supervisor: Number(values.supervisor),
        }
        response = await submitCelula(celula, "POST")
        console.log(`Grupo salvo com sucesso: ${response.ID}`)
      }

      // Different message based on create/edit
      toast.success(isEditMode ? "Grupo atualizado com sucesso!" : "Grupo salvo com sucesso!", {
        description: `Grupo "${values.nome}" ${isEditMode ? "atualizado" : "registrado"} com sucesso`,
      })

      router.push(`/celulas/${response.ID}`)
    } catch (error) {
      console.error("Erro ao salvar grupo:", error)
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
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingRedes} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={isLoadingRedes ? "Carregando redes..." : "Selecione uma rede"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {redes.map((rede) => (
                      <SelectItem key={rede.ID} value={rede.nome}>
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
                  <Input placeholder="Ex: Pastor ..." {...field} />
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
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
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
                        <SelectItem key={supervisor.ID} value={supervisor.ID.toString()}>
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

