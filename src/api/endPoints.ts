const endpoints: any = {
    
    getAllCategories: {
        method: "get",
        url: () => {
          return `/api/categories/get`;
        },
      },


    userGetProfile: {
    method: "get",
    url: (userId: string) => `/api/userAuth/profile/${userId}`
  },
}

export default endpoints;