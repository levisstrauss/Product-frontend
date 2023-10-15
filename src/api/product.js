import axios from "axios";

const api =  axios.create({
    baseURL: "http://localhost:8080",
});

export const getAllProducts = () => {
    return api.get("/api/products");
};

export const getProductById = (id) => {
    return api.get(`/api/products/${id}`);
};

export const addProduct = (product) => {
    return api.post("/api/products", product);
}

export const deleteProduct = (id) => {
    return api.delete(`/api/products/${id}`);
};
export const uploadImage = (image) => {
    return api.post("/api/products/upload", image);
};

export const updateProduct = (id, product) => {
    return api.put(`/api/products/${id}`, product);
};

export default api;