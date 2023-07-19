import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from 'react-redux';
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "redux/store";
import { useForm } from "react-hook-form";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { fetchRegister } from '../../redux/slices/auth';
import { Navigate } from "react-router-dom";

import './Registration.scss';

export const Registration: React.FC = () => {
  const { i18n, t } = useTranslation();
  const isAuth = useSelector((state: RootState) => Boolean(state.auth.userData.data))
  const dispatch: ThunkDispatch<{ fullName: string }, void, AnyAction> = useDispatch();
  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    defaultValues: {
      email: '',
      password: '',
      fullName: ''
    },
    mode: 'onSubmit'
  })
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onSubmit = async (values: { email: string, password: string, fullName: string }) => {
    const data = await dispatch(fetchRegister(values));
    if (!data.payload) {
      setOpen(true)
    }
    if (data.payload && 'token' in data.payload) {
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
        <DialogTitle id="alert-dialog-title">
          {t("notAvailableRegistration")}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Paper classes={{ root: "registration-bar" }}>
        <Typography classes={{ root: "registration-title" }} variant="h5">
          {t("createaccount")}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField error={Boolean(errors.fullName?.message)}
            helperText={errors.fullName?.message}
            {...register('fullName', { required: t("writefullName") })}
            className="registration-field" label={t("fullname")}
            fullWidth />
          <TextField type='email' error={Boolean(errors.email?.message)}
            helperText={errors.email?.message}
            {...register('email', { required: t("writeEmail") })}
            className="registration-field" label={t("eMail")}
            fullWidth />
          <TextField
            type={showPassword ? 'text' : 'password'}
            error={Boolean(errors.password?.message)}
            helperText={errors.password?.message}
            {...register('password', { required: t("writePassword") })}
            className="registration-field" label={t("password")}
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
          <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
            Registration
          </Button>
        </form>
      </Paper>
    </>
  );
};
