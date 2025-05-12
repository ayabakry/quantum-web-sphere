
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
      
      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Last 7 days of admin actions</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start space-x-4 pb-4 border-b">
                <div className="flex-1">
                  <p className="text-sm font-medium">Uploaded "Quantum Error Correction"</p>
                  <p className="text-xs text-muted-foreground">John Doe • 2 days ago</p>
                </div>
              </li>
              <li className="flex items-start space-x-4 pb-4 border-b">
                <div className="flex-1">
                  <p className="text-sm font-medium">Updated patent "Quantum Circuit Optimization"</p>
                  <p className="text-xs text-muted-foreground">Alice Smith • 3 days ago</p>
                </div>
              </li>
              <li className="flex items-start space-x-4 pb-4 border-b">
                <div className="flex-1">
                  <p className="text-sm font-medium">Added new tutorial PDF "Quantum Algorithms"</p>
                  <p className="text-xs text-muted-foreground">Robert Johnson • 5 days ago</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <div className="flex-1">
                  <p className="text-sm font-medium">Deleted video "Introduction to Qubits"</p>
                  <p className="text-xs text-muted-foreground">Sarah Williams • 6 days ago</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Content Overview</CardTitle>
            <CardDescription>Content status and statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Videos</span>
                  <span className="text-sm text-muted-foreground">24/50</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-2 rounded-full bg-primary w-[48%]" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tutorials</span>
                  <span className="text-sm text-muted-foreground">48/100</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-2 rounded-full bg-primary w-[48%]" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Patents</span>
                  <span className="text-sm text-muted-foreground">16/25</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-2 rounded-full bg-primary w-[64%]" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Storage Used</span>
                  <span className="text-sm text-muted-foreground">1.2GB/5GB</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-2 rounded-full bg-primary w-[24%]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
