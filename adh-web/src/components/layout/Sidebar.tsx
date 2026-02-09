import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  ArrowLeftRight,
  Shield,
  Receipt,
  CreditCard,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Tableau de bord', path: '/caisse' },
  { icon: ShoppingCart, label: 'Vente', path: '/caisse/vente' },
  { icon: FileText, label: 'Extrait compte', path: '/caisse/extrait' },
  { icon: ArrowLeftRight, label: 'Change', path: '/caisse/change' },
  { icon: Shield, label: 'Garantie', path: '/caisse/garantie' },
  { icon: Receipt, label: 'Factures', path: '/caisse/factures' },
  { icon: CreditCard, label: 'Club Med Pass', path: '/caisse/pass' },
];

export function Sidebar({ isOpen }: SidebarProps) {
  return (
    <aside
      className={cn(
        'bg-surface-dim border-r border-border transition-all duration-200 overflow-hidden',
        isOpen ? 'w-56' : 'w-0'
      )}
    >
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-on-surface hover:bg-surface-bright transition-colors"
          >
            <item.icon className="w-4 h-4 text-on-surface-muted" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
