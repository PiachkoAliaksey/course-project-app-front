import React from "react";

import { Skeleton } from "@mui/material";
import ListItem from '@mui/material/ListItem';
import "../Table/Table.scss";



export const SkeletonSearchByTags: React.FC<{ itemNum: number }> = ({ itemNum }) => {
  return (
    <>
      {[...new Array(itemNum)].map((_, index) => {
        return (<ListItem >
          <Skeleton width='120px' animation="wave" variant="text" />
        </ListItem>)
      })
      }
    </>


  );
};
