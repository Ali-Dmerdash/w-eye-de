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
import { useLocalStorage } from "@uidotdev/usehooks";
import { clientData, TransactionData } from "@/data/data";

// Sample Data (Replace this with actual API data)
const data: TransactionData[] = clientData[0]?.transactionData || [];

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
      <div className="w-full h-auto  bg-primary rounded-lg">
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
// "use client"
// import Image from "next/image"

// const projects = [
//   {
//     id: 1,
//     name: "Chakra Soft UI Version",
//     icon: "/placeholder.svg?height=24&width=24",
//     members: [
//       "/placeholder.svg?height=24&width=24",
//       "/placeholder.svg?height=24&width=24",
//       "/placeholder.svg?height=24&width=24",
//     ],
//     budget: "$14,000",
//     completion: 60,
//   },
//   {
//     id: 2,
//     name: "Add Progress Track",
//     icon: "/placeholder.svg?height=24&width=24",
//     members: ["/placeholder.svg?height=24&width=24", "/placeholder.svg?height=24&width=24"],
//     budget: "$3,000",
//     completion: 10,
//   },
//   {
//     id: 3,
//     name: "Fix Platform Errors",
//     icon: "/placeholder.svg?height=24&width=24",
//     members: ["/placeholder.svg?height=24&width=24"],
//     budget: "Not set",
//     completion: 100,
//   },
//   {
//     id: 4,
//     name: "Launch our Mobile App",
//     icon: "/placeholder.svg?height=24&width=24",
//     members: [
//       "/placeholder.svg?height=24&width=24",
//       "/placeholder.svg?height=24&width=24",
//       "/placeholder.svg?height=24&width=24",
//     ],
//     budget: "$32,000",
//     completion: 100,
//   },
// ]

// export default function ProjectsTable() {
//   return (
//     <div className="p-8 bg-[#1d2328] rounded-lg h-full flex flex-col">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="text-lg font-semibold text-white">Projects</h2>
//           <p className="text-sm text-emerald-500">30 done this month</p>
//         </div>
//         <button className="p-2 text-gray-400 rounded-lg hover:bg-gray-800">
//           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//             <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
//           </svg>
//         </button>
//       </div>

//       <div className="overflow-x-auto flex-grow">
//         <table className="w-full">
//           <thead>
//             <tr className="text-xs text-gray-400 uppercase">
//               <th className="px-4 py-2 text-left">COMPANIES</th>
//               <th className="px-4 py-2 text-left">MEMBERS</th>
//               <th className="px-4 py-2 text-left">BUDGET</th>
//               <th className="px-4 py-2 text-left">COMPLETION</th>
//             </tr>
//           </thead>
//           <tbody>
//             {projects.map((project) => (
//               <tr key={project.id} className="border-t border-gray-800">
//                 <td className="px-4 py-4">
//                   <div className="flex items-center">
//                     <Image
//                       src={project.icon || "/placeholder.svg"}
//                       alt={project.name}
//                       width={24}
//                       height={24}
//                       className="mr-3"
//                     />
//                     <span className="text-sm text-white">{project.name}</span>
//                   </div>
//                 </td>
//                 <td className="px-4 py-4">
//                   <div className="flex -space-x-2">
//                     {project.members.map((member, index) => (
//                       <Image
//                         key={index}
//                         src={member || "/placeholder.svg"}
//                         alt="Team member"
//                         width={24}
//                         height={24}
//                         className="rounded-full border-2 border-[#0D1117]"
//                       />
//                     ))}
//                   </div>
//                 </td>
//                 <td className="px-4 py-4">
//                   <span className="text-sm text-white">{project.budget}</span>
//                 </td>
//                 <td className="px-4 py-4">
//                   <div className="flex items-center">
//                     <div className="w-24 h-2 mr-3 bg-gray-800 rounded-full">
//                       <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${project.completion}%` }} />
//                     </div>
//                     <span className="text-sm text-white">{project.completion}%</span>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

