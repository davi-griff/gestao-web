import { ColumnDef } from "@tanstack/react-table";

export type Aluno = {
    id: number;
    nome: string;
    telefone: string;
}


export const columns: ColumnDef<Aluno>[] = [
    {
        header: "Nome",
        accessorKey: "nome",
    },
    {
        header: "Telefone",
        accessorKey: "telefone",
    }
]

