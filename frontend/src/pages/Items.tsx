import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ItemList } from "../components/items/ItemList";

const Items = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Item Management</CardTitle>
        </CardHeader>
        <CardContent>
          <ItemList />
        </CardContent>
      </Card>
    </div>
  );
};

export default Items;