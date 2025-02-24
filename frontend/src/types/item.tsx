export interface ItemType {
    id: number;
    name: string;
    description: string;
  }
  
export interface Item {
  id: number;
  name: string;
  serial_number?: string;
  type_id: number;
  item_type?: ItemType;
  description: string;
  quantity: number;
  dateJoined: Date;
  dateUpdated: Date;
}