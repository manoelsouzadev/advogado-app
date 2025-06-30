import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, FileText, TrendingUp, PieChart, Calendar, DollarSign, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  LineChart,
  Line
} from "recharts";
import type { CaseWithClient } from "@shared/schema";

const COLORS = ['hsl(207, 75%, 42%)', 'hsl(122, 39%, 35%)', 'hsl(35, 100%, 47%)', 'hsl(354, 64%, 46%)'];

export default function Reports() {
  const { data: cases = [] } = useQuery<CaseWithClient[]>({
    queryKey: ["/api/cases"],
  });

  const { data: stats } = useQuery<{
    activeProcesses: string;
    upcomingDeadlines: string;
    todayHearings: string;
    pendingFees: string;
  }>({
    queryKey: ["/api/dashboard/stats"],
  });

  // Dados para gráfico de status
  const statusData = [
    { name: 'Em Andamento', value: cases.filter(c => c.status === 'ongoing').length },
    { name: 'Concluído', value: cases.filter(c => c.status === 'completed').length },
    { name: 'Suspenso', value: cases.filter(c => c.status === 'suspended').length },
    { name: 'Arquivado', value: cases.filter(c => c.status === 'archived').length }
  ].filter(item => item.value > 0);

  // Dados para gráfico de tribunais
  const courtData = cases.reduce((acc: any[], caseItem) => {
    const existingCourt = acc.find(item => item.court === caseItem.court);
    if (existingCourt) {
      existingCourt.count += 1;
    } else {
      acc.push({ court: caseItem.court || 'Não definido', count: 1 });
    }
    return acc;
  }, []);

  // Dados para gráfico de tipos de ação
  const actionTypeData = cases.reduce((acc: any[], caseItem) => {
    const existingType = acc.find(item => item.type === caseItem.actionType);
    if (existingType) {
      existingType.count += 1;
    } else {
      acc.push({ type: caseItem.actionType || 'Não definido', count: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          <p className="mt-1 text-sm text-gray-500">Análises e relatórios dos seus processos</p>
        </div>
        <Button 
          className="bg-legal-blue hover:bg-blue-700"
          onClick={() => window.print()}
        >
          <FileText className="mr-2 h-4 w-4" />
          Imprimir Relatório
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Folder className="h-8 w-8 text-legal-blue" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Processos</p>
                <p className="text-2xl font-bold text-gray-900">{cases.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-legal-green" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-gray-900">
                  {cases.filter(c => c.status === 'ongoing').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-legal-orange" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Prazos Próximos</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.upcomingDeadlines || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-legal-red" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valores Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.pendingFees || 'R$ 0'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Distribuição por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Court Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5" />
              Processos por Tribunal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={courtData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="court" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(207, 75%, 42%)" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Action Types Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Tipos de Ação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={actionTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(122, 39%, 35%)" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
