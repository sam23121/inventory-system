export interface ItemType {
    id: number;
    name: string;
    description: string;
  }
  
  export interface Item {
    id: number;
    name: string;
    type: string;
    description: string;
    quantity: number;
    dateJoined: Date;
    dateUpdated: Date;
  }