import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { scheduleService, scheduleTypeService, scheduleShiftService } from "../services/scheduleService";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { LoadingProgress } from "../components/ui/loading-progress";
import { TableList } from "../components/table/TableList";
import { ScheduleForm } from '../components/schedule/ScheduleForm';
import { TypeForm } from '../components/types/TypeForm';
import { ShiftForm } from '../components/schedule/ShiftForm';

const Schedule = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: schedules = [], isLoading: schedulesLoading, error: schedulesError } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const response = await scheduleService.getAll();
      return response.data || [];
    }
  });

  const { data: scheduleTypes = [], isLoading: typesLoading, error: typesError } = useQuery({
    queryKey: ['scheduleTypes'],
    queryFn: async () => {
      const response = await scheduleTypeService.getAll();
      return response.data || [];
    }
  });

  const { data: shifts = [], isLoading: shiftsLoading, error: shiftsError } = useQuery({
    queryKey: ['shifts'],
    queryFn: async () => {
      const response = await scheduleShiftService.getAll();
      return response.data || [];
    }
  });

  const scheduleColumns = [
    { header: "Type", accessor: "schedule_type.name" },
    { header: "Shift", accessor: "shift.name" },
    { 
      header: "Date", 
      accessor: "date",
      render: (item: any) => new Date(item.date).toLocaleDateString()
    },
    { header: "Description", accessor: "description" },
    { header: "User", accessor: "user.name" }
  ];

  const typeColumns = [
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description" }
  ];

  const shiftColumns = [
    { header: "Name", accessor: "name" },
    { header: "Start Time", accessor: "start_time" },
    { header: "End Time", accessor: "end_time" },
    { header: "Description", accessor: "description" }
  ];

  if (schedulesLoading || typesLoading || shiftsLoading) return <LoadingProgress />;
  if (schedulesError || typesError || shiftsError) return <Alert variant="destructive"><AlertDescription>Failed to fetch data</AlertDescription></Alert>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('schedules.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <TableList 
              title="Schedule"
              items={schedules}
              columns={scheduleColumns}
              Form={(props) => (
                <ScheduleForm 
                  {...props} 
                  scheduleTypes={scheduleTypes}
                  shifts={shifts}
                />
              )}
              service={scheduleService}
              onUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ['schedules'] });
              }}
              searchFields={['description', 'user.name']}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('schedules.scheduleTypes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <TableList 
              title="Schedule Type"
              items={scheduleTypes}
              columns={typeColumns}
              Form={TypeForm}
              service={scheduleTypeService}
              onUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ['scheduleTypes'] });
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('schedules.shifts')}</CardTitle>
          </CardHeader>
          <CardContent>
            <TableList 
              title="Shift"
              items={shifts}
              columns={shiftColumns}
              Form={ShiftForm}
              service={scheduleShiftService}
              onUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ['shifts'] });
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Schedule;
