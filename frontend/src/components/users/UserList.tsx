import React, { useState } from 'react';
import { User, UserType } from '../../types/user';
import { userService } from '../../services/userService';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Edit, Eye, EyeOff, Trash2, Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { UserForm } from './UserForm';
import { Input } from '../ui/input';
import { usePagination } from '../../hooks/usePagination';
import { Pagination } from '../ui/pagination';

interface UserListProps {
  users: User[];
  userTypes: UserType[];
  onUserUpdate: () => void;
}

export const UserList: React.FC<UserListProps> = ({ users, userTypes, onUserUpdate }) => {
  const [error, setError] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<number, boolean>>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const ITEMS_PER_PAGE = 5;

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.delete(id);
        onUserUpdate();
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const togglePasswordVisibility = (userId: number) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (data: Partial<User>) => {
    try {
      if (selectedUser?.id) {
        await userService.update(selectedUser.id, data);
        onUserUpdate();
        setIsEditModalOpen(false);
        setSelectedUser(null);
      }
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleCreateSubmit = async (data: Partial<User>) => {
    try {
      await userService.create(data as Omit<User, 'id'>);
      onUserUpdate();
      setIsCreateModalOpen(false);
    } catch (err) {
      setError('Failed to create user');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_type?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    startIndex,
    endIndex,
    hasNextPage,
    hasPrevPage
  } = usePagination({
    totalItems: filteredUsers.length,
    itemsPerPage: ITEMS_PER_PAGE
  });

  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create User
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Password</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>User Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.phone_number}</TableCell>
              <TableCell className="flex items-center gap-2">
                <span className="font-mono">
                  {visiblePasswords[user.id] ? user.password : '••••••••'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePasswordVisibility(user.id)}
                >
                  {visiblePasswords[user.id] ? 
                    <EyeOff className="w-4 h-4" /> : 
                    <Eye className="w-4 h-4" />
                  }
                </Button>
              </TableCell>
              <TableCell>
                {user.user_type?.roles?.map(role => role.name).join(', ') || 'No roles assigned'}
              </TableCell>
              <TableCell>{user.user_type?.name || 'Unknown Type'}</TableCell>
              <TableCell className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit(user)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
      />

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <UserForm
            initialData={selectedUser || undefined}
            userTypes={userTypes}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
          </DialogHeader>
          <UserForm
            userTypes={userTypes}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
