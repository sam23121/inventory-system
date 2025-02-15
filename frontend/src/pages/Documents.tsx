import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import DocumentList from "../components/documents/DocumentList";

const Documents = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Management</CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentList />
        </CardContent>
      </Card>
    </div>
  );
};

export default Documents;