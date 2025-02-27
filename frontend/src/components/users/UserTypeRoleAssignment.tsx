import React, { useState } from 'react';
import { UserType, Role } from '../../types/user';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Check, X, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { userTypeService, roleService } from '../../services/userService';
import { Alert, AlertDescription } from '../ui/alert';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface UserTypeRoleAssignmentProps {
  userTypes: UserType[];
}

export const UserTypeRoleAssignment: React.FC<UserTypeRoleAssignmentProps> = ({ userTypes }) => {
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const [selectedRoles, setSelectedRoles] = useState<Set<number>>(new Set());
  const [loadingRoles, setLoadingRoles] = useState<Set<number>>(new Set());
  
  const queryClient = useQueryClient();

  const { data: roles, isLoading, error } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await roleService.getAll();
      return response.data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (roleId: number) => {
      setLoadingRoles(prev => new Set([...Array.from(prev), roleId]));
      const typeId = parseInt(selectedTypeId);
      const currentType = userTypes.find(t => t.id === typeId);
      const hasRole = currentType?.roles?.some(r => r.id === roleId);

      try {
        if (hasRole) {
          await userTypeService.removeRole(typeId, roleId);
        } else {
          await userTypeService.assignRole(typeId, roleId);
        }
      } finally {
        setLoadingRoles(prev => {
          const newSet = new Set(prev);
          newSet.delete(roleId);
          return newSet;
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTypes'] });
    },
  });

  const handleRoleToggle = (roleId: number) => {
    const newSelected = new Set(selectedRoles);
    if (newSelected.has(roleId)) {
      newSelected.delete(roleId);
    } else {
      newSelected.add(roleId);
    }
    setSelectedRoles(newSelected);
    updateMutation.mutate(roleId);
  };

  const selectedType = userTypes.find(t => t.id === parseInt(selectedTypeId));

  if (error) return <Alert variant="destructive"><AlertDescription>Failed to load roles</AlertDescription></Alert>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <Select 
        value={selectedTypeId} 
        onValueChange={setSelectedTypeId}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a user type" />
        </SelectTrigger>
        <SelectContent>
          {userTypes.map((type) => (
            <SelectItem key={type.id} value={type.id.toString()}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedTypeId && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {roles?.map((role) => {
            const isAssigned = selectedType?.roles?.some(r => r.id === role.id);
            const isLoading = loadingRoles.has(role.id);
            
            return (
              <Button
                key={role.id}
                variant="outline"
                className={cn(
                  "justify-start",
                  isAssigned && "border-primary bg-green-50 hover:bg-green-100",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !isLoading && handleRoleToggle(role.id)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isAssigned ? (
                  <Check className="mr-2 h-4 w-4 text-green-600" />
                ) : (
                  <X className="mr-2 h-4 w-4" />
                )}
                {role.name}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};
