"use client";
import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TransactionData } from "@/data/data";
import { json } from "stream/consumers";

// Sample Data (Replace this with actual API data)
const data: TransactionData[] = [
  {
    id: 1,
    name: "John Doe",
    amount: 1200,
    currency: "USD",
    flag: "🇺🇸",
    date: "2024-01-12",
    description: "Online Purchase",
    category: "Shopping",
    type: "Debit",
    fraudRate: 2.5,
  },
  {
    id: 2,
    name: "Jane Smith",
    amount: 500,
    currency: "EUR",
    flag: "🇪🇺",
    date: "2024-02-15",
    description: "Travel Expense",
    category: "Travel",
    type: "Credit",
    fraudRate: 1.2,
  },
];

// Local Storage Keys
const COLUMN_ORDER_KEY = "tableColumnOrder";
const COLUMN_VISIBILITY_KEY = "tableColumnVisibility";

// Draggable Column Header
const DraggableColumnHeader = ({ header }: { header: any }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: header.column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {flexRender(header.column.columnDef.header, header.getContext())}
    </div>
  );
};

export default function TableTransaction() {
  // Default column order
  const defaultColumns: ColumnDef<TransactionData>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      id: "amount",
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div>${(row.getValue("amount") as number).toFixed(2)}</div>
      ),
    },
    {
      id: "currency",
      accessorKey: "currency",
      header: "Currency",
      cell: ({ row }) => <div>{row.getValue("currency")}</div>,
    },
    {
      id: "flag",
      accessorKey: "flag",
      header: "Flag",
      cell: ({ row }) => <div>{row.getValue("flag")}</div>,
    },
    {
      id: "date",
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <div>{row.getValue("date")}</div>,
    },
    {
      id: "description",
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div>{row.getValue("description")}</div>,
    },
    {
      id: "category",
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <div>{row.getValue("category")}</div>,
    },
    {
      id: "type",
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <div>{row.getValue("type")}</div>,
    },
    {
      id: "fraudRate",
      accessorKey: "fraudRate",
      header: "Fraud Rate",
      cell: ({ row }) => (
        <div>{(row.getValue("fraudRate") as number).toFixed(1)}%</div>
      ),
    },
  ];

  const defaultColumnVisibility: VisibilityState = {
    name: true,
    amount: true,
    currency: true,
    flag: true,
    date: true,
    description: true,
    category: true,
    type: true,
    fraudRate: true,
  };

  const [columnsOrder, setColumnsOrder] =
    useState<ColumnDef<TransactionData>[]>(defaultColumns);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultColumnVisibility
  );

  // Load saved column order from localStorage
  useEffect(() => {
    const savedColumnOrder = localStorage.getItem(COLUMN_ORDER_KEY);
    const orderedColumns = savedColumnOrder
      ? JSON.parse(savedColumnOrder)
          .map((colId: string) =>
            defaultColumns.find((col) => col.id === colId)
          )
          .filter(Boolean)
      : defaultColumns;
    setColumnsOrder(orderedColumns);

    const savedColumnVisibility = localStorage.getItem(COLUMN_VISIBILITY_KEY);
    setColumnVisibility(
      savedColumnVisibility
        ? JSON.parse(savedColumnVisibility)
        : defaultColumnVisibility
    );
  }, []);

  const table = useReactTable({
    data,
    columns: columnsOrder,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { columnVisibility },
  });

  // Save column visibility to localStorage when changed
  useEffect(() => {
    localStorage.setItem(
      COLUMN_VISIBILITY_KEY,
      JSON.stringify(columnVisibility)
    );
  }, [columnVisibility]);

  // Handle Drag End for Column Reordering
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    setColumnsOrder((prev) => {
      const oldIndex = prev.findIndex((col) => col.id === active.id);
      const newIndex = prev.findIndex((col) => col.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return prev;
      const newOrder = arrayMove(prev, oldIndex, newIndex);

      // Save new order in localStorage
      localStorage.setItem(
        COLUMN_ORDER_KEY,
        JSON.stringify(newOrder.map((col) => col.id))
      );

      return newOrder;
    });
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="w-full bg-primary">
        {/* Column Visibility Toggle Button */}
        <div className="flex items-center py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Choose Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns().map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={() =>
                    column.toggleVisibility(!column.getIsVisible())
                  }
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <SortableContext
                items={columnsOrder.map((col) => col.id as string)}
              >
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        <DraggableColumnHeader header={header} />
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </SortableContext>
            </TableHeader>
            <TableBody className="text-white">
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columnsOrder.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DndContext>
  );
}
