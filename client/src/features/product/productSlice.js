import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

export const getProductList = createAsyncThunk(
  "products/getProductList",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get("/product", { params: { ...query } });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const getProductDetail = createAsyncThunk(
  "products/getProductDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/product/${id}`);

      return response.data.product;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/product", formData);

      dispatch(
        showToastMessage({ message: "상품 생성 완료", status: "success" })
      );
      dispatch(getProductList({ page: 1 }));

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async ({ id, searchQuery }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/product/${id}`);

      dispatch(getProductList(searchQuery));
      dispatch(
        showToastMessage({
          message: "상품이 삭제되었습니다.",
          status: "success",
        })
      );

      return true;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);
export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, searchQuery, ...formData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/product/${id}`, formData);

      dispatch(getProductList(searchQuery));
      dispatch(
        showToastMessage({
          message: "상품이 수정되었습니다.",
          status: "success",
        })
      );

      return response.data.product;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const checkImageUrl = createAsyncThunk(
  "products/checkImageUrl",
  async (url, { rejectWithValue }) => {
    try {
      if (!url) {
        throw new Error("이미지를 넣어 주세요");
      }
      const response = await fetch(url, { method: "HEAD" });
      const imageType = response.headers.get("content-type");

      if (response.ok && imageType?.startsWith("image/")) {
        return true;
      } else {
        throw new Error("잘못된 이미지 URL");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    selectedProduct: null,
    loading: false,
    error: "",
    totalPageNum: 1,
    success: false,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createProduct.fulfilled, (state) => {
      state.loading = false;
      state.error = "";
      state.success = true;
    });
    builder
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })
      .addCase(getProductList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductList.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = action.payload.product;
        state.totalPageNum = action.payload.totalPageNum;
        state.error = "";
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkImageUrl.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkImageUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.checkImage = action.payload;
        state.success = true;
      })
      .addCase(checkImageUrl.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })
      .addCase(editProduct.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.success = true;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getProductDetail.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
        state.error = "";
        state.success = true;
      })
      .addCase(getProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { setSelectedProduct, setFilteredList, clearError } =
  productSlice.actions;
export default productSlice.reducer;
