"use client"

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, PencilIcon, Trash } from "lucide-react";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export type Turma = {
    id: number;
    nome: string;
    descricao: string;
    periodo: string;
    data_inicio: string;
    data_fim: string;
}

export const columns: ColumnDef<Turma>[] = [
    {
        header: "Nome",
        accessorKey: "nome",
    },
    {
        header: "Descrição",
        accessorKey: "descricao",
    },
    {
        header: "Período",
        accessorKey: "periodo",
    },
    {
        header: "Data de Início",
        accessorKey: "data_inicio",
        cell: ({ row }) => {
            const turma = row.original
            return <span>{format(new Date(turma.data_inicio), "dd/MM/yyyy")}</span>
        }
    },
    {
        header: "Data de Fim",
        accessorKey: "data_fim",
        cell: ({ row }) => {
            const turma = row.original
            return <span>{format(new Date(turma.data_fim), "dd/MM/yyyy")}</span>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const turma = row.original
            const router = useRouter()
    
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`/escola_biblica/turmas/${turma.id}`)} >
                         <Button variant="ghost" className="h-8 w-8 p-0" >
                            <Eye className="h-4 w-4" />
                         </Button>
                            Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/escola_biblica/turmas/${turma.id}/editar`)} >
                            <Button variant="ghost" className="h-8 w-8 p-0" >
                                <Edit className="h-4 w-4" />
                            </Button>
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Button variant="ghost" className="h-8 w-8 p-0" >
                                <Trash className="h-4 w-4" />
                            </Button>
                            Excluir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }   
    }
];
