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
    approved_by?: number;
    requested_by?: number;
    trans_type?: TransactionType;
  }