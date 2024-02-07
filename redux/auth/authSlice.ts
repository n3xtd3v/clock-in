import { createSlice } from "@reduxjs/toolkit";

export type authState = {
  access_token: string;
  user: object;
};

const initialState: authState = {
  access_token: "",
  user: {},
};

export const counterSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state, action) => {
      state.access_token = action.payload.access_token;
      state.user = action.payload.user;
    },
    signOut: (state) => {
      (state.access_token = ""), (state.user = {});
    },
    refreshToken: (state, action) => {
      state.access_token = action.payload.access_token;
      state.user = action.payload.user;
    },
  },
});

// Action creators are generated for each case reducer function
export const { signIn, signOut, refreshToken } = counterSlice.actions;

export default counterSlice.reducer;
