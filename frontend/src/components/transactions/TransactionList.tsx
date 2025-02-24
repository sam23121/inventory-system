import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../../types/transaction';
import { transactionService, transactionTypeService } from '../../services/transactionService';
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import { Search } from 'lucide-react';
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { TransactionForm } from './TransactionForm';

interface TransactionListProps {
  transactions: Transaction[];
  transactionTypes: TransactionType[];
  onTransactionUpdate: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({transactions, transactionTypes, onTransactionUpdate}) => {
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);



  const handleApprove = async (id: number) => {
    try {
      await transactionService.approve(id);
      await onTransactionUpdate();
    } catch (err) {
      setError('Failed to approve transaction');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await transactionService.reject(id);
      await onTransactionUpdate();
    } catch (err) {
      setError('Failed to reject transaction');
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (data: Partial<Transaction>) => {
    try {
      if (selectedTransaction?.id) {
        await transactionService.update(selectedTransaction.id, data);
        onTransactionUpdate();
        setIsEditModalOpen(false);
        setSelectedTransaction(null);
      }
    } catch (err) {
      setError('Failed to update transaction');
    }
  };

  const handleCreateSubmit = async (data: Omit<Transaction, 'id'>) => {
    try {
      await transactionService.create(data);
      onTransactionUpdate();
      setIsCreateModalOpen(false);
    } catch (err) {
      setError('Failed to create transaction');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive"
    };
    return <Badge variant={variants[status.toLowerCase()]}>{status}</Badge>;
  };

  const filteredTransactions = transactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    const type = transaction.type?.toString().toLowerCase() ?? '';
    const description = transaction.description?.toLowerCase() ?? '';
    
    return type.includes(searchLower) || description.includes(searchLower);
  });

  if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Create Transaction
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Date Taken</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.id}</TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.quantity}</TableCell>
              <TableCell>{new Date(transaction.dateTaken).toLocaleDateString()}</TableCell>
              <TableCell>{getStatusBadge(transaction.status)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(transaction)}
                  >
                    View
                  </Button>
                  {transaction.status === 'PENDING' && (
                    <>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleApprove(transaction.id)}
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleReject(transaction.id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            initialData={selectedTransaction || undefined}
            transactionTypes={transactionTypes}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            transactionTypes={transactionTypes}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
