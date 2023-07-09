import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FormControlLabel from '@mui/material/FormControlLabel';
import { Box, Button, Checkbox } from "@mui/material";
import { Navigate } from "react-router-dom";
import { RootState } from 'redux/store';
import { fetchUsersTable, fetchDeleteUser, fetchStatusStatusUser, fetchAccess } from '../../redux/slices/usersTable';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { TableRowsLoader } from '../../components/TablesRowsLoader/TablesRowsLoader';
import { UsersTable } from '../../components/Table/Table';
import { logout } from '../../redux/slices/auth';


export interface IUser {
  _id: string,
  fullName: string,
  email: string,
  password: string,
  status: string,
  position: string,
  createdAt: string,
  updatedAt: string,
  __v: number
}



export const AdminPanel: React.FC = () => {
  const { i18n, t } = useTranslation();

  const dispatch: ThunkDispatch<IUser[], void, AnyAction> = useDispatch();
  const userData: IUser = useSelector((state: RootState) => state.auth.userData.data)
  const isAuth = Boolean(userData) && Boolean(userData.status !== 'blocked') && Boolean(userData.position === 'admin');

  const { items, status }: { items: IUser[], status: string } = useSelector((state: RootState) => state.users.users)
  const isTableUsersLoading = status === 'loading';

  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState<string[]>([]);

  const handlerCheckAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(items.map(li => li._id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  }

  const handlerDeleteUser = (arrId: string[]) => {
    if (arrId.length) {
      arrId.forEach(async(user) => {
        await dispatch(fetchDeleteUser(user));
        if (userData._id === user) {
          dispatch(logout());
          window.localStorage.removeItem('token');
        }

      })
    }
  }

  const handlerBlockUser = (arrId: string[], status = 'blocked') => {
    if (arrId.length) {
      arrId.forEach(async (user) => {
        await dispatch(fetchStatusStatusUser({ user, status }));
        if (userData._id === user) {
          dispatch(logout());
          window.localStorage.removeItem('token');
        }

      })
    }
  }

  const handlerActiveUser = (arrId: string[], status = 'active') => {
    if (arrId.length) {
      arrId.forEach(async(user) => {
        await dispatch(fetchStatusStatusUser({ user, status }));
      })
    }
  }

  const handlerAdminAccess = (arrId: string[], position = 'admin') => {
    if (arrId.length) {
      arrId.forEach(async(user) => {
        await dispatch(fetchAccess({ user, position }));
      })
    }
  }
  const handlerUserAccess = (arrId: string[], position = 'user') => {
    if (arrId.length) {
      arrId.forEach(async(user) => {
        await dispatch(fetchAccess({ user, position }));
      })
      setTimeout(()=>window.location.reload(),1000)
    }
  }

  useEffect(() => {
      dispatch(fetchUsersTable())
  }, [])
  useEffect(() => {
    if (isTableUsersLoading) {
      dispatch(fetchUsersTable())
    }
  }, [items])



  if (!isAuth) {
    return <Navigate to='/'></Navigate>
  }

  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <Button
          onClick={() => handlerDeleteUser(isCheck)}
          variant="outlined"
          sx={{ marginBottom: "10px", marginRight: "10px" }}
        >
          {t("btndelete")}
        </Button>
        <Button
          onClick={() => handlerBlockUser(isCheck)}
          variant="outlined"
          sx={{ marginBottom: "10px", marginRight: "10px" }}
        >
          {t("btnblock")}
        </Button>
        <Button
          onClick={() => handlerActiveUser(isCheck)}
          variant="outlined"
          sx={{ marginBottom: "10px", marginRight: "10px" }}
        >
          {t("btnunblock")}
        </Button>
        <Button
          onClick={() => handlerAdminAccess(isCheck)}
          variant="outlined"
          sx={{ marginBottom: "10px", marginRight: "10px" }}
        >
          {t("adminaccess")}
        </Button>
        <Button
          onClick={() => handlerUserAccess(isCheck)}
          variant="outlined"
          sx={{ marginBottom: "10px" }}
        >
          {t("useraccess")}
        </Button>

      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell ><Checkbox checked={isCheckAll} onChange={handlerCheckAllCheckbox} /> {t("checkbox")}</TableCell>
              <TableCell >{t("fullname")}</TableCell>
              <TableCell >{t("eMail")}</TableCell>
              <TableCell >{t("position")}</TableCell>
              <TableCell >{t("status")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isTableUsersLoading ? (
              <TableRowsLoader rowsNum={6} />
            ) : (
              items.map((user: IUser, i) => (
                <UsersTable
                  key={uuidv4()}
                  isCheck={isCheck}
                  setIsCheck={setIsCheck}
                  index={i}
                  _id={user._id}
                  fullName={user.fullName}
                  email={user.email}
                  createdAt={user.createdAt}
                  updatedAt={user.updatedAt}
                  status={user.status}
                  position={user.position}
                />
              )
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>

  );
};
