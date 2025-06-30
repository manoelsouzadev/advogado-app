import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Bell, 
  Shield, 
  Building, 
  Save, 
  Upload,
  Mail,
  Phone,
  MapPin,
  FileText,
  Clock,
  Globe
} from "lucide-react";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  oab: z.string().optional(),
  specialty: z.string().optional(),
  bio: z.string().optional(),
});

const firmSchema = z.object({
  name: z.string().min(2, "Nome do escritório é obrigatório"),
  cnpj: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  website: z.string().optional(),
});

const notificationSchema = z.object({
  emailDeadlines: z.boolean(),
  emailHearings: z.boolean(),
  emailProcessUpdates: z.boolean(),
  pushDeadlines: z.boolean(),
  pushHearings: z.boolean(),
  reminderHours: z.string(),
});

const systemSchema = z.object({
  timezone: z.string(),
  dateFormat: z.string(),
  currency: z.string(),
  language: z.string(),
  theme: z.string(),
});

export default function Settings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "Dr. João Silva",
      email: "joao.silva@advogado.com",
      phone: "(11) 99999-9999",
      oab: "SP 123456",
      specialty: "Direito Trabalhista",
      bio: "",
    },
  });

  const firmForm = useForm<z.infer<typeof firmSchema>>({
    resolver: zodResolver(firmSchema),
    defaultValues: {
      name: "Silva & Associados Advocacia",
      cnpj: "12.345.678/0001-90",
      address: "Av. Paulista, 1000 - São Paulo, SP",
      phone: "(11) 3000-0000",
      email: "contato@silvaadvocacia.com.br",
      website: "www.silvaadvocacia.com.br",
    },
  });

  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailDeadlines: true,
      emailHearings: true,
      emailProcessUpdates: false,
      pushDeadlines: true,
      pushHearings: true,
      reminderHours: "24",
    },
  });

  const systemForm = useForm<z.infer<typeof systemSchema>>({
    resolver: zodResolver(systemSchema),
    defaultValues: {
      timezone: "America/Sao_Paulo",
      dateFormat: "dd/MM/yyyy",
      currency: "BRL",
      language: "pt-BR",
      theme: "light",
    },
  });

  const onSubmitProfile = (data: z.infer<typeof profileSchema>) => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações pessoais foram atualizadas com sucesso.",
    });
  };

  const onSubmitFirm = (data: z.infer<typeof firmSchema>) => {
    toast({
      title: "Escritório atualizado",
      description: "As informações do escritório foram atualizadas com sucesso.",
    });
  };

  const onSubmitNotifications = (data: z.infer<typeof notificationSchema>) => {
    toast({
      title: "Notificações atualizadas",
      description: "Suas preferências de notificação foram salvas com sucesso.",
    });
  };

  const onSubmitSystem = (data: z.infer<typeof systemSchema>) => {
    toast({
      title: "Sistema atualizado",
      description: "As configurações do sistema foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="mt-1 text-sm text-gray-500">Gerencie suas preferências e configurações do sistema</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="firm" className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span>Escritório</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Sistema</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Alterar Foto
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">JPG, GIF ou PNG. Máximo 1MB.</p>
                </div>
              </div>

              <Separator />

              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="oab"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OAB</FormLabel>
                          <FormControl>
                            <Input placeholder="SP 123456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área de Especialização</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione sua especialização" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Direito Civil">Direito Civil</SelectItem>
                            <SelectItem value="Direito Criminal">Direito Criminal</SelectItem>
                            <SelectItem value="Direito Trabalhista">Direito Trabalhista</SelectItem>
                            <SelectItem value="Direito Tributário">Direito Tributário</SelectItem>
                            <SelectItem value="Direito Empresarial">Direito Empresarial</SelectItem>
                            <SelectItem value="Direito de Família">Direito de Família</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biografia</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva sua experiência profissional..."
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="bg-legal-blue hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Firm Settings */}
        <TabsContent value="firm">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Escritório</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...firmForm}>
                <form onSubmit={firmForm.handleSubmit(onSubmitFirm)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={firmForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Escritório</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={firmForm.control}
                      name="cnpj"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CNPJ</FormLabel>
                          <FormControl>
                            <Input placeholder="00.000.000/0000-00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={firmForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={firmForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={firmForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Endereço completo do escritório"
                            rows={2}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={firmForm.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="www.exemplo.com.br" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="bg-legal-blue hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onSubmitNotifications)} className="space-y-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Notificações por Email</h3>
                      <div className="space-y-4">
                        <FormField
                          control={notificationForm.control}
                          name="emailDeadlines"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel>Prazos Vencendo</FormLabel>
                                <FormDescription>
                                  Receba emails quando prazos estiverem próximos do vencimento
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={notificationForm.control}
                          name="emailHearings"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel>Audiências</FormLabel>
                                <FormDescription>
                                  Receba lembretes de audiências por email
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={notificationForm.control}
                          name="emailProcessUpdates"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel>Atualizações de Processos</FormLabel>
                                <FormDescription>
                                  Receba emails sobre novas movimentações processuais
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Notificações Push</h3>
                      <div className="space-y-4">
                        <FormField
                          control={notificationForm.control}
                          name="pushDeadlines"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel>Prazos Vencendo</FormLabel>
                                <FormDescription>
                                  Receba notificações push sobre prazos
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={notificationForm.control}
                          name="pushHearings"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel>Audiências</FormLabel>
                                <FormDescription>
                                  Receba notificações push sobre audiências
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <FormField
                      control={notificationForm.control}
                      name="reminderHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Antecedência dos Lembretes</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1 hora antes</SelectItem>
                              <SelectItem value="6">6 horas antes</SelectItem>
                              <SelectItem value="12">12 horas antes</SelectItem>
                              <SelectItem value="24">1 dia antes</SelectItem>
                              <SelectItem value="48">2 dias antes</SelectItem>
                              <SelectItem value="168">1 semana antes</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Quando você quer ser lembrado sobre prazos e audiências
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="bg-legal-blue hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Preferências
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...systemForm}>
                <form onSubmit={systemForm.handleSubmit(onSubmitSystem)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={systemForm.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fuso Horário</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                              <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                              <SelectItem value="America/Rio_Branco">Rio Branco (GMT-5)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={systemForm.control}
                      name="dateFormat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Formato de Data</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                              <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                              <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={systemForm.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Moeda</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                              <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                              <SelectItem value="EUR">Euro (€)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={systemForm.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Idioma</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                              <SelectItem value="en-US">English (US)</SelectItem>
                              <SelectItem value="es-ES">Español</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={systemForm.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tema</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="light">Claro</SelectItem>
                            <SelectItem value="dark">Escuro</SelectItem>
                            <SelectItem value="system">Sistema</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Escolha o tema da interface do sistema
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Informações do Sistema</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Versão</Badge>
                        <span className="text-sm text-gray-600">1.0.0</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Última Atualização</Badge>
                        <span className="text-sm text-gray-600">30/06/2025</span>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="bg-legal-blue hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Configurações
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
