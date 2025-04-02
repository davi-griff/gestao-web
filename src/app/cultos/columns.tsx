"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useRouter } from "next/navigation"
import { format } from "date-fns"

export type Culto = {
  id: number;
  nome: string;
  data: string;
  pastor: string;
}


export const columns: ColumnDef<Culto>[] = [
  {
    header: "Nome",
    accessorKey: "nome",
  },
  {
    header: "Data",
    accessorKey: "data",
    cell: ({ row }) => {
      const culto = row.original
      return <span>{format(new Date(culto.data), "dd/MM/yyyy")}</span>
    }
  },
  {
    header: "Pastor",
    accessorKey: "pastor",
  },
  {
    id: "actions",
    cell: ({ row }) => {
        const culto = row.original
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
                    <DropdownMenuItem onClick={() => router.push(`/cultos/${culto.id}`)} >
                     <Button variant="ghost" className="h-8 w-8 p-0" >
                        <Eye className="h-4 w-4" />
                     </Button>
                        Detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/cultos/${culto.id}/editar`)} >
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