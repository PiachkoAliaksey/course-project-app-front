import React, { useState, useEffect, SyntheticEvent } from 'react';
import { io, Socket } from 'socket.io-client'
import { useParams } from "react-router-dom";
import { AnyAction } from "redux";
import { RootState } from "redux/store";
import { ThunkDispatch } from "redux-thunk";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from "react-i18next";


import { ListItem, List, Typography, Paper, Button } from '@mui/material';

import { IUser } from '../../pages/AdminPanel/AdminPanel';
import { IItem } from '../../redux/slices/item';
import { getAllMatchItems } from '../../redux/slices/allCollectionItems';
import { SkeletonSearchByTags } from '../../components/TablesRowsLoader/SkeletonSearchTags';
import { ButtonGoBack } from '../../form/ButtonGoBack';

import './SearchPage.scss';


export const SearchPage = () => {
  const { i18n, t } = useTranslation();
  const { tag } = useParams();

  const dispatch: ThunkDispatch<Object[] | Object, void, AnyAction> = useDispatch();
  const userData: IUser = useSelector((state: RootState) => state.auth.userData.data);
  const { items, allTags } = useSelector((state: RootState) => state.items);
  const isLoadedItemsData = Boolean(items.allCollectionItems);
  const isAuth = Boolean(userData);

  useEffect(() => {
    tag && dispatch(getAllMatchItems(tag));

  }, [tag])

  return (
    <>
      <ButtonGoBack />
      <Typography variant='h5' sx={{ paddingBottom: '20px' }}>{`${t("searchResultByTag")} #${tag}`}:</Typography>
      <List>
        {isLoadedItemsData ? (items.allCollectionItems.map((item: IItem) => <Paper key={item._id} sx={{ marginBottom: '10px' }}><Link className='link-item-by-tags' to={`/collection/items/item/${item._id}`}><ListItem key={item._id} sx={{ color: 'text.primary' }} >{item.title}</ListItem></Link></Paper>)) : (<SkeletonSearchByTags itemNum={5} />)}
      </List>
    </>
  )
}

