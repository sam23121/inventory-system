import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TransactionList } from "../components/transactions/TransactionList";
import { Transaction, TransactionType } from "../types/transaction";
import { transactionService, transactionTypeService } from "../services/transactionService";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "../components/ui/alert";
import { TypeList } from "../components/types/TypeList";
import { useQuery, useQueryClient } from '@tanstack/react-query';

const Transactions = () => {
  const queryClient = useQueryClient();

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
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionList 
              transactions={transactions ?? []}
              transactionTypes={transactionTypes ?? []}
              onTransactionUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ['transactions'] });
                queryClient.invalidateQueries({ queryKey: ['transactionTypes'] });
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Types</CardTitle>
          </CardHeader>
          <CardContent>
            <TypeList 
              title="Transaction Type"
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

