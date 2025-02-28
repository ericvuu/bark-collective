import axios from "axios";

export const fetchMatch = async (dogIds) => {
  const apiUrl = "https://frontend-take-home-service.fetch.com/dogs/match";

  if (!dogIds || dogIds.length === 0) {
    throw new Error("No dog IDs provided.");
  }

  try {
    const res = await axios.post(apiUrl, dogIds, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    if (res.status === 200) {
      return res.data;
    }

    throw new Error("Failed to fetch dog details.");
  } catch (error) {
    console.error("Error fetching dog details:", error);
    throw new Error("Failed to retrieve dog details.");
  }
};
