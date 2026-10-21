"use client";
import TableContainer from "@/components/Dashboard/TableContainer/TableContainer";
import OrderDetailsTable from "@/components/Dashboard/Tables/OrderDetailsTable";

const page = () => {
  return (
    <div className="flex justify-start items-start flex-col gap-4 py-8 px-4">
      <TableContainer
        heading={"Order Details"}
        table={<OrderDetailsTable />}
      />
    </div>
  );
};
export default page;
