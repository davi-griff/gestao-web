import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Aluno, columns } from "./columns-alunos";
import { Turma } from "../columns";
import { DataTable } from "@/components/data-table";
import ButtonRedirect from "@/components/button-redirect";
import { Plus, PlusIcon } from "lucide-react";
import { Aula, columns as columnsAulas } from "./columns-aulas";

const Aulas: Aula[] = [
    {
        id: 1,
        data: "2025-01-01",
        descricao: "Aula 1",
        professor: "Pastora Ire",
        qtd_presentes: 10,
    },
    {
        id: 2,
        data: "2025-01-02",
        descricao: "Aula 2",
        professor: "Pastora Ire",
        qtd_presentes: 10,
    }
]

const Alunos: Aluno[] = [
    {
        id: 1,
        nome: "Aluno 1",
        telefone: "1234567890",
    },
    {
        id: 2,
        nome: "Aluno 2",
        telefone: "1234567890",
    }
]

const turma: Turma = {
    id: 1,
    nome: "Panorama Bíblico",
    descricao: "Panorama Bíblico",
    periodo: "1 semestre 2025",
    data_inicio: "2025-01-01",
    data_fim: "2025-06-30",
}

async function getAlunos(id_turma: number) {
    return Alunos;
}

async function getTurma(id_turma: number) {
    return turma;
}

async function getAulas(id_turma: number) {
    return Aulas;
}

export default async function TurmaPage({ params }: { params: { id_turma: string } }) {
    const { id_turma } = await params;
    const alunos = await getAlunos(Number(id_turma));
    const turma = await getTurma(Number(id_turma));
    const aulas = await getAulas(Number(id_turma));

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Detalhes da turma {turma.nome}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Nome</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{turma.nome}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Descrição</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{turma.descricao}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Período</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{turma.periodo}</p>
                    </CardContent>
                </Card> 
                <Card>
                    <CardHeader>
                        <CardTitle>Data de Início</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{turma.data_inicio}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Data de Fim</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{turma.data_fim}</p>
                    </CardContent>
                </Card>
            </div>
            


            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Alunos</h2>
                <DataTable columns={columns} data={alunos} path="/escola_biblica/turmas" />
                <div className="flex justify-end mt-4">
                    <ButtonRedirect href={`/escola_biblica/turmas/${id_turma}/novo_aluno`}>
                        <PlusIcon className="w-4 h-4" />
                        Novo Aluno
                    </ButtonRedirect>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Aulas</h2>
                <DataTable columns={columnsAulas} data={aulas} path="/escola_biblica/turmas" />
                <div className="flex justify-end mt-4">
                    <ButtonRedirect href={`/escola_biblica/turmas/${id_turma}/nova_aula`}>
                        <PlusIcon className="w-4 h-4" />
                        Nova Aula
                    </ButtonRedirect>
                </div>
            </div>
        </div>
    )
}