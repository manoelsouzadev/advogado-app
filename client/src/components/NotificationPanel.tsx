import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NotificationPanelProps {
  onClose: () => void;
}

// Mock notifications for now
const notifications = [
  {
    id: 1,
    title: "Prazo vencendo em 1 dia",
    description: "Contestação do processo 5003257-81.2023 vence amanhã",
    time: "Há 2 horas",
    priority: "high",
  },
  {
    id: 2,
    title: "Nova movimentação processual",
    description: "Processo 1001234-56.2023 teve novo andamento",
    time: "Há 4 horas",
    priority: "medium",
  },
  {
    id: 3,
    title: "Lembrete de audiência",
    description: "Audiência de conciliação às 14:30 hoje",
    time: "Há 1 dia",
    priority: "low",
  },
];

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-legal-red";
      case "medium":
        return "bg-legal-orange";
      default:
        return "bg-legal-green";
    }
  };

  return (
    <div
      ref={panelRef}
      className="fixed top-16 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-40"
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Notificações</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto p-0">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className={`w-2 h-2 rounded-full mt-2 ${getPriorityColor(notification.priority)}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                <p className="text-sm text-gray-500">{notification.description}</p>
                <p className="text-xs text-gray-400">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full text-legal-blue hover:text-blue-700"
          onClick={onClose}
        >
          Ver todas as notificações
        </Button>
      </div>
    </div>
  );
}
