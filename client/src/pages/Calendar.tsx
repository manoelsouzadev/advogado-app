import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, MapPin, Plus } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Hearing } from "@shared/schema";
import NewEventModal from "@/components/modals/NewEventModal";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showNewEventModal, setShowNewEventModal] = useState(false);

  const { data: hearings = [], isLoading } = useQuery<Hearing[]>({
    queryKey: ["/api/hearings"],
    staleTime: 0,
    refetchOnMount: true,
  });

  // Filtrar audiências para a data selecionada
  const selectedDateHearings = hearings.filter((hearing: Hearing) => {
    const hearingDate = new Date(hearing.date);
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth();
    const selectedDay = selectedDate.getDate();
    
    const hearingYear = hearingDate.getFullYear();
    const hearingMonth = hearingDate.getMonth();
    const hearingDay = hearingDate.getDate();
    
    return selectedYear === hearingYear && 
           selectedMonth === hearingMonth && 
           selectedDay === hearingDay;
  });

  // Datas que têm audiências (para destacar no calendário)
  const datesWithHearings = hearings.map((hearing: Hearing) => {
    const hearingDate = new Date(hearing.date);
    // Normalizar para apenas a data (sem horário)
    return new Date(hearingDate.getFullYear(), hearingDate.getMonth(), hearingDate.getDate());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
          <p className="mt-1 text-sm text-gray-500">Visualize e gerencie seus compromissos e audiências</p>
        </div>
        <Button onClick={() => setShowNewEventModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Audiência
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              Calendário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={ptBR}
              className="rounded-md border"
              modifiers={{
                hasEvents: datesWithHearings,
              }}
              modifiersStyles={{
                hasEvents: {
                  backgroundColor: 'hsl(207, 75%, 42%)',
                  color: 'white',
                  fontWeight: 'bold',
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Events for selected date */}
        <Card>
          <CardHeader>
            <CardTitle>
              {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded"></div>
                  </div>
                ))}
              </div>
            ) : selectedDateHearings.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <CalendarIcon className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>Nenhuma audiência agendada para esta data</p>
                <p className="text-xs mt-2">Total de audiências: {hearings.length}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateHearings.map((hearing: Hearing) => (
                  <div
                    key={hearing.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{hearing.title}</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="mr-1 h-3 w-3" />
                          {format(new Date(hearing.date), "HH:mm")}
                        </div>
                        {hearing.location && (
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <MapPin className="mr-1 h-3 w-3" />
                            {hearing.location}
                          </div>
                        )}
                        {hearing.notes && (
                          <p className="text-xs text-gray-600 mt-2">
                            {hearing.notes}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {hearing.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <NewEventModal
        open={showNewEventModal}
        onOpenChange={setShowNewEventModal}
      />
    </div>
  );
}
