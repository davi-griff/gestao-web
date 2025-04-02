import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import ChartPessoasCulto from "@/components/chart-pessoas-culto";


type CultoData = {
    id: number;
    nome: string;
    data: string;
    pastor: string;
    qtd_jovens: number;
    qtd_adultos: number;
    qtd_criancas: number;
    qtd_visitantes: number;
    qtd_batismo: number;
    qtd_conversao: number;
}

const cultos: Record<number, CultoData> = {
    1: {
        id: 1,
        nome: "Culto 1",
        data: "2024-01-01",
        pastor: "Pastor 1",
        qtd_jovens: 10,
        qtd_adultos: 20,
        qtd_criancas: 30,
        qtd_visitantes: 60,
        qtd_batismo: 10,
        qtd_conversao: 5,
    },
    2: {
        id: 2,
        nome: "Culto 2",
        data: "2024-01-02",
        pastor: "Pastor 2",
        qtd_jovens: 10,
        qtd_adultos: 20,
        qtd_criancas: 30,
        qtd_visitantes: 60,
        qtd_batismo: 10,
        qtd_conversao: 5,
    },
}

async function getCulto(id_culto: number) {
    return cultos[id_culto];
}

export default async function Page({ params }: { params: { id_culto: string } }) {
    const { id_culto } = await params;
    const culto = await getCulto(parseInt(id_culto));

    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Detalhes do culto do dia {culto.data}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Pastor responsável</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{culto.pastor}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
              </CardFooter>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle>Quantidade de jovens</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{culto.qtd_jovens}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
              </CardFooter>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle>Quantidade de adultos</CardTitle>
              </CardHeader>
              <CardContent>
                  <p>{culto.qtd_adultos}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
              </CardFooter>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle>Quantidade de crianças</CardTitle>
              </CardHeader>
              <CardContent>
                  <p>{culto.qtd_criancas}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
              </CardFooter>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle>Quantidade de visitantes</CardTitle>
              </CardHeader>
              <CardContent>
                  <p>{culto.qtd_visitantes}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
              </CardFooter>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle>Quantidade de batismos</CardTitle>
              </CardHeader>
              <CardContent>
                  <p>{culto.qtd_batismo}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
              </CardFooter>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle>Quantidade de conversões</CardTitle>
              </CardHeader>
              <CardContent>
                  <p>{culto.qtd_conversao}</p>
              </CardContent>
            </Card>
        </div>

        <div className="col-span-4">
          <ChartPessoasCulto />
        </div>
    </div>
    )
  }