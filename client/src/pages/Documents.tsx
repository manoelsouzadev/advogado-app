import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Upload, 
  Search, 
  Download, 
  Trash2, 
  Eye,
  Filter,
  Plus
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Document, CaseWithClient } from "@shared/schema";
// import NewDocumentModal from "@/components/modals/NewDocumentModal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCase, setSelectedCase] = useState<string>("all");
  // const [showNewDocumentModal, setShowNewDocumentModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading: documentsLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const { data: cases = [] } = useQuery<CaseWithClient[]>({
    queryKey: ["/api/cases"],
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: number) => {
      await apiRequest("DELETE", `/api/documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Documento removido",
        description: "O documento foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover o documento.",
        variant: "destructive",
      });
    },
  });

  // Filtrar documentos baseado na busca e caso selecionado
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = searchQuery === "" || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCase = selectedCase === "all" || 
      doc.caseId.toString() === selectedCase;
    
    return matchesSearch && matchesCase;
  });

  const getDocumentTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "petição": return "bg-blue-100 text-blue-800";
      case "contestação": return "bg-red-100 text-red-800";
      case "decisão": return "bg-green-100 text-green-800";
      case "sentença": return "bg-purple-100 text-purple-800";
      case "recurso": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleDownload = (doc: Document) => {
    if (doc.filePath) {
      // Simular download - em produção, seria um link real para o arquivo
      toast({
        title: "Download iniciado",
        description: `Baixando ${doc.name}...`,
      });
    } else {
      toast({
        title: "Arquivo não encontrado",
        description: "O arquivo não está disponível para download.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentos</h1>
          <p className="mt-1 text-sm text-gray-500">Gerencie documentos e anexos dos processos</p>
        </div>
        <Button 
          onClick={() => {
            toast({
              title: "Funcionalidade em desenvolvimento",
              description: "O upload de documentos será implementado em breve.",
            });
          }}
          className="bg-legal-blue hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Documento
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar documentos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Case Filter */}
            <Select value={selectedCase} onValueChange={setSelectedCase}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por processo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os processos</SelectItem>
                {cases.map((case_) => (
                  <SelectItem key={case_.id} value={case_.id.toString()}>
                    {case_.processNumber} - {case_.client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Results count */}
            <div className="flex items-center text-sm text-gray-500">
              <Filter className="mr-2 h-4 w-4" />
              {filteredDocuments.length} documento(s) encontrado(s)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          {documentsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <FileText className="mx-auto h-12 w-12 mb-4" />
                <p className="text-lg font-medium">Nenhum documento encontrado</p>
                <p className="text-sm">
                  {searchQuery || selectedCase !== "all" 
                    ? "Tente ajustar os filtros de busca" 
                    : "Comece adicionando um documento ao sistema"}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocuments.map((doc) => {
                const caseData = cases.find(c => c.id === doc.caseId);
                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <FileText className="h-10 w-10 text-legal-blue" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {doc.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getDocumentTypeColor(doc.type)}>
                            {doc.type}
                          </Badge>
                          {caseData && (
                            <span className="text-xs text-gray-500">
                              {caseData.processNumber}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Adicionado em {format(new Date(doc.uploadedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(doc)}
                        className="text-legal-blue hover:text-blue-700"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteDocumentMutation.mutate(doc.id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={deleteDocumentMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal temporariamente removido - será implementado em breve */}
    </div>
  );
}
