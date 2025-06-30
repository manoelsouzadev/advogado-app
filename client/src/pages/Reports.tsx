import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Reports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          <p className="mt-1 text-sm text-gray-500">Análises e relatórios dos seus processos</p>
        </div>
        <Button className="bg-legal-blue hover:bg-blue-700">
          <FileText className="mr-2 h-4 w-4" />
          Gerar Relatório
        </Button>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart className="h-8 w-8 text-legal-blue" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium text-gray-900">Processos por Status</h3>
                <p className="text-sm text-gray-500">Relatório de distribuição de processos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-legal-green" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium text-gray-900">Produtividade</h3>
                <p className="text-sm text-gray-500">Análise de produtividade mensal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-legal-orange" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium text-gray-900">Prazos</h3>
                <p className="text-sm text-gray-500">Relatório de prazos e deadlines</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Gerados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <BarChart className="mx-auto h-12 w-12 mb-4" />
              <p>Funcionalidade de relatórios será implementada em breve</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
