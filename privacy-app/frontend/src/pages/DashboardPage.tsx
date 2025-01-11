import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DataClassificationResult, DSARRequest } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

export const DashboardPage: React.FC = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [classificationResults, setClassificationResults] = useState<DataClassificationResult | null>(null);
  const [dsarRequests, setDsarRequests] = useState<DSARRequest[]>([]);

  useEffect(() => {
    fetchDsarRequests();
  }, [token]);

  const fetchDsarRequests = async () => {
    try {
  
      const response = await fetch('http://localhost:5000/dsar/requests', {
        headers: {
          Authorization: token!,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to fetch DSAR requests');
      }
      
      const data = await response.json();
      setDsarRequests(data);
    } catch (error) {
      console.error('Fetch error:', error); 
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch DSAR requests.',
      });
    }
  };
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      try {
        const response = await fetch('http://localhost:5000/data/classify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token!,
          },
          body: JSON.stringify({ data: text }),
        });
        
        if (!response.ok) throw new Error('Classification failed');
        
        const result = await response.json();
        setClassificationResults(result.results);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to classify data.',
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto py-6 space-y-6 mt-20">
      <Card>
        <CardHeader>
          <CardTitle>Data Classification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="file"
              onChange={handleFileUpload}
              accept=".csv,.txt"
            />
            {classificationResults && (
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(classificationResults).map(([type, count]) => (
                  <Card key={type}>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-sm text-muted-foreground">{type}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>DSAR Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dsarRequests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.requestType}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      request.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(request.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};