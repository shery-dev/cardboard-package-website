import React from "react";

const TableContainer = (props) => {
  return (
    <div className=" flex justify-start items-start flex-col gap-4 w-full px-4 py-2 bg-white shadow-sm rounded-lg">
      <div>
        <h2 className=" text-2xl font-bold text-gray-800">{props.heading}</h2>
      </div>
      <div className=" w-full">{props.table}</div>
    </div>
  );
};

export default TableContainer;
