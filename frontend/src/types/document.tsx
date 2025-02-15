export interface DocumentType {
    id: number;
    name: string;
    description: string;
  }
  
  export interface Document {
    id: number;
    name: string;
    type_id: number;
    description: string;
    quantity: number;
    date_joined: string;
    date_updated: string;
  }