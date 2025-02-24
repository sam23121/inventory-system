import React, { useEffect, useState } from 'react';
import { Calendar } from '../ui/calendar';
import { Card, CardContent } from '../ui/card';
import { useQuery } from '@tanstack/react-query';
import { format, set } from 'date-fns';
import { scheduleService } from '../../services/scheduleService';
import { Schedule } from '../../types/schedule';
import { useAuth } from '../../hooks/useAuth';

export const ScheduleCalendar = () => {
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shifts, setShifts] = useState<Schedule[]>([]);
  const [scheduleTypes, setScheduleTypes] = useState<Schedule[]>([]);
  const { user } = useAuth();

  const fetchSchedules = async () => {
    if (!user?.id) throw new Error('No user ID');
    try{
      setLoading(true);
      const response = await scheduleService.getByUser(user.id);
      setSchedules(response.data);
      setError(null);
    }catch(error){
      setError('Failed to fetch schedules');
      console.error('Error fetching schedules:', error);
    }finally{
      setLoading(false);
    }
  }

  const fetchShifts = async () => {
    try{
      const response = await scheduleService.getShifts();
      setShifts(response.data);
    }catch(error){
      console.error('Error fetching shifts:', error);
    }
  }

  const fetchScheduleTypes = async () => {
    try{
      const response = await scheduleService.getScheduleTypes();
      setScheduleTypes(response.data);
    }catch(error){
      console.error('Error fetching schedule types:', error);
  }
 }

  useEffect(() => {
    fetchSchedules();
    fetchShifts();
    fetchScheduleTypes();
  },[]);


  const schedulesByDate = schedules?.reduce((acc, schedule) => {
    const date = format(new Date(schedule.date), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(schedule);
    return acc;
  }, {} as Record<string, Schedule[]>);


  const selectedDateSchedules = schedulesByDate?.[format(selectedDate, 'yyyy-MM-dd')] || [];

  return (
    <div className="flex gap-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        className="rounded-md border"
        modifiers={{
          hasSchedule: (date) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            return !!schedulesByDate?.[dateStr];
          },
        }}
        modifiersStyles={{
          hasSchedule: { backgroundColor: '#e2e8f0' },
        }}
      />
      <Card className="flex-1">
        <CardContent className="p-4">
          <div className="mb-4">
            <h2 className="font-semibold">
              Schedules for {format(selectedDate, 'MMMM d, yyyy')}
            </h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <span>Loading schedules...</span>
            </div>
          ) : selectedDateSchedules.length === 0 ? (
            <div className="flex items-center justify-center py-4">
              <span>No schedules for this date</span>
            </div>
          ) : (
            selectedDateSchedules.map((schedule) => (
              <div key={schedule.id} className="border-b py-2">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{schedule.shift.name}</h3> 
                    <p className="text-sm text-gray-600">
                      {schedule.shift.start_time} - {schedule.shift.end_time}
                    </p>
                  </div>
                  <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {schedule.type.name}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{schedule.description}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
