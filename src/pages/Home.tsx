import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { RootState } from 'redux/store';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import Box from '@mui/material/Box';

import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from "react-i18next";

import Paper, { Button, ListItem } from '@mui/material/';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';



import { getFiveLastItem } from '../redux/slices/allCollectionItems';
import { fetchCloudTags } from '../redux/slices/allCollectionItems';
import { fetchUserLargestCollection } from '../redux/slices/allCollections';
import { IItem } from '../redux/slices/item';
import { ICollection } from '../redux/slices/collection';
import { SkeletonListLoader } from '../components/TablesRowsLoader/SkeletonListLoader';
import { SkeletonListFiveLargestCollection } from '../components/TablesRowsLoader/SkeletonListFiveLargestCollection';
import './Home.scss';


export interface IUser {
  _id: string,
  fullName: string,
  createdAt: string,
  updatedAt: string,
  __v: number
}


export const Home: React.FC = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const dispatch: ThunkDispatch<IItem[], void, AnyAction> = useDispatch();
  const userData: { data: IUser, status: string } = useSelector((state: RootState) => state.auth.userData);
  const { items, allTags } = useSelector((state: RootState) => state.items);
  const collectionsData: ICollection[] = useSelector((state: RootState) => state.collections.allCollections.items);
  const isLoadedCollections = Boolean(collectionsData);
  const isLoadedItemsData = Boolean(items.allCollectionItems);

  const isLoadedTags = Boolean(allTags.tags);
  const isLoadingUser = userData.status === 'loading';
  const isAuth = Boolean(userData.data);


  useEffect(() => {
    isLoadedItemsData && dispatch(getFiveLastItem());

  }, [isLoadedItemsData])

  useEffect(() => {
    isLoadedTags && dispatch(fetchCloudTags());
  }, [isLoadedTags])

  useEffect(() => {
    isLoadedCollections && dispatch(fetchUserLargestCollection());
  }, [isLoadedCollections])

  return (
    <Grid container spacing={4}>
      <Grid xs={12} item>
        <List classes={{ root: 'list-of-tags' }}>
          {isLoadedTags && allTags.tags.map((tag: string[]) => <Link key={uuidv4()} className='link-tag' to={`/search/${tag.slice(1)}`}><ListItemButton sx={{ color: 'text.primary',borderRadius:'5px' }} key={uuidv4()}>{tag}</ListItemButton></Link>)}
        </List>
      </Grid>
      <Grid classes={{ root: 'main-container-items-collections' }} xs={12} item>
        <Box sx={{ padding: '10px', borderRadius: '5px', boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px', marginBottom: '10px' }}>
          <Typography classes={{ root: 'title-main-container-items-collections' }} variant='h5'>{t("listLastItems")}</Typography>
          <List>
            <ListItem>
              <Grid container classes={{ root: 'title-list-five-last-items' }}>
                <Grid item xs={4}>{t("titleItem")}</Grid>
                <Grid item xs={4}>{t("collection")}</Grid>
                <Grid item xs={4}>{t("user")}</Grid>
              </Grid>
            </ListItem>
            {isLoadedItemsData ? (items.allCollectionItems.map((obj: IItem) =>
              <Link key={obj._id} className='link-item-last-five' to={`/collection/items/item/${obj._id}`}>
                <ListItemButton sx={{ color: 'text.primary',borderRadius:'5px' }} >
                  <Grid container spacing={0.5}>
                    <Grid classes={{ root: 'last-added-item' }} item xs={4}>{obj.title}</Grid>
                    <Grid classes={{ root: 'last-added-item' }} item xs={4}>{obj.collectionName}</Grid>
                    <Grid classes={{ root: 'last-added-item' }} item xs={4}>{obj.user}</Grid>
                  </Grid>
                </ListItemButton>
              </Link>)) : (<SkeletonListLoader rowsNum={5} />)}
          </List>
        </Box>
        <Box sx={{ padding: '10px', borderRadius: '5px', boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px' }}>
          <Typography classes={{ root: 'title-main-container-items-collections' }} variant='h5'>{t("listLargestCollection")}</Typography>
          <List >
            {isLoadedCollections ? (collectionsData.map((obj) => <ListItem classes={{ root: 'last-added-item' }} key={uuidv4()}>{obj.title}</ListItem>)) : (<SkeletonListFiveLargestCollection itemNum={5} />)}
          </List>
        </Box>
      </Grid>
    </Grid>
  );
};
