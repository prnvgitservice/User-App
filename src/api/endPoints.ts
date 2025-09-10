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
};

export default endpoints;
