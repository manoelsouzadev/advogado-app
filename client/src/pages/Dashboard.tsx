import { useQuery } from "@tanstack/react-query";
import { Folder, Clock, Calendar, DollarSign, Plus, UserPlus, CalendarPlus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "@/components/StatsCard";
import ProcessTable from "@/components/ProcessTable";
import DeadlinesList from "@/components/DeadlinesList";
import TodaySchedule from "@/components/TodaySchedule";
import NewCaseModal from "@/components/modals/NewCaseModal";
import NewClientModal from "@/components/modals/NewClientModal";
import NewEventModal from "@/components/modals/NewEventModal";
import { useState } from "react";

export default function Dashboard() {
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showNewEventModal, setShowNewEventModal] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: cases, isLoading: casesLoading } = useQuery({
    queryKey: ["/api/cases"],
  });

  const { data: upcomingDeadlines, isLoading: deadlinesLoading } = useQuery({
    queryKey: ["/api/activities/upcoming"],
  });

  const { data: todayHearings, isLoading: hearingsLoading } = useQuery({
    queryKey: ["/api/hearings/today"],
  });

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(num);
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Visão geral dos seus processos e atividades</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Processos Ativos"
          value={statsLoading ? "..." : stats?.activeProcesses || 0}
          icon={Folder}
          color="text-legal-blue"
        />
        <StatsCard
          title="Prazos Próximos"
          value={statsLoading ? "..." : stats?.upcomingDeadlines || 0}
          icon={Clock}
          color="text-legal-orange"
        />
        <StatsCard
          title="Audiências Hoje"
          value={statsLoading ? "..." : stats?.todayHearings || 0}
          icon={Calendar}
          color="text-legal-green"
        />
        <StatsCard
          title="Honorários Pendentes"
          value={statsLoading ? "..." : formatCurrency(stats?.pendingFees || "0")}
          icon={DollarSign}
          color="text-legal-dark"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Processes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Processos Recentes</CardTitle>
                <Button variant="ghost" className="text-legal-blue hover:text-blue-700">
                  Ver todos
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ProcessTable cases={cases?.slice(0, 5) || []} isLoading={casesLoading} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Prazos Próximos</CardTitle>
            </CardHeader>
            <CardContent>
              <DeadlinesList deadlines={upcomingDeadlines || []} isLoading={deadlinesLoading} />
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Agenda de Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <TodaySchedule hearings={todayHearings || []} isLoading={hearingsLoading} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-center px-4 py-3 h-auto"
              onClick={() => setShowNewCaseModal(true)}
            >
              <Plus className="mr-2 h-4 w-4 text-legal-blue" />
              Novo Processo
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center px-4 py-3 h-auto"
              onClick={() => setShowNewClientModal(true)}
            >
              <UserPlus className="mr-2 h-4 w-4 text-legal-green" />
              Novo Cliente
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center px-4 py-3 h-auto"
              onClick={() => setShowNewEventModal(true)}
            >
              <CalendarPlus className="mr-2 h-4 w-4 text-legal-orange" />
              Nova Audiência
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center px-4 py-3 h-auto"
            >
              <FileText className="mr-2 h-4 w-4 text-legal-dark" />
              Gerar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <NewCaseModal open={showNewCaseModal} onOpenChange={setShowNewCaseModal} />
      <NewClientModal open={showNewClientModal} onOpenChange={setShowNewClientModal} />
      <NewEventModal open={showNewEventModal} onOpenChange={setShowNewEventModal} />
    </div>
  );
}
