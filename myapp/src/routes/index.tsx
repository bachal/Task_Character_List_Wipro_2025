import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchCharacterList } from "../api/queris";
import type { Character } from "../types/characterTypes";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

// 🛣️ Define the route for "/" using TanStack Router
export const Route = createFileRoute("/")({
  component: Index,
});

type pageNumber = number;

// 🧱 Initialize column helper for Character type
const columnHelper = createColumnHelper<Character>();
const columns = [
  columnHelper.accessor((row) => row.name, {
    id: "name",
    cell: (info) => {
      const row = info.row.original;
      return (
        <a href={`/character/${row.id.toString()}`} target="_blank">
          {info.getValue()}
        </a>
      );
    },
    header: () => <span>Name</span>,
  }),
];

function Index() {
  const [pageNumber, setPageNumber] = useState<pageNumber>(1);
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["characterList", pageNumber],
    queryFn: () => fetchCharacterList(pageNumber),
  });

  // 📋 Initialize TanStack Table with data & pagination config
  const table = useReactTable({
    data: data?.results ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: data?.info?.pages ?? -1,
    state: {
      pagination: {
        pageIndex: pageNumber - 1,
        pageSize: 20,
      },
    },
  });
  if (isPending) return <div className="commonText">Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data found.</div>;

  return (
    <>
      <div className="characterContainer">
        <div className="charaterHeading">
          <div>
            <h1>
              <u>Rick & Morty Character List</u>
            </h1>
          </div>
          <div>
            {/*Button for refresh */}
            <button onClick={() => refetch()} className="refreshbutton">
              Refresh
            </button>
          </div>
        </div>
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <div>
            <button
              onClick={() => setPageNumber((prev) => prev - 1)}
              disabled={pageNumber <= 1}
              className="prevNextbutton"
            >
              Prev
            </button>
          </div>
          <div>{pageNumber}</div>
          <div>
            <button
              onClick={() => setPageNumber((prev) => prev + 1)}
              disabled={!data.info?.next}
              className="prevNextbutton"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
