import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TransactionList } from "../components/transactions/TransactionList";
import { TypeList } from "../components/types/TypeList";
import { transactionService, transactionTypeService } from "../services/transactionService";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, AlertDescription } from "../components/ui/alert";
import { useTranslation } from 'react-i18next';

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

  if (transactionsLoading || typesLoading) return <div>Loading...</div>;
  if (transactionsError || typesError) return <Alert variant="destructive"><AlertDescription>Failed to fetch data</AlertDescription></Alert>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('transactions.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionList 
              transactions={transactions ?? []}
              transactionTypes={transactionTypes ?? []}
              onTransactionUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ['transactions'] });
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('transactions.transactionTypes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <TypeList 
              title={t('transactions.transactionTypes')}
              service={transactionTypeService} 
              items={transactionTypes ?? []}
              onItemUpdate={() => {
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

