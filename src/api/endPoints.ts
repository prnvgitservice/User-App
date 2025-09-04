const endpoints: any = {
    
    getAllCategories: {
        method: "get",
        url: () => {
          return `/api/categories/get`;
        },
      },
}

export default endpoints;