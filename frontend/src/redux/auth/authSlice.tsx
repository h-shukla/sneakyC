import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { AxiosError } from "axios";

interface AuthState {
    isAuthenticated: boolean;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    status: "idle",
    error: null,
};

export const refreshAuthState = createAsyncThunk<
    boolean,
    void,
    { rejectValue: string }
>("auth/refreshAuthState", async (_, thunkAPI) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/me`, {
            withCredentials: true,
        });
        return res.status === 200;
    } catch (err) {
        const axiosErr = err as AxiosError<{ message: string }>;
        const message: string =
            axiosErr.response?.data?.message ??
            axiosErr.message ??
            "Failed to check auth";
        return thunkAPI.rejectWithValue(message);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        checkAuthState: (state, action) => {
            state.isAuthenticated = !!action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(refreshAuthState.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(refreshAuthState.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.isAuthenticated = action.payload;
                state.error = null;
            })
            .addCase(refreshAuthState.rejected, (state, action) => {
                state.status = "failed";
                state.isAuthenticated = false;
                state.error =
                    action.payload ??
                    action.error.message ??
                    "Failed to refresh auth";
            });
    },
});

export const { checkAuthState } = authSlice.actions;
export default authSlice.reducer;
