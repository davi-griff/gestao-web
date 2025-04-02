import { TableView } from "@/components/table-view";
import { Culto } from "@/types/culto";

const cultos: Culto[] = [
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

const columns = ["Nome", "Data", "Pastor"];

export default function CultosPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <TableView columns={columns} data={cultos} />
    </div>
  );
}

