import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Financial() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
          <p className="mt-1 text-sm text-gray-500">Controle de honorários, custas e valores</p>
        </div>
        <Button className="bg-legal-green hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Novo Lançamento
        </Button>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-legal-green" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Receitas</p>
                <p className="text-2xl font-bold text-gray-900">R$ 0,00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingDown className="h-8 w-8 text-legal-red" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Despesas</p>
                <p className="text-2xl font-bold text-gray-900">R$ 0,00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-legal-blue" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Saldo</p>
                <p className="text-2xl font-bold text-gray-900">R$ 0,00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Records placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Movimentações Financeiras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <DollarSign className="mx-auto h-12 w-12 mb-4" />
              <p>Funcionalidade financeira será implementada em breve</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
