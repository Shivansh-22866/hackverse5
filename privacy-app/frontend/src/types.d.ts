export interface User {
    id: string;
    email: string;
    role: 'user' | 'admin';
  }
  
  export interface DSARRequest {
    _id: string;
    userId: string;
    requestType: 'data_access' | 'data_deletion' | 'data_rectification' | 'data_portability' | 'limit_processing';
    description: string;
    status: 'pending' | 'in_progress' | 'completed' | 'rejected';
    createdAt: string;
  }
  
  export interface DataClassificationResult {
    email: number;
    phone: number;
    ssn: number;
  }