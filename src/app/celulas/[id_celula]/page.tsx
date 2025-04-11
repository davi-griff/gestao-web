import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Celula } from "@/types/celula";
import { EncontroCelula } from "@/types/encontroCelula";
import { Membro } from "@/types/membro";
import { columns } from "./columns-encontros";
import { columnsMembros } from "./columns-membros";
import { DataTable } from "@/components/data-table";
import ButtonRedirect from "@/components/button-redirect";
import { PlusIcon } from "lucide-react";
import { getCelula, getEncontros, getMembros } from "@/utils/gestao-api/celula-client";
import { getSupervisor } from "@/utils/gestao-api/supervisor-client";

export default async function CelulaPage({ params }: { params: { id_celula: string } }) {
    const { id_celula } = await params;
    const celula = await getCelula(Number(id_celula));
    const encontros = await getEncontros(Number(id_celula));
    const membros = await getMembros(Number(id_celula));
    const supervisor = await getSupervisor(celula.supervisor);

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Detalhes da celula {celula.nome}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Lider</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{celula.lider}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Supervisor</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{supervisor.nome}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quantidade de membros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{celula.qtd_membros}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Local</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{celula.local}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Rede</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{celula.rede}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Dia da semana</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{celula.dia_da_semana}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Horário</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{celula.horario}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Encontros</h2>
                <DataTable columns={columns} data={encontros} path="/celulas" />
                <div className="flex justify-end mt-4">
                    <ButtonRedirect href={`/celulas/${id_celula}/novo_encontro`}>
                        <PlusIcon className="w-4 h-4" />
                        Novo Encontro
                    </ButtonRedirect>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Membros</h2>
                <DataTable columns={columnsMembros} data={membros} path="/celulas" />
                <div className="flex justify-end mt-4">
                    <ButtonRedirect href={`/celulas/${id_celula}/novo_membro`}>
                        <PlusIcon className="w-4 h-4" />
                        Novo Membro
                    </ButtonRedirect>
                </div>
            </div>
        </div>
    )
}
