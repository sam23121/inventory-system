import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ItemList } from "../components/items/ItemList";
import { itemService, itemTypeService } from "../services/itemService";
import { Item, ItemType } from "../types/item";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "../components/ui/alert";
import { TypeList } from "../components/types/TypeList";

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fetchedItemsResponse, fetchedItemTypesResponse] = await Promise.all([
        itemService.getAll(),
        itemTypeService.getAll()
      ]);
      setItems(fetchedItemsResponse.data);
      setItemTypes(fetchedItemTypesResponse.data);
    }
    catch (err) {
      setError('Failed to fetch data');
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ItemList 
              items={items}
              itemTypes={itemTypes}
              onItemUpdate={fetchData}
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
              items={itemTypes}
              onItemUpdate={fetchData}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Items;