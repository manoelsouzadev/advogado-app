import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";

export default function Calendar() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
        <p className="mt-1 text-sm text-gray-500">Visualize e gerencie seus compromissos e audiências</p>
      </div>

      {/* Calendar placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Calendário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <CalendarIcon className="mx-auto h-12 w-12 mb-4" />
              <p>Funcionalidade de calendário será implementada em breve</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
