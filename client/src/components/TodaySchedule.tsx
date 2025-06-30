import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Gavel, Users } from "lucide-react";
import { type Hearing } from "@shared/schema";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TodayScheduleProps {
  hearings: Hearing[];
  isLoading?: boolean;
}

export default function TodaySchedule({ hearings, isLoading }: TodayScheduleProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "conciliation":
        return <Users className="text-white text-sm" />;
      default:
        return <Gavel className="text-white text-sm" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "conciliation":
        return "bg-legal-blue";
      case "instruction":
        return "bg-legal-green";
      default:
        return "bg-legal-orange";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-start space-x-3">
            <Skeleton className="w-12 h-12 rounded-lg" />
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

  if (hearings.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        Nenhuma audiência hoje
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hearings.map((hearing) => (
        <div key={hearing.id} className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(hearing.type)}`}>
              {getTypeIcon(hearing.type)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{hearing.title}</p>
            <p className="text-sm text-gray-500">
              {format(new Date(hearing.date), "HH:mm", { locale: ptBR })}
            </p>
            {hearing.location && (
              <p className="text-xs text-gray-400">{hearing.location}</p>
            )}
          </div>
        </div>
      ))}
      <div className="pt-4 border-t border-gray-200">
        <Button variant="ghost" className="w-full text-legal-blue hover:text-blue-700">
          Ver agenda completa
        </Button>
      </div>
    </div>
  );
}
