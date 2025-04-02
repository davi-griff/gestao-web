"use client";

import { Button } from "@/components/ui/button";
import { Minus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

export type Membro = {
    id: number;
    nome: string;
    telefone: string;
    email: string;
    data_nascimento: string;
    endereco: string;
}

export const columnsMembros: ColumnDef<Membro>[] = [
    {
        header: "Nome",
        accessorKey: "nome",
    },
    {
        header: "Telefone",
        accessorKey: "telefone",
    },
    {
        header: "Email",
        accessorKey: "email",
    },
    {
        header: "Data de nascimento",
        accessorKey: "data_nascimento",
    },
    {
        header: "Endereço",
        accessorKey: "endereco",
    },
    {
        header: "Ações",
        cell: ({ row }) => {
            const celula = row.original
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
                        <DropdownMenuItem>
                            <Button variant="ghost" className="h-8 w-8 p-0" >
                                <Minus className="h-4 w-4" />
                            </Button>
                            Remover Membro
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    },
]

