import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DataClassificationResult, DSARRequest } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const DashboardPage: React.FC = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [classificationResults, setClassificationResults] = useState<DataClassificationResult | null>(null);
  const [dsarRequests, setDsarRequests] = useState<DSARRequest[]>([]);
  const [requestType, setRequestType] = useState<string>('delete');
  const [description, setDescription] = useState<string>('');
  const [isRequestSubmitted, setIsRequestSubmitted] = useState<boolean>(false);

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

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/data/classify', {
        method: 'POST',
        headers: {
          Authorization: token!,
        },
        body: formData,
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

  const handleDSARRequest = async () => {
    if (!description) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please provide a description for the DSAR request.',
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/dsar/submit', {
        method: 'POST',
        headers: {
          Authorization: token!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestType, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to submit DSAR request');
      }

      setIsRequestSubmitted(true);
      toast({
        variant: 'default',
        title: 'DSAR Request Submitted',
        description: 'Your DSAR request has been successfully submitted.',
      });

      fetchDsarRequests();
    } catch (error) {
      console.error('Error submitting DSAR request:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit DSAR request.',
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6 mt-20">
      {/* Data Classification */}
      <Card className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>Data Classification</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-100 mb-4">
            Upload your data files to classify sensitive information quickly and efficiently. Gain insights into your data with advanced classification techniques.
          </p>
          <div className="space-y-4">
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-block px-4 py-2 bg-gray-300 text-gray-800 font-medium rounded-md hover:bg-gray-400 transition-all"
            >
              Upload File
            </label>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              accept=".csv,.txt,.xlsx"
              className="hidden"
            />
            {classificationResults && (
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(classificationResults).map(([type, count]) => (
                  <Card
                    key={type}
                    className="bg-white text-indigo-400 border border-indigo-400 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
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

      {/* DSAR Request */}
      {classificationResults && !isRequestSubmitted && (
        <Card className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
          <CardHeader>
            <CardTitle className="text-2xl font-extrabold tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>Submit DSAR Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white">Request Type</label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="mt-1 block w-full p-2 border border-pink-400 rounded-md shadow-sm text-gray-800"
                >
                  <option value="delete">Delete Data</option>
                  <option value="access">Access Data</option>
                  <option value="rectify">Rectify Data</option>
                  <option value="restrict">Restrict Processing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full p-2 border border-purple-500 rounded-md shadow-sm text-gray-800"
                  rows={4}
                  placeholder="Provide a description of the request"
                />
              </div>
              <Button
                onClick={handleDSARRequest}
                className="bg-indigo-400 hover:bg-indigo-600 text-white shadow-lg"
              >
                Submit Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DSAR Requests Table */}
      <Card className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>DSAR Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-800">Type</TableHead>
                <TableHead className="text-gray-800">Status</TableHead>
                <TableHead className="text-gray-800">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dsarRequests.map((request) => (
                <TableRow
                  key={request._id}
                  className="hover:bg-purple-400 hover:text-white transition-all duration-300"
                >
                  <TableCell>{request.requestType}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        request.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
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



