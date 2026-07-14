const endpoints = {
  auth: {
    login: "/login",
    register: "/register",
    logout: "/logout",
    me: "/me",
    verifyOtp: "/verify-otp",
    resendOtp: "/resend-otp",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    updateProfile: "/update-profile",
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
    delete: (id) => `/order/${id}`,
  },

  users: {
    all: "/api/users",
    updateRole: (id) => `/api/users/${id}/role`,
    delete: (id) => `/api/users/${id}`,
  },

  payment: {
    createOrder: "/api/payment/create-order",
    verify: "/api/payment/verify",
  },
};

export default endpoints;
