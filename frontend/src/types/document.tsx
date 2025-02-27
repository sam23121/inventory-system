export interface DocumentType {
    id: number;
    name: string;
    description: string;
  }
  
  export interface Document {
    id: number;
    name: string;
    type_id: number;
    serial_number: string;
    description: string;
    quantity: number;
    document_type?: DocumentType;
    date_joined: string;
    date_updated: string;
  }