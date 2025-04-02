import ButtonRedirect from "@/components/button-redirect";
import { Celula, columns } from "./columns";

import { DataTable } from "@/components/data-table";
import { PlusIcon } from "lucide-react";

async function getCelulas(): Promise<Celula[]> {
    return [
        {
            id: 1,
            nome: "Hope 1",
            lider: "Pastor Lucas",
            supervisor: "Pastor Rodolfo",
            qtd_membros: 10,
            local: "Tv. Jose Pio 157",
            rede: "Hope",
            dia_da_semana: "Sabado",
            horario: "17:00",
        },
        {
            id: 2,
            nome: "Hope 2",
            lider: "Fabrício	",
            supervisor: "Pastor Rodolfo",
            qtd_membros: 15,
            local: "Tv. Curuça 157",
            rede: "Hope",
            dia_da_semana: "Sabado",
            horario: "18:00",
        }
    ]
}
export default async function CelulasPage() {
    const celulas = await getCelulas();
    return (
        <div>
            <div>
                <DataTable columns={columns} data={celulas} path="/celulas" />
            </div>

            <div className="flex justify-end mt-4">
                <ButtonRedirect href="/celulas/novo_celula">
                    <PlusIcon className="w-4 h-4" />
                    Nova Celula
                </ButtonRedirect>
            </div>
        </div>
    )
}
