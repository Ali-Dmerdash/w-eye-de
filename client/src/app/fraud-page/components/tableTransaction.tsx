"use client";
import { useState, useEffect } from "react";
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
import { Button } from "@/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { useLocalStorage } from "@uidotdev/usehooks";
import fraudData from "../fraudData.json"; // Import the fraud data JSON file directly

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

const TableTransaction = () => {
  // Get the transactions from the fraudData
  const data = fraudData.transactions || [];

  // Default column order
  const defaultColumns: ColumnDef<(typeof data)[0]>[] = [
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
      id: "fraud_rate",
      accessorKey: "fraud_rate",
      header: "Fraud Rate",
      cell: ({ row }) => (
        <div>{(row.getValue("fraud_rate") * 100).toFixed(2)}%</div> // Show as percentage
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
    fraud_rate: true,
  };

  const [columnsOrder, setColumnsOrder] = useLocalStorage(
    COLUMN_ORDER_KEY,
    defaultColumns
  );

  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    COLUMN_VISIBILITY_KEY,
    defaultColumnVisibility
  );

  const table = useReactTable({
    data,
    columns: columnsOrder,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { columnVisibility },
  });

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
      setColumnsOrder(newOrder);

      return newOrder;
    });
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="w-full h-auto bg-primary rounded-lg">
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
};

export default TableTransaction;
