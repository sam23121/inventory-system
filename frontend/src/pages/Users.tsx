import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { UserList } from "../components/users/UserList";
import { TypeList } from "../components/types/TypeList";
import { userTypeService, userService } from "../services/userService";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useEffect, useState } from "react";
import { User, UserType } from "../types/user";


const Users = () => {

  const [users, setUsers] = useState<User[]>([]);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fetchedUsersResponse, fetchedUserTypesResponse] = await Promise.all([
        userService.getAll(),
        userTypeService.getAll()
      ]);
      setUsers(fetchedUsersResponse.data);
      setUserTypes(fetchedUserTypesResponse.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;

  
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
              users={users}
              userTypes={userTypes}
              onUserUpdate={fetchData}
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
            items={userTypes} 
            onItemUpdate={fetchData}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Users;