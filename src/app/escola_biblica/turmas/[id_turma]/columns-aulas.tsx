"use client"

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
export type Aula = {
    id: number;
    data: string;
    descricao: string;
    professor: string;
    qtd_presentes: number;
}

export const columns: ColumnDef<Aula>[] = [
    {
        header: "Data",
        accessorKey: "data",
        cell: ({ row }) => {
            const aula = row.original
            return <span>{format(new Date(aula.data), "dd/MM/yyyy")}</span>
        }
    },
    {
        header: "Descrição",
        accessorKey: "descricao",
    },
    {
        header: "Professor",
        accessorKey: "professor",
    },
    {
        header: "Quantidade de Presentes",
        accessorKey: "qtd_presentes",
    },
]


