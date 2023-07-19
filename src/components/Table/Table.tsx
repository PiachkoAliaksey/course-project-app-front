import React from "react";
import { useDispatch, useSelector } from 'react-redux';

import { Link } from 'react-router-dom';
import { RootState } from 'redux/store';

import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Checkbox } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';

import { IUser } from "../../pages/AdminPanel/AdminPanel";

interface ITable {
  _id: string,
  fullName: string
  email: string
  createdAt: string
  updatedAt: string
  status: string,
  position: string,
  index: number,
  isCheck: string[],
  setIsCheck: React.Dispatch<React.SetStateAction<string[]>>
}


export const UsersTable: React.FC<ITable> = ({ setIsCheck, isCheck, index, _id, fullName, email, createdAt, updatedAt, status, position }) => {
  const userData: { data: IUser, status: string } = useSelector((state: RootState) => state.auth.userData);
  const isAuth = Boolean(userData.data);

  const handlerChangeCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    if (e.target.checked) {
      setIsCheck([...isCheck, id])
    } else {
      setIsCheck(isCheck.filter(item => item !== id));
    }
  }

  return (
    <TableRow key={uuidv4()}>
      <TableCell component="th" scope="row">
        <Checkbox id={_id} checked={isCheck.includes(_id)} onChange={handlerChangeCheckBox} />
      </TableCell>
      <TableCell ><Link to={`/collection/${_id}`}>{fullName}</Link></TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{position}</TableCell>
      <TableCell>{status}</TableCell>
    </TableRow>
  )
}
