
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type QuantumState = {
  id: number;
  probability: number;
  state: string;
  energy: number;
};

const QuantumVisualizer: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [quantumData, setQuantumData] = useState<QuantumState[]>([]);
  
  useEffect(() => {
    // Simulate loading quantum data
    const timer = setTimeout(() => {
      const mockData = [
        { id: 1, probability: 0.35, state: '|00⟩', energy: -5.2 },
        { id: 2, probability: 0.25, state: '|01⟩', energy: -3.1 },
        { id: 3, probability: 0.15, state: '|10⟩', energy: -2.4 },
        { id: 4, probability: 0.25, state: '|11⟩', energy: -4.7 },
      ];
      
      setQuantumData(mockData);
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Quantum State Analyzer</CardTitle>
          <CardDescription>Loading quantum state data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="h-4 w-1/4 bg-muted rounded"></div>
                <div className="h-6 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quantum State Analyzer</CardTitle>
        <CardDescription>Current quantum state probabilities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {quantumData.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-lg">{item.state}</span>
                <span className="text-muted-foreground">{(item.probability * 100).toFixed(1)}%</span>
              </div>
              <Progress value={item.probability * 100} className="h-2" />
              <div className="text-xs text-muted-foreground">
                Energy level: {item.energy} eV
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuantumVisualizer;
