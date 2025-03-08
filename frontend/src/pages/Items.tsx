import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { itemService, itemTypeService } from "../services/itemService";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { LoadingProgress } from "../components/ui/loading-progress";
import { TableList } from "../components/table/TableList";
import { ItemForm } from '../components/items/ItemForm';
import { TypeForm } from '../components/types/TypeForm';

const Items = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: items = [], isLoading: itemsLoading, error: itemsError } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const response = await itemService.getAll();
      return response.data || [];
    }
  });

  const { data: itemTypes = [], isLoading: typesLoading, error: typesError } = useQuery({
    queryKey: ['itemTypes'],
    queryFn: async () => {
      const response = await itemTypeService.getAll();
      return response.data || [];
    }
  });

  const itemColumns = [
    { header: "Name", accessor: "name" },
    { header: "Serial Number", accessor: "serial_number" },
    { header: "Type", accessor: "item_type.name" },
    { header: "Description", accessor: "description" },
    { header: "Quantity", accessor: "quantity" },
    { 
      header: "Date Updated", 
      accessor: "dateUpdated",
      render: (item: any) => new Date(item.dateUpdated).toLocaleDateString()
    }
  ];

  const typeColumns = [
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description" }
  ];

  if (itemsLoading || typesLoading) return <LoadingProgress />;
  if (itemsError || typesError) return <Alert variant="destructive"><AlertDescription>Failed to fetch data</AlertDescription></Alert>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('items.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <TableList 
              title="Item"
              items={items}
              columns={itemColumns}
              Form={(props) => <ItemForm {...props} itemTypes={itemTypes} />}
              service={itemService}
              onUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ['items'] });
                queryClient.invalidateQueries({ queryKey: ['itemTypes'] });
              }}
              searchFields={['name', 'description', 'serial_number']}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('items.itemTypes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <TableList 
              title="Item Type"
              items={itemTypes}
              columns={typeColumns}
              Form={TypeForm}
              service={itemTypeService}
              onUpdate={() => {
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