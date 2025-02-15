export interface TransactionType {
    id: number;
    name: string;
    description: string;
  }
  
  export interface Transaction {
    id: number;
    type: string;
    description: string;
    quantity: number;
    dateTaken: string;
    dateReturned: string | null;
    status: string;
    approvedBy?: number;
    requestedBy?: number;
  }