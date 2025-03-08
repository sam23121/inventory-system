import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Pagination } from "./pagination";
import { Search } from "./search";
import { Button } from "./button";
import { Plus } from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: string;
    header: string;
    cell: (item: T) => React.ReactNode;
  }[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  onCreate?: () => void;
  createButtonText?: string;
}

export function DataTable<T>({
  data,
  columns,
  searchValue,
  onSearchChange,
  pagination,
  onCreate,
  createButtonText,
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Search
          value={searchValue}
          onChange={onSearchChange}
        />
        {onCreate && (
          <Button onClick={onCreate}>
            <Plus className="w-4 h-4 mr-2" />
            {createButtonText}
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.key}>{column.cell(item)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination {...pagination} />
    </div>
  );
}
