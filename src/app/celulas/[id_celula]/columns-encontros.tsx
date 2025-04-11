"use client"

import { EncontroCelula } from "@/types/encontroCelula";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";


export const columns: ColumnDef<EncontroCelula>[] = [
    {
        header: "Data",
        accessorKey: "data",
        cell: ({ row }) => {
            const encontro = row.original
            return <span>{format(new Date(encontro.data), "dd/MM/yyyy")}</span>
        }
    },
    {
        header: "Pregador",
        accessorKey: "pregador",
    },
    {
        header: "Quantidade de presentes",
        accessorKey: "qtd_presentes",
    },
    {
        header: "Quantidade de visitantes",
        accessorKey: "qtd_visitantes",
    },
    {
        header: "Oferta arrecadada",
        accessorKey: "oferta_arrecadada",
    },
]
