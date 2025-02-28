import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import Header from "../Components/Header";
import { fetchMatch } from "../API/fetchMatch";
import { fetchDogByID } from "../API/fetchDogsByID";

const Match = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const favorites = location.state?.favorites || [];

  const [username, setUsername] = useState(user?.name || "User");

  const {
    data: matchData,
    isLoading: isMatching,
    isError,
  } = useQuery({
    queryKey: ["match", favorites],
    queryFn: () => fetchMatch(favorites),
    enabled: favorites.length > 0,
    staleTime: 60000,
  });

  const matchedDogId = matchData?.match;
  const { data: matchedDog, isLoading: isLoadingDog } = useQuery({
    queryKey: ["dog", matchedDogId],
    queryFn: () => fetchDogByID([matchedDogId]),
    enabled: !!matchedDogId,
    staleTime: 60000,
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (user.name && user.name !== username) {
      setUsername(user.name);
    }
  }, [user, navigate, username]);

  return (
    <>
      <Header actionButtonView={true} />
      <div className="match-page">
        <div className="match-banner">
          <div className="banner-content">
            <h1 className="banner-heading">
              {isMatching
                ? "Finding your match..."
                : isError
                ? "No match found. Try again!"
                : matchedDog
                ? `You've been matched! Meet ${matchedDog[0]?.name}!`
                : "Select favorites to find a match."}
            </h1>
          </div>
        </div>

        <div className="content-container container">
          {isLoadingDog && <p>Loading matched dog...</p>}
          {matchedDog && (
            <div className="matched-dog-card">
              <img src={matchedDog[0]?.img} alt={matchedDog[0]?.name} />
              <h2>{matchedDog[0]?.name}</h2>
              <p>Breed: {matchedDog[0]?.breed}</p>
              <p>Age: {matchedDog[0]?.age}</p>
              <p>Zip: {matchedDog[0]?.zip_code}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Match;
