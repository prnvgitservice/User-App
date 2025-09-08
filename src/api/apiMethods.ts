import apiRequest from "./apiRequest";

export const getAllCategories = (data: any) => apiRequest("getAllCategories", data);

export const getTechByCategorie = (id: string) =>apiRequest('getTechByCategorie', null , id)

export const getAllTechnicianDetails = (id: string) =>apiRequest('getAllTechnicianDetails', null , id)

export const addToCart = (data: any) => apiRequest("addToCart", data);

export const getCartItems = (id: string) => apiRequest("getCartItems", null, id);

export const removeFromCart = (data: any) => apiRequest("removeFromCart", data);
