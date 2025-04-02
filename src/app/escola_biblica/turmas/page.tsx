import { DataTable } from "@/components/data-table";
import { Turma, columns } from "./columns";
import ButtonRedirect from "@/components/button-redirect";
import { Plus } from "lucide-react";

async function getTurmas(): Promise<Turma[]> {
    return [
        {
            id: 1,
            nome: "Panorama Bíblico",
            descricao: "Panorama Bíblico",
            periodo: "1 semestre 2025",
            data_inicio: "2025-01-01",
            data_fim: "2025-06-30",
        },
        {
            id: 2,
            nome: "Liderança",
            descricao: "Liderança",
            periodo: "1 semestre 2025",
            data_inicio: "2025-01-01",
            data_fim: "2025-06-30",
        },
    ];
}

export default async function Turmas() {
    const turmas = await getTurmas();
    return (
        <div>
            <div>
                <DataTable columns={columns} data={turmas} path="/escola_biblica/turmas" />
            </div>

            <div className="flex justify-end mt-4">
                <ButtonRedirect href="/escola_biblica/turmas/nova_turma">
                    <Plus className="w-4 h-4" />
                    Nova Turma
                </ButtonRedirect>
            </div>
        </div>
    )
}
