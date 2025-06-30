import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertDocumentSchema, type InsertDocument } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface NewDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const documentTypeOptions = [
  { value: "Petição", label: "Petição Inicial" },
  { value: "Contestação", label: "Contestação" },
  { value: "Decisão", label: "Decisão Judicial" },
  { value: "Sentença", label: "Sentença" },
  { value: "Recurso", label: "Recurso" },
  { value: "Procuração", label: "Procuração" },
  { value: "Contrato", label: "Contrato" },
  { value: "Certidão", label: "Certidão" },
  { value: "Laudo", label: "Laudo Técnico" },
  { value: "Outros", label: "Outros" },
];

export default function NewDocumentModal({ open, onOpenChange }: NewDocumentModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertDocument>({
    resolver: zodResolver(insertDocumentSchema),
    defaultValues: {
      caseId: 0,
      name: "",
      type: "",
      filePath: "",
    },
  });

  const { data: cases = [] } = useQuery<any[]>({
    queryKey: ["/api/cases"],
  });

  const createDocumentMutation = useMutation({
    mutationFn: async (data: InsertDocument) => {
      const response = await apiRequest("POST", "/api/documents", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Documento adicionado",
        description: "O documento foi adicionado com sucesso.",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o documento.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertDocument) => {
    createDocumentMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Documento</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="caseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Processo</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o processo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cases.map((case_) => (
                        <SelectItem key={case_.id} value={case_.id.toString()}>
                          {case_.processNumber} - {case_.client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Documento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Petição Inicial - João Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Documento</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {documentTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="filePath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arquivo</FormLabel>
                  <FormControl>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Simular upload - em produção, seria feito upload real
                            const fileName = `documents/${Date.now()}_${file.name}`;
                            field.onChange(fileName);
                            toast({
                              title: "Arquivo selecionado",
                              description: `${file.name} está pronto para upload.`,
                            });
                          }
                        }}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="text-gray-500">
                          <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm">
                            Clique para selecionar ou arraste um arquivo aqui
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            PDF, DOC, DOCX, JPG, PNG até 10MB
                          </p>
                        </div>
                      </label>
                      {field.value && (
                        <p className="text-sm text-green-600 mt-2">
                          Arquivo selecionado: {field.value.split('/').pop()}
                        </p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createDocumentMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createDocumentMutation.isPending}
                className="bg-legal-blue hover:bg-blue-700"
              >
                {createDocumentMutation.isPending ? "Adicionando..." : "Adicionar Documento"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}