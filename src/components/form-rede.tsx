"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Rede } from "@/types/rede"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { createRede } from "@/utils/gestao-api/rede-client"
import { toast } from "sonner"
import { format } from "date-fns"
interface RedeFormProps {
    initialData?: Rede
}

const formSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
})

export default function RedeForm({ initialData }: RedeFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const params = useParams();
    const id_rede = params.id_rede;
    const router = useRouter();
    const isEditMode = !!initialData
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            nome: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        
        try {
            let response: Rede

            if (isEditMode) {
                const rede: Rede = {
                    ...values,
                    ID: initialData?.ID || 0,
                    label: initialData?.label || values.nome,
                }
                response = await createRede(rede)
            } else {
                const rede: Rede = {
                    ...values,
                    ID: 0,
                    label: values.nome,
                }
                response = await createRede(rede)
            }

            toast.success(isEditMode ? "Rede atualizada com sucesso!" : "Rede salva com sucesso!", {
                description: `Rede ${isEditMode ? "atualizada" : "registrada"} com sucesso`,
            })

            router.push(`/redes`)

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
            </form>
        </Form>
    )
}