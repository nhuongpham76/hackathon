import React, { useState, useCallback, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

export type TableData = {
  response_id: any;
  name: string;
  fit_score: any;
  engagement_score: any;
  lead_sentiment: any;
  summary: any;
};

interface DataTableProps {
  data: TableData[];
  interviewId: string;
}

function DataTable({ data, interviewId }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "fit_score", desc: true },
  ]);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((rowId: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredRowId(rowId);
    }, 400);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredRowId(null);
  }, []);

  const customSortingFn = (a: any, b: any) => {
    if (a === null || a === undefined) {
      return -1;
    }
    if (b === null || b === undefined) {
      return 1;
    }

    return a - b;
  };

  const columns: ColumnDef<TableData>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={`w-full justify-start font-semibold text-[15px] mb-1 ${column.getIsSorted() ? "text-indigo-600" : "text-black"}`}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center justify-left min-h-[2.6em]">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer mr-2 flex-shrink-0">
                  <ExternalLink
                    size={16}
                    className="text-current hover:text-indigo-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(
                        `/lead/${interviewId}?response_id=${row.original.response_id}`,
                        "_blank",
                      );
                    }}
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-gray-500 text-white font-normal"
              >
                View Response
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="truncate">{row.getValue("name")}</span>
        </div>
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId) as string;
        const b = rowB.getValue(columnId) as string;

        return a.toLowerCase().localeCompare(b.toLowerCase());
      },
    },
    {
      accessorKey: "fit_score",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={`w-full justify-start font-semibold text-[15px] mb-1 ${column.getIsSorted() ? "text-indigo-600" : "text-black"}`}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fit Score
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="min-h-[2.6em] flex items-center justify-center">
          {row.getValue("fit_score") ?? "-"}
        </div>
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId) as number | null;
        const b = rowB.getValue(columnId) as number | null;

        return customSortingFn(a, b);
      },
    },
    {
      accessorKey: "engagement_score",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={`w-full justify-start font-semibold text-[15px] mb-1 ${column.getIsSorted() ? "text-indigo-600" : "text-black"}`}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Engagement Score
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="min-h-[2.6em] flex items-center justify-center">
          {row.getValue("engagement_score") ?? "-"}
        </div>
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId) as number | null;
        const b = rowB.getValue(columnId) as number | null;

        return customSortingFn(a, b);
      },
    },
    {
      accessorKey: "lead_sentiment",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={`w-full justify-start font-semibold text-[15px] mb-1 ${column.getIsSorted() ? "text-indigo-600" : "text-black"}`}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Lead Sentiment
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="min-h-[2.6em] flex items-center justify-center">
          {row.getValue("lead_sentiment") === "Negative" ? (
            <div className=" h-full bg-red-500 rounded-sm text-white"><span>Negative</span></div>
          ) : row.getValue("lead_sentiment") === "Neutral" ? (
            <div className=" h-full bg-yellow-500 rounded-sm text-white"><span>Neutral</span></div>
          ) : row.getValue("lead_sentiment") === "Positive" ? (
            <div className=" h-full bg-green-500 rounded-sm text-white"><span>Positive</span></div>
          ) : (
            <div className=" h-full bg-gray-400 rounded-sm" >-</div>
          )}
        </div>
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId) as string;
        const b = rowB.getValue(columnId) as string;

        return a.toLowerCase().localeCompare(b.toLowerCase());
      },
    },
    {
      accessorKey: "summary",
      header: () => (
        <div className="w-full justify-start font-semibold text-[15px] mb-1 text-black">
          Summary
        </div>
      ),
      cell: ({ row }) => {
        const summary = row.getValue("summary") as string;

        return (
          <div className="text-xs text-justify pr-4">
            <div
              className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${
                  hoveredRowId === row.id
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-[2.6em] line-clamp-2 opacity-90"
                }
              `}
            >
              {summary}
            </div>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-center">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              onMouseEnter={() => handleMouseEnter(row.id)}
              onMouseLeave={handleMouseLeave}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="text-justify align-top py-2"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
