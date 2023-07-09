import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from 'uuid';

import { ListItem, List, Typography } from '@mui/material';
import Paper from "@mui/material/Paper";
import Grid from '@mui/material/Grid';

import {IItem} from '../../redux/slices/item';
import { ButtonGoBack } from '../../form/ButtonGoBack';

import './SearchPageItems.scss'

interface ISearchPageItems {
  list: { _id: string, title: string }[],
  listByComments:{ _id: string, title: string }[],
  listByCollection:{ _id: string, title: string }[]

}

export const SearchPageItems: React.FC<ISearchPageItems> = ({ list,listByComments,listByCollection }) => {
  const { i18n, t } = useTranslation();

  return (
    <>
      <ButtonGoBack />
      <Typography variant='h5' sx={{ paddingBottom: '20px' }}>{t("searchResult")}</Typography>
      <List>
        {list.length>0||listByComments.length>0||listByCollection.length>0?([...list,...listByComments,...listByCollection].map((item, index) => <Paper sx={{ marginBottom: '10px' }} key={uuidv4()}><Link className='link-searched-item' to={`/collection/items/item/${item._id}`}><ListItem key={index} sx={{ color: 'text.primary' }} >{item.title}</ListItem></Link></Paper>)):(<Grid container><Grid item xs={12} sx={{textAlign:'center'}}><Typography variant='h5'>{t("sorry")}!</Typography></Grid></Grid>)}
      </List>
    </>
  )
}

