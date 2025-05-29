
import React from 'react';
import AdminLayout from './AdminLayout';
import DashboardCard from '@/components/admin/DashboardCard';
import { Video, FileText, Database, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { toast } = useToast();

  const handleRefresh = () => {
    toast({
      title: "Dashboard refreshed",
      description: "Latest data has been loaded",
    });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleRefresh}>Refresh Data</Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Videos"
          value="24"
          description="Videos in database"
          icon={<Video />}
          trend={{ value: 12, isPositive: true }}
        />
        <DashboardCard
          title="Tutorial Documents"
          value="48"
          description="PDF and PPT files"
          icon={<FileText />}
          trend={{ value: 8, isPositive: true }}
        />
        <DashboardCard
          title="Patents"
          value="16"
          description="Registered patents"
          icon={<Database />}
          trend={{ value: 5, isPositive: true }}
        />
        <DashboardCard
          title="Contact Inquiries"
          value="32"
          description="New messages"
          icon={<MessageSquare />}
          trend={{ value: 3, isPositive: false }}
        />
      </div>
      
    
    </AdminLayout>
  );
};

export default Dashboard;
