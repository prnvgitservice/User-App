import { data } from "autoprefixer";
import apiRequest from "./apiRequest";

export const login = (data: any) => apiRequest("login", data);

export const userLogin = (data: any) => apiRequest("userLogin", data);

export const getAllCategories = (data: any) => apiRequest("getAllCategories", data);

export const getTechByCategorie = (id: string) =>apiRequest('getTechByCategorie', null , id)

export const getAllTechnicianDetails = (id: string) =>apiRequest('getAllTechnicianDetails', null , id)

export const addToCart = (data: any) => apiRequest("addToCart", data);

export const getCartItems = (id: string) => apiRequest("getCartItems", null, id);

export const removeFromCart = (data: any) => apiRequest("removeFromCart", data);

export const createBookService = (data: any) => apiRequest("createBookService", data);

export const getAllPincodes = () => apiRequest("getAllPincodes");

export const getAllBlogs = (data: any) => apiRequest("getAllBlogs", data);

export const createCompanyReview = (formData: any) =>  apiRequest("createCompanyReview", formData);

export const  getCompanyReviews = (data: any) => apiRequest("getCompanyReviews", data);

export const getAllTechByAddress = (formData: any) =>  apiRequest("getAllTechByAddress", formData);

export const getSearchContentByAddress = (formData: any) =>  apiRequest("getSearchContentByAddress", formData);

export const createGuestBooking = (formData: any) =>  apiRequest("createGuestBooking", formData);

export const getOrdersByUserId = (id: string) =>  apiRequest("getOrdersByUserId", null, id);

export const addReviewByUser = (formData: any) =>  apiRequest("addReviewByUser", formData);

export const bookingCancleByUser = (data: any) =>  apiRequest("bookingCancleByUser", data);

export const userGetProfile = (userId: string) => apiRequest("userGetProfile", null, userId);

export const userEditProfile = (data: any) =>  apiRequest("userEditProfile", data);

