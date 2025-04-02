import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Celula } from "../columns"
import { Encontro, columns } from "./columns-encontros";
import { Membro, columnsMembros } from "./columns-membros";
import { DataTable } from "@/components/data-table";
import ButtonRedirect from "@/components/button-redirect";
import { PlusIcon } from "lucide-react";

const Celulas: Record<number, Celula> = {
    1: {
        id: 1,
        nome: "Celula 1",
        lider: "Pastor 1",
        supervisor: "Pastor 2",
        qtd_membros: 10,
        local: "Local 1",
        rede: "Rede 1",
        dia_da_semana: "Domingo",
        horario: "10:00",
    },
    2: {
        id: 2,
        nome: "Celula 2",
        lider: "Pastor 2",
        supervisor: "Pastor 3",
        qtd_membros: 10,
        local: "Local 2",
        rede: "Rede 2",
        dia_da_semana: "Segunda",
        horario: "10:00",
    }
}

async function getCelula(id_celula: number) {
    return Celulas[id_celula];
}

const Encontros: Encontro[] = [
    {
        id: 1,
        data: "2024-01-01",
        pregador: "Pastor 1",
        qtd_presentes: 10,
        qtd_visitantes: 10,
        oferta_arrecadada: 100,
    },
    {
        id: 2,
        data: "2024-01-02",
        pregador: "Pastor 2",
        qtd_presentes: 10,
        qtd_visitantes: 10,
        oferta_arrecadada: 100,
    }
]

const Membros: Membro[] = [
    {
        id: 1,
        nome: "Membro 1",
        telefone: "1234567890",
        email: "membro1@example.com",
        data_nascimento: "2024-01-01",
        endereco: "Endereço 1",
    },
    {
        id: 2,
        nome: "Membro 2",
        telefone: "1234567890",
        email: "membro2@example.com",
        data_nascimento: "2024-01-02",
        endereco: "Endereço 2",
    }
]




async function getEncontros(id_celula: number) {
    return Encontros;
}

async function getMembros(id_celula: number): Promise<Membro[]> {
    return Membros;
}

export default async function CelulaPage({ params }: { params: { id_celula: string } }) {
    const { id_celula } = await params;
    const celula = await getCelula(Number(id_celula));
    const encontros = await getEncontros(Number(id_celula));
    const membros = await getMembros(Number(id_celula));

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
                        <p>{celula.supervisor}</p>
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
