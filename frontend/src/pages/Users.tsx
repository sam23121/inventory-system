import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { UserList } from "../components/users/UserList";
import { TypeList } from "../components/types/TypeList";
import { userTypeService, userService } from "../services/userService";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useEffect, useState } from "react";
import { User, UserType } from "../types/user";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserTypeRoleAssignment } from "../components/users/UserTypeRoleAssignment";

const Users = () => {

  const queryClient = useQueryClient();

  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await userService.getAll();
      return response.data;
    }
  });

  const { data: userTypes, isLoading: userTypesLoading, error: userTypesError } = useQuery({
    queryKey: ['userTypes'],
    queryFn: async () => {
      const response = await userTypeService.getAll();
      return response.data;
    }
  });


  if (usersLoading || userTypesLoading) return <div>Loading...</div>;
  if (usersError || userTypesError) return <Alert variant="destructive"><AlertDescription>Failed to fetch data</AlertDescription></Alert>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Users Section */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <UserList 
              users={users ?? []}
              userTypes={userTypes ?? []}
              onUserUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ['users'] });
                queryClient.invalidateQueries({ queryKey: ['userTypes'] });
              }}
            />
          </CardContent>
        </Card>

        {/* User Types Section */}
        <Card>
          <CardHeader>
            <CardTitle>User Types</CardTitle>
          </CardHeader>
          <CardContent>
            <TypeList 
            title="User Type" 
            service={userTypeService} 
            items={userTypes ?? []} 
            onItemUpdate={() => {
              queryClient.invalidateQueries({ queryKey: ['userTypes'] });
            }}
            />
          </CardContent>
        </Card>

        {/* Assign Roles to User types */}
        <Card>
          <CardHeader>
            <CardTitle>Assign Roles to User Types</CardTitle>
          </CardHeader>
          <CardContent>
            <UserTypeRoleAssignment userTypes={userTypes ?? []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Users;