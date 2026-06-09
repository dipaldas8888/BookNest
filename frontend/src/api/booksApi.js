import API from "./axios";

export const fetchBooks = async ({
  category = "",
  search = "",
  minPrice = "",
  maxPrice = "",
  trending = false,
  sortBy = "newest",
  page = 1,
  limit = 12,
} = {}) => {
  const params = new URLSearchParams();

  if (category && category !== "All") params.append("category", category);
  if (search) params.append("search", search);
  if (minPrice !== "") params.append("minPrice", minPrice);
  if (maxPrice !== "") params.append("maxPrice", maxPrice);
  if (trending) params.append("trending", "true");
  params.append("sortBy", sortBy);
  params.append("page", page);
  params.append("limit", limit);

  const response = await API.get(`/api/books?${params.toString()}`);
  return {
    books: response.data.books,
    pagination: response.data.pagination,
  };
};

