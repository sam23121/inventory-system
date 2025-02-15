import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TransactionList } from "../components/transactions/TransactionList";

const Transactions = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transaction Management</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionList />
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;

