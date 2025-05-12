
import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Toaster } from '@/components/ui/toaster';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <div className="p-6">{children}</div>
      </div>
      <Toaster />
    </div>
  );
};

export default AdminLayout;
