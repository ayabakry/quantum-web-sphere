
import React from 'react';
import Logo from '../Logo';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  Video,
  FileText,
  Database,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Videos',
    href: '/admin/videos',
    icon: Video,
  },
  {
    title: 'Tutorials',
    href: '/admin/tutorials',
    icon: FileText,
  },
  {
    title: 'Patents',
    href: '/admin/patents',
    icon: Database,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

const AdminSidebar: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen border-r bg-sidebar w-64 flex flex-col">
      <div className="p-4 border-b">
        <Logo size="sm" />
        <div className="mt-2 text-xs text-sidebar-foreground/70">Admin Dashboard</div>
        {user && (
          <div className="mt-1 text-xs font-medium">Logged in as: {user.username}</div>
        )}
      </div>
      <div className="flex-1 py-4">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2 rounded-md text-sm font-medium',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )
              }
              end={item.href === '/admin'}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.title}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t">
        <NavLink
          to="/"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        >
          <Home className="mr-3 h-4 w-4" />
          Back to Website
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
