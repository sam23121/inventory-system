import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TransactionList } from "../components/transactions/TransactionList";
import { Transaction, TransactionType } from "../types/transaction";
import { transactionService, transactionTypeService } from "../services/transactionService";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "../components/ui/alert";
import { TypeList } from "../components/types/TypeList";

const Transactions = () => {
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fetchedTransactionsResponse, fetchedTransactionTypesResponse] = await Promise.all([
        transactionService.getAll(),
        transactionTypeService.getAll()
      ]);
      setTransactions(fetchedTransactionsResponse.data);
      setTransactionTypes(fetchedTransactionTypesResponse.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
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
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionList 
              transactions={transactions}
              transactionTypes={transactionTypes}
              onTransactionUpdate={fetchData}
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
              items={transactionTypes}
              onItemUpdate={fetchData}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};  
export default Transactions;

