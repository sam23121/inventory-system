import { User } from "./user";
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

  export interface ReligiousDocument {
    id: number;
    serial_number: string;
    english_name: string;
    english_father_name?: string;
    english_mother_name?: string;
    english_christian_name?: string;

    amharic_name: string;
    amharic_father_name?: string;
    amharic_mother_name?: string;
    amharic_christian_name?: string;

    date_of_birth: string;
    place_of_birth: string;
    address?: string;
    phone_number?: string;

    priest_name?: string;
    priest? : User;
    priest_id?: number;

    amharic_witness_name_1?: string;
    amharic_witness_name_2?: string;
    english_witness_name_1?: string;
    english_witness_name_2?: string;
    address_witness_1?: string;
    address_witness_2?: string;

    recorded_by?: User;
    recorded_by_id?: number;
    approved_by?: User;
    approved_by_id?: number;
    created_at: string;
    updated_at: string;
  }

  export interface BaptismDocument extends ReligiousDocument {
    baptism_date?: string;
    baptism_place?: string;
    amharic_god_parent_name?: string;
    english_god_parent_name?: string;
  }

  export interface BurialDocument extends ReligiousDocument {
    date_of_death?: string;
    place_of_death?: string;
    cause_of_death?: string;
    burial_date?: string;
  }

  export interface MarriageDocument extends ReligiousDocument {
    english_bride_name?: string;
    english_bride_father_name?: string;
    english_bride_mother_name?: string;
    english_bride_christian_name?: string;
    
    amharic_bride_name?: string;
    amharic_bride_father_name?: string;
    amharic_bride_mother_name?: string;
    amharic_bride_christian_name?: string;

    date_of_marriage?: string;
    place_of_marriage?: string;
  }

