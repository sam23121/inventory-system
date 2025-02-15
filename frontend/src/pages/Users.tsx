
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { UserList } from "../components/users/UserList";


const Users = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <UserList />
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;