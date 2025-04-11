"use client"

import {z} from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useParams } from "next/navigation"
import { Membro } from "@/types/membro"
import { useState } from "react"
import { createNewMembro } from "@/utils/gestao-api/celula-client"
import { toast } from "sonner"
import { Form,FormControl, FormItem, FormLabel, FormMessage, FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
interface NovoMembroCelulaFormProps {
    initialData?: Membro
}

const formSchema = z.object({
    ID: z.number().optional(),
    nome: z.string().min(1, "Nome do membro é obrigatório"),
    telefone: z.string().min(1, "Telefone do membro é obrigatório"),
    email: z.string().min(1, "Email do membro é obrigatório"),
    data_nascimento: z.date(),
    endereco: z.string().min(1, "Endereço do membro é obrigatório"),
    batizado: z.boolean().optional(),
})

export default function NovoMembroCelulaForm({ initialData }: NovoMembroCelulaFormProps) {
    const router = useRouter()
    const params = useParams()
    const id_celula = params.id_celula
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const isEditMode = !!initialData?.ID

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            ID: 0,
            nome: "",
            telefone: "",
            email: "",
            data_nascimento: new Date(),
            endereco: "",
            batizado: false,
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)

        try {
            let response: Membro
            if (isEditMode) {
                const membro: Membro = {
                    ...values,
                    ID: initialData?.ID || 0,
                    batizado: values.batizado || false,
                }
                response = await createNewMembro(Number(id_celula), membro)
            } else {
                const membro: Membro = {
                    ...values,
                    ID: 0,
                    batizado: values.batizado || false,
                }
                response = await createNewMembro(Number(id_celula), membro)
                console.log(`Membro salvo com sucesso: ${response.ID}`)
            }

            toast.success(isEditMode ? "Membro atualizado com sucesso!" : "Membro salvo com sucesso!", {
                description: `Membro "${values.nome}" ${isEditMode ? "atualizado" : "registrado"} com sucesso`,
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
                        name="nome"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: João da Silva" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="telefone"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Telefone</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: (11) 99999-9999" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: joao.silva@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />  

                    <FormField
                        control={form.control}
                        name="data_nascimento"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Data de Nascimento</FormLabel>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="endereco"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Endereço</FormLabel>
                                    <FormControl>
                                    <Input placeholder="Ex: Rua das Flores, 123" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
               
                    <FormField
                        control={form.control}
                        name="batizado"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center">
                                <FormLabel>Batizado</FormLabel>
                                <FormControl>
                                    <Checkbox
                                        className="w-6 h-6"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
            </form>
        </Form>
    )

    
}
