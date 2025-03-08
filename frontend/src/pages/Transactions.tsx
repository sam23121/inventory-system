import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TableList } from "../components/table/TableList";
import { TransactionForm } from '../components/transactions/TransactionForm';
import { TypeForm } from '../components/types/TypeForm';
import { transactionService, transactionTypeService } from "../services/transactionService";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, AlertDescription } from "../components/ui/alert";
import { useTranslation } from 'react-i18next';
import { LoadingProgress } from "../components/ui/loading-progress";

const Transactions = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: transactions, isLoading: transactionsLoading, error: transactionsError } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await transactionService.getAll();
      return response.data;
    }
  });

  const { data: transactionTypes, isLoading: typesLoading, error: typesError } = useQuery({
    queryKey: ['transactionTypes'],
    queryFn: async () => {
      const response = await transactionTypeService.getAll();
      return response.data;
    }
  });

  const transactionColumns = [
    { header: "Type", accessor: "trans_type.name" },
    { header: "Description", accessor: "description" },
    { header: "Quantity", accessor: "quantity" },
    { 
      header: "Date Taken", 
      accessor: "date_taken",
      render: (item: any) => new Date(item.date_taken).toLocaleDateString()
    },
    { header: "Status", accessor: "status" },
    { 
      header: "Requested By", 
      accessor: "requested_by.name"
    }
  ];

  const typeColumns = [
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description" }
  ];

  if (transactionsLoading || typesLoading) return <LoadingProgress />;
  if (transactionsError || typesError) return <Alert variant="destructive"><AlertDescription>Failed to fetch data</AlertDescription></Alert>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('transactions.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <TableList 
              title="Transaction"
              items={transactions || []}
              columns={transactionColumns}
              Form={(props) => <TransactionForm {...props} transactionTypes={transactionTypes} />}
              service={transactionService}
              onUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ['transactions'] });
              }}
              searchFields={['description', 'status']}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('transactions.transactionTypes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <TableList 
              title="Transaction Type"
              items={transactionTypes || []}
              columns={typeColumns}
              Form={TypeForm}
              service={transactionTypeService}
              onUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ['transactionTypes'] });
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Transactions;

