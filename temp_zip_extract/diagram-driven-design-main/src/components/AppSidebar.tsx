
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Target, LayoutList, FileText, ShieldCheck, SlidersHorizontal, Upload, GitFork, Bot } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Target Selection', icon: Target },
  { path: '/assessment', label: 'Assessment Report', icon: LayoutList },
  { path: '/report', label: 'Generate Report', icon: FileText },
  { path: '/scan-status', label: 'Scan Status', icon: ShieldCheck },
  { path: '/scoring', label: 'Adjust Scoring', icon: SlidersHorizontal },
  { path: '/upload', label: 'Upload Results', icon: Upload },
  { path: '/flow', label: 'Process Flow', icon: GitFork },
];

export function AppSidebar() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const target = searchParams.get('target');

  const getNavUrl = (path: string) => {
    if (!target || path === '/') return path;
    return `${path}?target=${encodeURIComponent(target)}`;
  };
  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
            <Bot className="size-6 text-primary" />
            <span className="text-lg font-semibold">CyCOPS</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.path}
              >
                <NavLink to={getNavUrl(item.path)}>
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
