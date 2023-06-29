import React, { useState, SetStateAction, Dispatch } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Checkbox } from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import { v4 as uuidv4 } from 'uuid';

interface ITable {
  _id: string,
  fullName: string
  email: string
  createdAt: string
  updatedAt: string
  status: string,
  position:string,
  index:number,
  isCheck:string[],
  setIsCheck:React.Dispatch<React.SetStateAction<string[]>>
}


export const UsersTable: React.FC<ITable> = ({setIsCheck,isCheck,index, _id, fullName, email, createdAt, updatedAt, status,position }) => {

  const handlerChangeCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    if (e.target.checked) {
      setIsCheck([...isCheck,id])
    } else {
      setIsCheck(isCheck.filter(item => item !== id));
    }
  }

  return (
    <TableRow key={uuidv4()}>
      <TableCell component="th" scope="row">
      <Checkbox  id={_id} checked={isCheck.includes(_id)}  onChange={handlerChangeCheckBox} />
      </TableCell>
      <TableCell>{fullName}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{position}</TableCell>
      <TableCell>{status}</TableCell>
    </TableRow>
  )
}
