import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ScheduleList } from "../components/schedule/ScheduleList";

const Schedule: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
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
