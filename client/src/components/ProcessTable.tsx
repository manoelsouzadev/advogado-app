import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type CaseWithClient } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProcessTableProps {
  cases: CaseWithClient[];
  isLoading?: boolean;
}

export default function ProcessTable({ cases, isLoading }: ProcessTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ongoing":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Em Andamento</Badge>;
      case "completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Concluído</Badge>;
      case "suspended":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Suspenso</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 p-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        Nenhum processo encontrado
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Processo</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Última Atualização</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map((case_) => (
            <TableRow key={case_.id} className="hover:bg-gray-50 cursor-pointer">
              <TableCell>
                <div>
                  <div className="text-sm font-medium text-gray-900">{case_.processNumber}</div>
                  <div className="text-sm text-gray-500">{case_.court}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-900">{case_.client.name}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-900">{case_.actionType}</div>
              </TableCell>
              <TableCell>
                {getStatusBadge(case_.status)}
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(case_.updatedAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
