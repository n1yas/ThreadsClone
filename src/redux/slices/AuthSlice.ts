import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:null,
    error:null
}
const authSlice=createSlice({
    name:"auth",
    initialState: initialState,
    reducers:{
        loginSuccess:(state,action)=>{
            state.user=action.payload;

        }
    }
})

export default authSlice.reducer
export const {loginSuccess} = authSlice.actions