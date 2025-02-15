export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface UserType {
  id: number;
  name: string;
  description: string;
  roles?: Role[];
}

export interface User {
  id: number;
  name: string;
  phone_number: string;
  type_id: number;
  password?: string;
  confirm_password?: string;
  user_type?: UserType;  // This will include the roles through the UserType
}
