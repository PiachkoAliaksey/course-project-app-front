import { createSlice, createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit';
import { IItem } from './item';
import { instance } from '../../constant/apiConfig';

interface IInitialState {
  items: {
    allCollectionItems: IItem[] | [],
    status: string
  },
  allTags: {
    tags: string[],
    status: string,
  },
  customFields: {
    fields: { customFieldName: string }[],
    status: string
  }
}


export const fetchUserAllCollectionItem = createAsyncThunk('collection/fetchUserAllCollectionItem', async (id: string) => {
  const { data } = await instance.get(`/collection/items/${id}`);
  return data;
})

export const getFiveLastItem = createAsyncThunk('collection/getFiveLastItem', async () => {
  const { data } = await instance.get('/lastFive');
  return data;
})

export const fetchCloudTags = createAsyncThunk('collection/fetchCloudTags', async () => {
  const { data } = await instance.get('/tags');
  return data;
})

export const fetchDeleteCollectionItem = createAsyncThunk('collection/fetchDeleteCollectionItem', async (index: string) => {
  return await instance.delete(`/collection/items/delete/${index}`);

})

export const fetchEditCollectionItem = createAsyncThunk('collection/fetchEditCollectionItem', async ({ idItem, title, tags, collectionName }: { idItem: string, title: string, tags: string[], collectionName: string }) => {
  const { data } = await instance.patch(`/collection/items/update/${idItem}`, { 'title': title, 'tags': tags, 'collectionName': collectionName });
  return data;
})

export const getAllMatchItems = createAsyncThunk('collection/getAllMatchItems', async (tag: string) => {
  const { data } = await instance.get(`/search/items/${tag}`);
  return data;
})

export const fetchSearchItems = createAsyncThunk('collection/fetchSearchItems', async (searchResult: string) => {
  const { data } = await instance.get(`/search?searchText=${searchResult}`);
  return data;
})

export const fetchSearchItemsByComments = createAsyncThunk('collection/fetchSearchItemsByComments', async (searchResult: string) => {
  const { data } = await instance.get(`/searchByComments?searchText=${searchResult}`);
  return data;
})

export const fetchSearchItemsByCollection = createAsyncThunk('collection/fetchSearchItemsByCollection', async (searchResult: string) => {
  const { data } = await instance.get(`/searchByCollections?searchText=${searchResult}`);
  return data;
})

export const fetchCustomFields = createAsyncThunk('collection/fetchCustomFields', async (id: string) => {
  const { data } = await instance.get(`/collection/itemsCustomFields/${id}`);
  return data;
})


const initialState = {
  items: {
    allCollectionItems: [],
    status: 'loading'
  },
  allTags: {
    tags: [],
    status: 'loading',
  },
  customFields: {
    fields: [],
    status: 'loading'
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
      state.allTags.tags = action.payload;
      state.allTags.status = 'loaded';
    })
    builder.addCase(fetchCloudTags.rejected, (state) => {
      state.allTags.tags = [];
      state.allTags.status = 'error';
    })
    builder.addCase(getAllMatchItems.pending, (state) => {
      state.items.allCollectionItems = [];
      state.items.status = 'loading';
    })
    builder.addCase(getAllMatchItems.fulfilled, (state, action) => {
      state.items.allCollectionItems = action.payload;
      state.items.status = 'loaded';
    })
    builder.addCase(getAllMatchItems.rejected, (state) => {
      state.items.allCollectionItems = [];
      state.items.status = 'error';
    })
    builder.addCase(fetchCustomFields.pending, (state) => {
      state.customFields.fields = [];
      state.customFields.status = 'loading';
    })
    builder.addCase(fetchCustomFields.fulfilled, (state, action) => {
      state.customFields.fields = action.payload;
      state.customFields.status = 'loaded';
    })
    builder.addCase(fetchCustomFields.rejected, (state) => {
      state.customFields.fields = [];
      state.customFields.status = 'error';
    })

  }
})

export const allCollectionItemsReducer = allCollectionItemsSlice.reducer;
