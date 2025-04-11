"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { Celula } from "@/types/celula";


export const columns: ColumnDef<Celula>[] = [
    {
        header: "Nome",
        accessorKey: "nome",
    },
    {
        header: "Lider",
        accessorKey: "lider",
    },
    {
        header: "Supervisor",
        accessorKey: "supervisor",
    },
    {
        header: "Quantidade de Membros",
        accessorKey: "qtd_membros",
    },
    {
        header: "Local",
        accessorKey: "local",
    },
    {
        header: "Rede",
        accessorKey: "rede",
    },
    {
        header: "Dia da Semana",
        accessorKey: "dia_da_semana",
    },
    {
        header: "Horário",
        accessorKey: "horario",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const celula = row.original
            const router = useRouter()
    
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`/celulas/${celula.ID}`)} >
                            <Eye className="h-4 w-4 mr-2" />
                            Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/celulas/${celula.ID}/editar`)} >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Trash className="h-4 w-4 mr-2" />
                            Excluir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
      }
];
