"use client";

import TableContainer from "@/components/Dashboard/TableContainer/TableContainer";
import OrdersTable from "@/components/Dashboard/Tables/OrdersTable";

const page = () => {
  return (
    <div className="flex justify-start items-start flex-col gap-4 py-8 px-4">
      <TableContainer
        heading={"Order List"}
        table={<OrdersTable />}
      />
    </div>
  );
};
export default page;
