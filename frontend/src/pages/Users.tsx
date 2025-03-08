import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { userTypeService, userService } from "../services/userService";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserTypeRoleAssignment } from "../components/users/UserTypeRoleAssignment";
import { useTranslation } from 'react-i18next';
import { LoadingProgress } from "../components/ui/loading-progress";
import { TableList } from "../components/table/TableList";
import { UserForm } from '../components/users/UserForm';
import { TypeForm } from '../components/types/TypeForm';

const Users = () => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await userService.getAll();
      return response.data || [];
    }
  });

  const { data: userTypes, isLoading: userTypesLoading, error: userTypesError } = useQuery({
    queryKey: ['userTypes'],
    queryFn: async () => {
      const response = await userTypeService.getAll();
      return response.data || [];
    } 
  });

  const userColumns = [
    { header: "Name", accessor: "name" },
    { header: "Phone Number", accessor: "phone_number" },
    { header: "Type", accessor: "user_type.name" },
    { 
      header: "Profile Picture", 
      accessor: "profile_picture",
      render: (user: any) => user.profile_picture ? 
        <img src={user.profile_picture} alt="profile" className="w-10 h-10 rounded-full" /> : 
        null
    }
  ];

  const typeColumns = [
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description" }
  ];

  if (usersLoading || userTypesLoading) return <LoadingProgress />;
  if (usersError || userTypesError) return <Alert variant="destructive"><AlertDescription>Failed to fetch data</AlertDescription></Alert>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('users.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <TableList 
              title="User"
              items={users || []}
              columns={userColumns}
              Form={(props) => <UserForm {...props} userTypes={userTypes} />}
              service={userService}
              onUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ['users'] });
                queryClient.invalidateQueries({ queryKey: ['userTypes'] });
              }}
              searchFields={['name', 'phone_number']}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('users.userTypes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <TableList 
              title="User Type"
              items={userTypes || []}
              columns={typeColumns}
              Form={TypeForm}
              service={userTypeService}
              onUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ['userTypes'] });
              }}
            />
          </CardContent>
        </Card>

        {/* Keep the existing Role Assignment card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('users.assignRoles')}</CardTitle>
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