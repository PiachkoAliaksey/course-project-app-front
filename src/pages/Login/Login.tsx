import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { Navigate } from "react-router-dom";
import { AnyAction } from "redux";
import { fetchUserData } from "../../redux/slices/auth";
import { RootState } from "redux/store";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import "./Login.scss";

export const Login: React.FC = () => {
  const { i18n, t } = useTranslation();
  const isAuth = useSelector((state: RootState) => Boolean(state.auth.userData.data) && state.auth.userData.data.status !== 'blocked')
  const dispatch: ThunkDispatch<{ email: string, password: string }, void, AnyAction> = useDispatch();
  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange'
  })
  const [open, setOpen] = React.useState(false);
  const [notCorrectData, setNotCorrectData] = useState(false);
  const [statusBlocked, setStatusBlocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (values: { email: string, password: string }) => {
    const data = await dispatch(fetchUserData(values));
    if (!data.payload) {
      setNotCorrectData(true);
      setOpen(true);
    }

    if (data.payload.status === 'blocked') {
      setStatusBlocked(true);
      setOpen(true);
    }

    if ('token' in data.payload && data.payload.status !== 'blocked') {
      window.localStorage.setItem('token', data.payload.token)
    }
  }

  if (isAuth) {
    return <Navigate to='/'></Navigate>
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {statusBlocked && (<DialogTitle id="alert-dialog-title">
          {t("userIsBlocked")}
        </DialogTitle>)}
        {notCorrectData && (<DialogTitle id="alert-dialog-title">
          {t("pleaseWriteFullNameOrPasswordCorrect")}
        </DialogTitle>)}
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Paper classes={{ root: "login-bar" }}>
        <Typography classes={{ root: "login-title" }} variant="h5">
          {t("enterToAccount")}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            className="field"
            label={t("eMail")}
            type='email'
            error={Boolean(errors.email?.message)}
            {...register('email', { required: 'Email' })}
            fullWidth
          />
          <TextField className="field" label={t("password")}
            type={showPassword ? 'text' : 'password'}
            error={Boolean(errors.password?.message)}
            {...register('password', { required: 'Password' })}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            fullWidth />
          <Button type="submit" size="large" variant="contained" fullWidth>
            {t("enter")}
          </Button>
        </form>
      </Paper>
    </>
  );
};
