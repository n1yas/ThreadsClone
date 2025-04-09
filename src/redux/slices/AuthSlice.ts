import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserType = {
  _id: string;
  bio: string;
  username:string;
  profilePic: string;
  following: string[];
  followers: string[];
};

interface StateProps {
  user: UserType | null; 
  error: null | string; 
}

const initialState: StateProps = {
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
      state.error = null; 
    },
  },
});

export default authSlice.reducer;
export const { loginSuccess } = authSlice.actions;
