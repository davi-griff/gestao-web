import { DataTable } from "@/app/cultos/data-table";
import { Culto, columns } from "./columns";
import { PlusIcon } from "lucide-react";
import ButtonRedirect from "@/components/button-redirect";

async function getCultos(): Promise<Culto[]> {
    return [
        {
          id: 1,
          nome: "Culto 1",
          data: "2024-01-01",
          pastor: "Pastor 1",
        },
        {
          id: 2,
          nome: "Culto 2",
          data: "2024-01-02",
          pastor: "Pastor 2",
        },
        {
          id: 3,
          nome: "Culto 3",
          data: "2024-01-03",
          pastor: "Pastor 3",
        },
      ];
}   

export default async function CultosPage() {
    const cultos = await getCultos();
  return (
    <div>
      <div>
      <DataTable columns={columns} data={cultos} path="/cultos" />
      </div>

      <div className="flex justify-end mt-4">
        <ButtonRedirect href="/cultos/novo_culto">
          <PlusIcon className="w-4 h-4" />
          Novo Culto
        </ButtonRedirect>
      </div>
    </div>
  );
}

