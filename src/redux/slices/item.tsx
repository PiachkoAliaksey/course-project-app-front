import { createSlice, createAsyncThunk, AsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { instance } from '../../constant/apiConfig';



export interface IItem {
  title: string,
  tags: string[],
  collectionName: string,
  user: string,
  _id: string,
  usersLike: [],
  createdAt: string,
  updatedAt: string,
  __v: number
}

interface IInitialState {
  itemCollection: {
    item: IItem | {},
    status: string
  },
  likesItemCollection: {
    likes: string[],
    status: string
  }

}


export const fetchUserCollectionItem = createAsyncThunk('collection/fetchUserCollectionItem', async (params: { title: string, tags: string[], collectionName: string,idUser:string }) => {
  const { data } = await instance.post('/collection/items', params);
  return data;
})
export const getUserCollectionItem = createAsyncThunk('collection/getUserCollectionItem', async (id: string) => {
  const { data } = await instance.get(`/collection/items/item/${id}`);
  return data;
})

export const getLikesItem = createAsyncThunk('collection/getLikesItem', async (id: string) => {
  const { data } = await instance.get(`/collection/items/item/likes/${id}`);
  return data;
})
export const fetchUserLike = createAsyncThunk('collection/fetchUserLike', async ({ idItem, idUser, isLiked }: { idItem: string | undefined, idUser: string, isLiked: boolean }) => {
  const { data } = await instance.patch(`/collection/items/item/like/${idItem}`, { 'idUser': idUser, 'isLiked': isLiked });
  return data;
})


const initialState = {
  itemCollection: {
    item: {},
    status: 'loading'
  },
  likesItemCollection: {
    likes: [],
    status: 'loading'
  }


} as IInitialState;

const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserCollectionItem.pending, (state) => {
      state.itemCollection.item = {};
      state.itemCollection.status = 'loading';
    })
    builder.addCase(fetchUserCollectionItem.fulfilled, (state, action) => {
      state.itemCollection.item = action.payload
      state.itemCollection.status = 'loaded'
    })
    builder.addCase(fetchUserCollectionItem.rejected, (state) => {
      state.itemCollection.item = {};
      state.itemCollection.status = 'error'
    })
    builder.addCase(getUserCollectionItem.pending, (state) => {
      state.itemCollection.item = {};
      state.itemCollection.status = 'loading';
    })
    builder.addCase(getUserCollectionItem.fulfilled, (state, action) => {
      state.itemCollection.item = action.payload
      state.itemCollection.status = 'loaded'
    })
    builder.addCase(getUserCollectionItem.rejected, (state) => {
      state.itemCollection.item = {};
      state.itemCollection.status = 'error'
    })
    builder.addCase(fetchUserLike.pending, (state) => {
      state.likesItemCollection.likes = [];
      state.likesItemCollection.status = 'loading';
    })
    builder.addCase(fetchUserLike.fulfilled, (state, action) => {
      const { arg: { idItem, idUser, isLiked } } = action.meta
      if (idItem && idUser) {
          isLiked ? (state.likesItemCollection.likes.push(idUser)) : (state.likesItemCollection.likes = state.likesItemCollection.likes.filter(val => val !== idUser) )

      }
      state.likesItemCollection.status = 'loaded'
    })
    builder.addCase(fetchUserLike.rejected, (state) => {
      state.likesItemCollection.likes = [];
      state.likesItemCollection.status = 'error'
    })

    builder.addCase(getLikesItem.pending, (state) => {
      state.likesItemCollection.likes = [];
      state.likesItemCollection.status = 'loading';
    })
    builder.addCase(getLikesItem.fulfilled, (state, action) => {
      state.likesItemCollection.likes = action.payload
      state.likesItemCollection.status = 'loaded'
    })
    builder.addCase(getLikesItem.rejected, (state) => {
      state.likesItemCollection.likes = [];
      state.likesItemCollection.status = 'error'
    })

  }
})

export const itemReducer = itemSlice.reducer;
