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
  kristna_abat?: User;
  password?: string;
  confirm_password?: string;
  user_type?: UserType;  // This will include the roles through the UserType
  profile_picture?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType {
  auth: AuthState;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

