import React from 'react';
import { User, UserType } from '../../types/user';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

interface ProfileViewProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  userTypes: UserType[];
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  isOpen,
  onClose,
  userTypes,
}) => {
  if (!user) return null;

  const userType = userTypes.find(t => t.id === user.type_id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-6">
            <div className="flex justify-center">
              <Avatar className="w-32 h-32">
                <AvatarImage src={user.profile_picture} />
                <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="text-lg">{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <p className="text-lg">{user.phone_number}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">User Type</label>
              <p className="text-lg">{userType?.name}</p>
            </div>

            {userType?.roles && userType.roles.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <label className="text-sm font-medium">Roles</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userType.roles.map(role => (
                      <Badge key={role.id} variant="secondary">
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {user.kristna_abat && (
              <Card>
                <CardContent className="pt-6">
                  <label className="text-sm font-medium">Kristna Abat</label>
                  <p className="text-lg">{user.kristna_abat.name}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
