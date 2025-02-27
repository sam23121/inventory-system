import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ItemList } from "../components/items/ItemList";
import { itemService, itemTypeService } from "../services/itemService";
import { Item, ItemType } from "../types/item";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "../components/ui/alert";
import { TypeList } from "../components/types/TypeList";
import { useQuery, useQueryClient } from '@tanstack/react-query';

const Items = () => {
  const queryClient = useQueryClient();

  const { data: items, isLoading: itemsLoading, error: itemsError } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const response = await itemService.getAll();
      return response.data;
    }
  });

  const { data: itemTypes, isLoading: typesLoading, error: typesError } = useQuery({
    queryKey: ['itemTypes'],
    queryFn: async () => {
      const response = await itemTypeService.getAll();
      return response.data;
    }
  });

  if (itemsLoading || typesLoading) return <div>Loading...</div>;
  if (itemsError || typesError) return <Alert variant="destructive"><AlertDescription>Failed to fetch data</AlertDescription></Alert>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ItemList 
              items={items ?? []}
              itemTypes={itemTypes ?? []}
              onItemUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ['items'] });
                queryClient.invalidateQueries({ queryKey: ['itemTypes'] });
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Item Types</CardTitle>
          </CardHeader>
          <CardContent>
            <TypeList 
              title="Item Types"
              service={itemTypeService}
              items={itemTypes ?? []}
              onItemUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ['itemTypes'] });
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Items;