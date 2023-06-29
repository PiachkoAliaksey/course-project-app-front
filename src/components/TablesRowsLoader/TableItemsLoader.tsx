import React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Skeleton } from "@mui/material";
import "../Table/Table.scss";



export const TableItemLoader:React.FC<{rowsNum:number}> = ({ rowsNum }) => {
  return (
    <>
    {[...Array(rowsNum)].map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton animation="wave" variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton animation="wave" variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton animation="wave" variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton animation="wave" variant="text" />
        </TableCell>
      </TableRow>
    ))}
    </>


  );
};
