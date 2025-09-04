import apiRequest from "./apiRequest";

export const getAllCategories = (data: any) => apiRequest("getAllCategories", data);

export const userGetProfile = (userId: string) => apiRequest("getUserProfile", null, userId);