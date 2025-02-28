import axios from "axios";

export const fetchBreeds = async () => {
  const apiUrl = `https://frontend-take-home-service.fetch.com/dogs/breeds`;

  try {
    const res = await axios.get(apiUrl, {
      withCredentials: true,
    });

    if (res.status === 200 && res.data && res.data.length > 0) {
      return res.data;
    }

    throw new Error("Failed to fetch breeds");
  } catch (error) {
    console.error("Error fetching breeds:", error);
    throw new Error("Failed to fetch breeds");
  }
};
