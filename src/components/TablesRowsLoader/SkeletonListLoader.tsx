import React from "react";

import { Skeleton } from "@mui/material";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import "../Table/Table.scss";



export const SkeletonListLoader: React.FC<{ rowsNum: number }> = ({ rowsNum }) => {
  return (
    <>
      {[...new Array(rowsNum)].map((_, index) =>{
        return (<ListItemButton >
          <Grid container>
            <Grid item xs={4}><Skeleton width='70px' animation="wave" variant="text" /></Grid>
            <Grid item xs={4}><Skeleton width='70px' animation="wave" variant="text" /></Grid>
            <Grid item xs={4}><Skeleton width='70px' animation="wave" variant="text" /></Grid>
          </Grid>
        </ListItemButton>)
      })
        }
    </>


  );
};



