import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import ScheduleList from "../components/schedule/ScheduleList";
import { TypeList } from "../components/types/TypeList";
import { scheduleService, scheduleTypeService, scheduleShiftService } from "../services/scheduleService";
import { userService } from "../services/userService";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ShiftList } from "../components/schedule/ShiftList";

const Schedule = () => {
  const queryClient = useQueryClient();

  const { data: schedules, isLoading: schedulesLoading, error: schedulesError } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const response = await scheduleService.getAll();
      return response.data;
    }
  });
  
  const { data: scheduleTypes, isLoading: typesLoading, error: typesError } = useQuery({
    queryKey: ['scheduleTypes'],
    queryFn: async () => {
      const response = await scheduleTypeService.getAll();
      return response.data;
    }
  });

  const {data: scheduleShifts, isLoading: shiftsLoading, error: shiftsError} = useQuery({
    queryKey: ['scheduleShifts'],
    queryFn: async () => {
      const response = await scheduleShiftService.getAll();
      return response.data;
    }
  });

  const {data: users, isLoading: usersLoading, error: usersError} = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await userService.getAll();
      return response.data;
    }
  });


  if (schedulesLoading || typesLoading) return <div>Loading...</div>;
  if (schedulesError || typesError) return <Alert variant="destructive"><AlertDescription>Failed to fetch data</AlertDescription></Alert>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Schedules</CardTitle>
          </CardHeader>          
          <CardContent>
            <ScheduleList 
              schedules={schedules ?? []}
              scheduleTypes={scheduleTypes ?? []}
              scheduleShifts={scheduleShifts ?? []}
              users={users ?? []}
              onScheduleUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ['schedules'] });
                queryClient.invalidateQueries({ queryKey: ['scheduleTypes'] });
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Types</CardTitle>
          </CardHeader>
          <CardContent>
            <TypeList 
              title="Schedule Type"
              service={scheduleTypeService}
              items={scheduleTypes ?? []}
              onItemUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ['scheduleTypes'] });
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Shifts</CardTitle>
          </CardHeader>
          <CardContent>
            <ShiftList 
              title="Schedule Shift"
              service={scheduleShiftService}
              items={scheduleShifts ?? []}
              onItemUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ['scheduleShifts'] });
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Schedule;
