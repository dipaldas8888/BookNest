const endpoints = {
  auth: {
    login: "/login",
    register: "/register",
    profile: "/profile",
  },

  books: {
    all: "/api/books",
    single: (id) => `/api/books/${id}`,
    create: "/api/books/create",
    update: (id) => `/api/books/update/${id}`,
    delete: (id) => `/api/books/delete/${id}`,
  },

  orders: {
    create: "/order",
    myOrders: "/my-orders",
    allOrders: "/all-orders",
  },
};

export default endpoints;
