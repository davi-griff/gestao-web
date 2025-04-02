import { ColumnDef } from "@tanstack/react-table";

export type Encontro = {
    id: number;
    data: string;
    pregador: string;
    qtd_presentes: number;
    qtd_visitantes: number;
    oferta_arrecadada: number;
}

export const columns: ColumnDef<Encontro>[] = [
    {
        header: "Data",
        accessorKey: "data",
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
