
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import QuantumVisualizer from '@/components/home/QuantumVisualizer';
import RecentUpdates from '@/components/home/RecentUpdates';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Video, FileText, Database } from 'lucide-react';

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="quantum-bg-gradient py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                Quantum Research and Analysis Management
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-white/80">
                Advancing quantum science through collaborative research, comprehensive analysis, and knowledge sharing.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link to="https://q1ram-demo.streamlit.app/" target='_blank'>Upload File</Link>
              </Button>
             
            </div>
          </div>
        </div>
      </section>

     

    
      {/* Features */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="bg-primary/10 p-4 rounded-full">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Video Library</h3>
              <p className="text-muted-foreground">
                Access a comprehensive collection of quantum computing lectures and tutorials.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="bg-primary/10 p-4 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Tutorial Documents</h3>
              <p className="text-muted-foreground">
                Download PDF and PPT resources for in-depth learning and research.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="bg-primary/10 p-4 rounded-full">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Patent Database</h3>
              <p className="text-muted-foreground">
                Explore our collection of quantum computing patents and innovations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
