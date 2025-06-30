import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  FolderOpen, 
  Calendar, 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: BarChart3,
  },
  {
    name: "Processos",
    href: "/cases",
    icon: FolderOpen,
  },
  {
    name: "Agenda",
    href: "/calendar",
    icon: Calendar,
  },
  {
    name: "Clientes",
    href: "/clients",
    icon: Users,
  },
  {
    name: "Documentos",
    href: "/documents",
    icon: FileText,
  },
  {
    name: "Financeiro",
    href: "/financial",
    icon: DollarSign,
  },
  {
    name: "Relatórios",
    href: "/reports",
    icon: TrendingUp,
  },
  {
    name: "Configurações",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 flex-shrink-0">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <a
                    className={cn(
                      "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "text-legal-blue bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
