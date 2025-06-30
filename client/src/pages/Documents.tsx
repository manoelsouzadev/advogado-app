import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Documents() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentos</h1>
          <p className="mt-1 text-sm text-gray-500">Gerencie documentos e anexos dos processos</p>
        </div>
        <Button className="bg-legal-blue hover:bg-blue-700">
          <Upload className="mr-2 h-4 w-4" />
          Upload Documento
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar documentos..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Documents placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <FileText className="mx-auto h-12 w-12 mb-4" />
              <p>Funcionalidade de documentos será implementada em breve</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
