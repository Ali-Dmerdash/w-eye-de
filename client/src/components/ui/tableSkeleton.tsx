import React from "react";

interface TableSkeletonProps {
    columns: number;
    rows?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ columns, rows = 3 }) => {
    return (
        <div className="flex-grow text-xs text-left font-mulish animate-pulse">
            <table className="w-full">
                <thead>
                    <tr className="text-gray-400 uppercase border-b-[1px] border-[#56577A]">
                        {Array.from({ length: columns }).map((_, colIdx) => (
                            <th key={colIdx} className="py-3 text-center">
                                <div className="h-3 bg-gray-700 rounded w-3/4 mx-auto" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="text-white">
                    {Array.from({ length: rows }).map((_, rowIdx) => (
                        <tr
                            key={rowIdx}
                            className="border-b-[1px] border-[#56577A] hover:bg-gray-800/20"
                        >
                            {Array.from({ length: columns }).map((_, colIdx) => (
                                <td key={colIdx} className="py-5 text-center">
                                    <div className="h-3 bg-gray-700 rounded w-2/3 mx-auto" />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableSkeleton;
