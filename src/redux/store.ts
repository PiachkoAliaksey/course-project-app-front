import { Store } from "redux"
import { configureStore} from "@reduxjs/toolkit";



import { authReducer } from "./slices/auth";
import {usersTableReducer} from "./slices/usersTable"
import {collectionReducer} from "./slices/collection"
import {allCollectionReducer} from "./slices/allCollections"
import {itemReducer} from "./slices/item"
import { allCollectionItemsReducer } from "./slices/allCollectionItems";
import {commentReducer} from './slices/comment';
import {allCommentsReducer} from './slices/allComments';




export const store:Store = configureStore({
  reducer: {
    auth:authReducer,
    users:usersTableReducer,
    collection:collectionReducer,
    collections:allCollectionReducer,
    item:itemReducer,
    items:allCollectionItemsReducer,
    comment:commentReducer,
    allComments:allCommentsReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(
    {serializableCheck: false}
  )
})

export type RootState = ReturnType<typeof store.getState>
