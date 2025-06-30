import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProcessTable from "@/components/ProcessTable";
import NewCaseModal from "@/components/modals/NewCaseModal";

export default function Cases() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);

  const { data: cases, isLoading } = useQuery({
    queryKey: ["/api/cases", searchQuery],
    queryFn: async () => {
      const params = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : "";
      const response = await fetch(`/api/cases${params}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch cases");
      return response.json();
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Processos</h1>
          <p className="mt-1 text-sm text-gray-500">Gerencie todos os processos jurídicos</p>
        </div>
        <Button
          onClick={() => setShowNewCaseModal(true)}
          className="bg-legal-blue hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Processo
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar por número do processo, cliente ou partes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cases Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {searchQuery ? `Resultados da busca "${searchQuery}"` : "Todos os Processos"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ProcessTable cases={cases || []} isLoading={isLoading} />
        </CardContent>
      </Card>

      {/* New Case Modal */}
      <NewCaseModal open={showNewCaseModal} onOpenChange={setShowNewCaseModal} />
    </div>
  );
}
