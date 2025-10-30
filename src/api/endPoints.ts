const endpoints: any = {
  login: {
    method: "post",
    url: () => {
      return `/api/auth/login`;
    },
  },

  userLogin: {
    method: "post",
    url: () => `/api/userAuth/login`,
  },

  userRegister: {
    method: "post",
    url: () => `/api/userAuth/register`,
  },

  getAllCategories: {
    method: "get",
    url: () => {
      return `/api/categories/get`;
    },
  },

  getTechByCategorie: {
    method: "get",
    url: (categoryId: string) => {
      return `/api/techDetails/getAllTechniciansByCateId/${categoryId}`;
    },
  },

  getAllTechnicianDetails: {
    method: "get",
    url: (id: string) => {
      return `/api/techDetails/getTechAllDetails/${id}`;
    },
  },

  addToCart: {
    method: "post",
    url: () => `/api/cart/addToCart`,
  },
  getCartItems: {
    method: "get",
    url: (id: string) => {
      return `/api/cart/getCart/${id}`;
    },
  },
  removeFromCart: {
    method: "put",
    url: () => `/api/cart/removeFromCartService`,
  },

  createBookService: {
    method: "post",
    url: () => `/api/bookingServices/createBookService`,
  },

  getAllPincodes: {
    method: "get",
    url: () => `/api/pincodes/allAreas`,
  },

  getAllBlogs: {
    method: "get",
    url: () => `/api/blog/getAllBlogs`,
  },

  createCompanyReview: {
    method: "post",
    url: "/api/companyReview/createReview",
  },

   getCompanyReviews: {
    method: "get",
    url: "/api/companyReview/getCompanyReviews",
  },

   getAllTechByAddress: {
    method: "post",
    url: "/api/techDetails/getAllTechByAddress",
  },

  
  getSearchContentByAddress: {
    method: "post",
    url: "/api/searchContentData/getSearchContentByLocation",
  },

   createGuestBooking: {
    method: "post",
    url: "/api/guestBooking/addGuestBooking",
  },

  getOrdersByUserId: {
    method: "get",
    url: (id: string) => {
      return `/api/bookingServices/getBookServiceByUserId/${id}`;
    },
  },

  addReviewByUser: {
    method: "post",
    url: "/api/techReview/addReviewByUser",
  },

  bookingCancleByUser: {
    method: "put",
    url: () => `/api/bookingServices/BookingCancleByUser`,
  },

  userGetProfile: {
    method: "get",
    url: (userId: string) => `/api/userAuth/profile/${userId}`,
  },
  userEditProfile: {
    method: "put",
    url: () => `/api/userAuth/editProfile`,
  },

  createGetInTouch: {
    method: "post",
    url: "/api/getInTouch/addGetInTouch",
  },
};

export default endpoints;
