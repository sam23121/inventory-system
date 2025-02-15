import { useState, useEffect } from "react";
import { Calendar } from "../ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { userService } from "../../services/userService";
import { scheduleService } from "../../services/scheduleService";
import { User } from "../../types/user";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

export const ScheduleList = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const shifts = [
    { id: "morning", label: "Morning (8AM - 4PM)" },
    { id: "afternoon", label: "Afternoon (4PM - 12AM)" },
    { id: "night", label: "Night (12AM - 8AM)" },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userService.getAll();
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleScheduleAssignment = async () => {
    if (!date || !selectedUser || !selectedShift) {
      setError("Please select all required fields");
      return;
    }

    try {
      await scheduleService.create({
        user_id: parseInt(selectedUser),
        // shift: selectedShift,
        date: date.toISOString(),
        description: "Scheduled shift",
        type: "prayer",
        assigned_by_id: 1,
        approved_by_id: 2,
      });
      
      // Clear selections after successful assignment
      setSelectedUser("");
      setSelectedShift("");
      setError(null);
    } catch (err) {
      setError("Failed to assign schedule");
      console.error("Error assigning schedule:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label>Select Date</Label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Employee</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Select Shift</Label>
            <Select value={selectedShift} onValueChange={setSelectedShift}>
              <SelectTrigger>
                <SelectValue placeholder="Select a shift" />
              </SelectTrigger>
              <SelectContent>
                {shifts.map((shift) => (
                  <SelectItem key={shift.id} value={shift.id}>
                    {shift.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full mt-4" 
            onClick={handleScheduleAssignment}
            disabled={!date || !selectedUser || !selectedShift}
          >
            Assign Schedule
          </Button>
        </div>
      </div>
    </div>
  );
};
