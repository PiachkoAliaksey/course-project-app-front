import { createSlice, createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit';
import { instance } from '../../constant/apiConfig';


export const fetchUserAllCollections = createAsyncThunk('collection/fetchUserAllCollections', async (id: string) => {
  const { data } = await instance.get(`/collections/${id}`);
  return data;
})

export const fetchUserLargestCollection = createAsyncThunk('collection/fetchUserLargestCollection', async () => {
  const { data } = await instance.get(`/largestFiveCollection`);
  return data;
})

export const fetchDeleteCollection = createAsyncThunk('collection/fetchDeleteCollection', async (id: string) => {
  return await instance.delete(`/collections/delete/${id}`);

})

export const fetchEditCollection = createAsyncThunk('collection/fetchEditCollection', async ({ user, title, description, theme,customFields }: { user: string, title: string, description: string, theme: string,customFields:{customFieldName:string}[] }) => {
  const { data } = await instance.patch(`/collections/update/${user}`, { 'title': title, "description": description, "theme": theme,"customFields":customFields });
  return data;
})

export const fetchEditCountItemCollection = createAsyncThunk('collection/fetchEditCountItemCollection', async (id: string) => {
  const { data } = await instance.patch(`/collections/updateCount/${id}`, { "id": id });
  return data;
})

interface ICollection {
  title: string,
  description: string,
  theme: string,
  user: string,
  _id: string,
  countOfItems: number,
  createdAt: string,
  updatedAt: string,
  __v: number
}


interface IInitialState {
  allCollections: {
    items: ICollection[] | [],
    status: string
  }
}
const initialState = {
  allCollections: {
    items: [],
    status: 'loading'
  }
} as IInitialState;

const allCollectionSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserAllCollections.pending, (state) => {
      state.allCollections.items = [];
      state.allCollections.status = 'loading';
    })
    builder.addCase(fetchUserAllCollections.fulfilled, (state, action) => {
      state.allCollections.items = action.payload;
      state.allCollections.status = 'loaded';
    })
    builder.addCase(fetchUserAllCollections.rejected, (state) => {
      state.allCollections.items = [];
      state.allCollections.status = 'error';
    })
    builder.addCase(fetchDeleteCollection.pending, (state) => {
      state.allCollections.items = [];
      state.allCollections.status = 'loading';
    })
    builder.addCase(fetchDeleteCollection.fulfilled, (state, action) => {
      const { arg } = action.meta;
      if (arg) {
        state.allCollections.items = state.allCollections.items.filter((obj) => {
          obj._id !== arg
        });
      }
      state.allCollections.status = 'loaded';
    })
    builder.addCase(fetchDeleteCollection.rejected, (state) => {
      state.allCollections.items = [];
      state.allCollections.status = 'error';
    })

    builder.addCase(fetchEditCollection.pending, (state) => {
      state.allCollections.items = [];
      state.allCollections.status = 'loading';
    })
    builder.addCase(fetchEditCollection.fulfilled, (state, action) => {
      const { arg: { user, title, description, theme } } = action.meta
      if (user) {
        const toggleElement = state.allCollections.items.find(val => val._id === user);
        if (toggleElement) {
          toggleElement.title = title;
          toggleElement.description = description;
          toggleElement.theme = theme;

        }
      }
      state.allCollections.status = 'loaded'
    })
    builder.addCase(fetchEditCollection.rejected, (state) => {
      state.allCollections.items = [];
      state.allCollections.status = 'error'
    })
    builder.addCase(fetchUserLargestCollection.pending, (state) => {
      state.allCollections.items = [];
      state.allCollections.status = 'loading';
    })
    builder.addCase(fetchUserLargestCollection.fulfilled, (state, action) => {
      state.allCollections.items = action.payload
      state.allCollections.status = 'loaded'
    })
    builder.addCase(fetchEditCountItemCollection.rejected, (state) => {
      state.allCollections.items = [];
      state.allCollections.status = 'error'
    })
    builder.addCase(fetchEditCountItemCollection.pending, (state) => {
      state.allCollections.items = [];
      state.allCollections.status = 'loading';
    })
    builder.addCase(fetchEditCountItemCollection.fulfilled, (state, action) => {
      const { arg: id } = action.meta
      if (id) {
        const toggleElement = state.allCollections.items.find(val => val._id === id);
        if (toggleElement) {
          toggleElement.countOfItems = toggleElement.countOfItems - 1;

        }
      }
      state.allCollections.status = 'loaded'
    })


  }
})

export const allCollectionReducer = allCollectionSlice.reducer;
