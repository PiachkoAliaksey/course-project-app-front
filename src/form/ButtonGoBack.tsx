import React from 'react';


import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { useTranslation } from "react-i18next";




export const ButtonGoBack:React.FC = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Button sx={{marginBottom:'20px'}} variant="contained" onClick={()=>navigate('/')}>{t("goBack")}</Button>
  )
}
