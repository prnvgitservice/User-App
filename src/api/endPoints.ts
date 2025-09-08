const endpoints: any = {
    
    getAllCategories: {
        method: "get",
        url: () => {
          return `/api/categories/get`;
        },
      },

      getTechByCategorie:{
    method:"get",
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
    url: () => `/api/cart/addToCart`
  },
   getCartItems: {
    method: "get",
    url: (id: string) => {
      return `/api/cart/getCart/${id}`;
    },
  },
     removeFromCart: {
    method: "put",
    url: () => `/api/cart/removeFromCartService`
  },
}

export default endpoints;