import { createSlice, createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { IItem } from './item';
import { instance } from '../../constant/apiConfig';



export const fetchUserAllCollectionItem = createAsyncThunk('collection/fetchUserAllCollectionItem', async (id: string) => {
  const { data } = await instance.get(`/collection/items/${id}`);
  return data;
})

export const getFiveLastItem = createAsyncThunk('collection/getFiveLastItem', async () => {
  const { data } = await instance.get('/lastFive');
  return data;
})

export const fetchCloudTags = createAsyncThunk('posts/fetchCloudTags', async () => {
  const { data } = await instance.get('/tags');
  return data;
})

export const fetchDeleteCollectionItem = createAsyncThunk('collection/fetchDeleteCollectionItem', async (index:string) => {
  return await instance.delete(`/collection/items/delete/${index}`);

})

export const fetchEditCollectionItem = createAsyncThunk('collection/fetchEditCollectionItem', async ({ idItem, title, tags, collectionName }: { idItem: string, title: string, tags: string[], collectionName: string }) => {
  const { data } = await instance.patch(`/collection/items/update/${idItem}`, { 'title': title, 'tags': tags, 'collectionName': collectionName });
  return data;
})



interface IInitialState {
  items: {
    allCollectionItems: IItem[] | [],
    status: string
  },
  allTags: {
    tags: string[],
    status: string,
  }
}
const initialState = {
items:{
  allCollectionItems: [],
  status: 'loading'

},
allTags:{
  tags: [],
    status: 'loading',
}


} as IInitialState;

const allCollectionItemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserAllCollectionItem.pending, (state) => {
      state.items.allCollectionItems = [];
      state.items.status = 'loading';
    })
    builder.addCase(fetchUserAllCollectionItem.fulfilled, (state, action) => {
      state.items.allCollectionItems = action.payload
      state.items.status = 'loaded';
    })
    builder.addCase(fetchUserAllCollectionItem.rejected, (state) => {
      state.items.allCollectionItems = [];
      state.items.status = 'error';
    })
    builder.addCase(getFiveLastItem.pending, (state) => {
      state.items.allCollectionItems = [];
      state.items.status = 'loading';
    })
    builder.addCase(getFiveLastItem.fulfilled, (state, action) => {
      state.items.allCollectionItems = action.payload
      state.items.status = 'loaded';
    })
    builder.addCase(getFiveLastItem.rejected, (state) => {
      state.items.allCollectionItems = [];
      state.items.status = 'error';
    })
    builder.addCase(fetchDeleteCollectionItem.pending, (state) => {
      state.items.allCollectionItems = [];
      state.items.status = 'loading';
    })
    builder.addCase(fetchDeleteCollectionItem.fulfilled, (state, action) => {
      const { arg } = action.meta;
      if (arg) {
        state.items.allCollectionItems = state.items.allCollectionItems.filter((obj) => {
          obj._id !== arg
        });
      }
      state.items.status = 'loaded';
    })
    builder.addCase(fetchDeleteCollectionItem.rejected, (state) => {
      state.items.allCollectionItems = [];
      state.items.status = 'error';
    })
    builder.addCase(fetchEditCollectionItem.pending, (state) => {
      state.items.allCollectionItems = [];
      state.items.status = 'loading';
    })
    builder.addCase(fetchEditCollectionItem.fulfilled, (state, action) => {
      const { arg: { idItem, title, tags } } = action.meta
      if (idItem) {
        const toggleElement = state.items.allCollectionItems.find(val => val._id === idItem);
        if (toggleElement) {
          toggleElement.title = title;
          toggleElement.tags = tags;
        }
      }
      state.items.status = 'loaded'
    })
    builder.addCase(fetchEditCollectionItem.rejected, (state) => {
      state.items.allCollectionItems = [];
      state.items.status = 'error';
    })
    builder.addCase(fetchCloudTags.pending, (state) => {
      state.allTags.tags = [];
      state.allTags.status = 'loading';
    })
    builder.addCase(fetchCloudTags.fulfilled, (state, action) => {
      state.allTags.tags = action.payload
      state.allTags.status = 'loaded';
    })
    builder.addCase(fetchCloudTags.rejected, (state) => {
      state.allTags.tags = [];
      state.allTags.status = 'error';
    })


  }
})

export const allCollectionItemsReducer = allCollectionItemsSlice.reducer;
