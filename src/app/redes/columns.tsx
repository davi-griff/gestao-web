import { Rede } from "@/types/rede";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Rede>[] = [
  {
    header: "Nome",
    accessorKey: "nome",
  },
];
