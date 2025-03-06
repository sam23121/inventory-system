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
import { useTranslation } from 'react-i18next';

interface TransactionListProps {
  transactions: Transaction[];
  transactionTypes: TransactionType[];
  onTransactionUpdate: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({transactions, transactionTypes, onTransactionUpdate}) => {
  const { t } = useTranslation();
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
            placeholder={t('common.search')}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          {t('transactions.createTransaction')}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('common.id-2')}</TableHead>
            <TableHead>{t('common.type')}</TableHead>
            <TableHead>{t('common.description')}</TableHead>
            <TableHead>{t('common.quantity')}</TableHead>
            <TableHead>{t('common.dateTaken')}</TableHead>
            <TableHead>{t('common.status')}</TableHead>
            <TableHead>{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.id}</TableCell>
              <TableCell>{transaction.trans_type?.name}</TableCell>
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
                    {t('common.view')}
                  </Button>
                  {transaction.status === 'PENDING' && (
                    <>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleApprove(transaction.id)}
                      >
                        {t('common.approve')}
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleReject(transaction.id)}
                      >
                        {t('common.reject')}
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
            <DialogTitle>{t('transactions.editTransaction')}</DialogTitle>
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
            <DialogTitle>{t('transactions.createTransaction')}</DialogTitle>
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
