import React from 'react';
import { useTranslation } from "react-i18next";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "redux/store";
import { useForm } from "react-hook-form";
import { fetchRegister } from '../../redux/slices/auth';
import { Navigate } from "react-router-dom";

import './Registration.scss';

export const Registration: React.FC = () => {
  const { i18n, t } = useTranslation();
  const isAuth = useSelector((state: RootState) => Boolean(state.auth.userData.data))
  const dispatch: ThunkDispatch<{fullName: string }, void, AnyAction> = useDispatch();
  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    defaultValues: {
      email: '',
      password: '',
      fullName: ''
    },
    mode: 'onSubmit'
  })

  const onSubmit = async (values: { email: string, password: string, fullName: string }) => {
    console.log(values);
    const data = await dispatch(fetchRegister(values));
    console.log(data);
    if (!data.payload) {
      return alert('Not available registration, user already exist')
    }
    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token)
    }
  }

  if (isAuth) {
    return <Navigate to='/'></Navigate>
  }

  return (
    <Paper classes={{ root: "registration-bar" }}>
      <Typography classes={{ root: "registration-title" }} variant="h5">
      {t("createaccount")}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName', { required: t("writefullName") })} className="registration-field" label={t("fullname")} fullWidth />
        <TextField type='email' error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', { required: t("writeEmail") })} className="registration-field" label={t("eMail")} fullWidth />
        <TextField type='password' error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: t("writePassword") })} className="registration-field" label={t("password")} fullWidth />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Registration
        </Button>
      </form>
    </Paper>
  );
};
