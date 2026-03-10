import API from "./axios";

export const fetchBooks = async (category, search) => {
  const params = new URLSearchParams();

  if (category && category !== "All") {
    params.append("category", category);
  }

  if (search) {
    params.append("search", search);
  }

  const response = await API.get(`/api/books?${params.toString()}`);

  return response.data.books;
};
