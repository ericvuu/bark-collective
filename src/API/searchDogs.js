import axios from "axios";

export const searchDogs = async ({
  breeds = [],
  zipCodes = [],
  ageMin,
  ageMax,
  size = 25,
  from,
  sort,
} = {}) => {
  const apiUrl = "https://frontend-take-home-service.fetch.com/dogs/search";
  const params = new URLSearchParams();

  if (breeds.length > 0) params.append("breeds", breeds.join(","));
  if (zipCodes.length > 0) params.append("zipCodes", zipCodes.join(","));
  if (ageMin !== undefined) params.append("ageMin", ageMin);
  if (ageMax !== undefined) params.append("ageMax", ageMax);
  params.append("size", size);
  if (from) params.append("from", from);
  if (sort) params.append("sort", sort);

  try {
    const res = await axios.get(`${apiUrl}?${params.toString()}`, {
      withCredentials: true,
    });

    if (res.status === 200 && res.data.resultIds.length > 0) {
      console.log(res.data)
      return res.data;
    }

    throw new Error("No dogs found");
  } catch (error) {
    console.error("Error fetching dogs:", error);
    throw new Error("Failed to fetch dogs");
  }
};
