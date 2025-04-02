import { Culto } from "@/types/culto";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  

interface TableViewProps {
  columns: string[];
  data: Culto[] | undefined;
}

export function TableView({ columns, data }: TableViewProps) {
  return (
    <div>
      <Table>
        <TableCaption>Lista de Cultos</TableCaption>
        <TableHeader>
          {columns.map((column) => (
            <TableHead key={column}>{column}</TableHead>
          ))}
        </TableHeader>
        <TableBody>
          {data?.map((item) => (
            <TableRow key={item.id}>
              {columns.map((column) => (
                <TableCell key={column}>{item[column.toLowerCase() as keyof Culto]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
