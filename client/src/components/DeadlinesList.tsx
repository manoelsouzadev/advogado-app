import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { type Activity } from "@shared/schema";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DeadlinesListProps {
  deadlines: Activity[];
  isLoading?: boolean;
}

export default function DeadlinesList({ deadlines, isLoading }: DeadlinesListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-legal-red";
      case "high":
        return "bg-legal-orange";
      case "medium":
        return "bg-yellow-400";
      default:
        return "bg-legal-green";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start space-x-3">
            <Skeleton className="w-2 h-2 rounded-full mt-2" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (deadlines.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        Nenhum prazo próximo
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {deadlines.map((deadline) => (
        <div key={deadline.id} className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
          <div className="flex-shrink-0">
            <div className={`w-2 h-2 rounded-full mt-2 ${getPriorityColor(deadline.priority)}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
            <p className="text-sm text-gray-500">
              {deadline.dueDate && format(new Date(deadline.dueDate), "dd/MM/yyyy", { locale: ptBR })}
              {deadline.dueDate && ` - ${formatDistanceToNow(new Date(deadline.dueDate), {
                addSuffix: true,
                locale: ptBR,
              })}`}
            </p>
            {deadline.description && (
              <p className="text-xs text-gray-400 truncate">{deadline.description}</p>
            )}
          </div>
        </div>
      ))}
      <div className="pt-4 border-t border-gray-200">
        <Button variant="ghost" className="w-full text-legal-blue hover:text-blue-700">
          Ver todos os prazos
        </Button>
      </div>
    </div>
  );
}
