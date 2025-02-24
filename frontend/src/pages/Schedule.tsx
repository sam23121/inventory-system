import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import ScheduleList from "../components/schedule/ScheduleList";

const Schedule = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Schedule Management</CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleList />
        </CardContent>
      </Card>
    </div>
  );
};

export default Schedule;
