import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchDogs } from "../API/searchDogs";
import { fetchBreeds } from "../API/fetchBreeds";
import { fetchDogByID } from "../API/fetchDogsByID";
import { useAuth } from "../Contexts/AuthContext";
import Header from "../Components/Header";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";

const Search = () => {
  const { user, location } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.name || "User");
  const [zip, setZip] = useState(location?.zip || "");
  const [city, setCity] = useState(location?.city || "");
  const [defaultZip, setDefaultZip] = useState(location?.zip || "");
  const [favorites, setFavorites] = useState([]);
  const [breed, setBreed] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("breed");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showZipPopup, setShowZipPopup] = useState(false);

  const {
    data: breeds,
    isLoading: isLoadingBreeds,
    isError: isErrorBreeds,
  } = useQuery({
    queryKey: ["breeds"],
    queryFn: fetchBreeds,
    staleTime: 60000,
  });

  const {
    data: dogIdsData,
    isLoading: isLoadingIds,
    isError: isErrorIds,
    error: errorIds,
  } = useQuery({
    queryKey: ["dogIds", breed, page, sortField, sortOrder, zip || []],
    queryFn: () =>
      searchDogs({
        breeds: breed ? [breed] : [],
        size: 25,
        from: (page - 1) * 25,
        sort: `${sortField}:${sortOrder}`,
        zipCodes: zip ? [zip] : [],
      }),
    enabled: true,
    staleTime: 60000,
  });

  const {
    data: dogs,
    isLoading: isLoadingDogs,
    isError: isErrorDogs,
  } = useQuery({
    queryKey: ["dogs", dogIdsData?.resultIds],
    queryFn: () => fetchDogByID(dogIdsData?.resultIds),
    enabled: !!dogIdsData?.resultIds,
    staleTime: 60000,
  });


  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (user.name && user.name !== username) {
      setUsername(user.name);
    }

    if (!zip && location?.zip && !defaultZip) {
      setZip(location.zip);
    }
  }, [user, navigate, username, location?.zip, zip, defaultZip]);

  const handleNext = () => {
    if (!isLoadingDogs && dogIdsData?.next) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleBreedChange = (e) => {
    setBreed(e.target.value);
    setPage(1);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleSortFieldChange = (e) => {
    setSortField(e.target.value);
  };

  const handleZipChange = (e) => {
    setZip(e.target.value);
  };

  const handleClearZip = () => {
    setZip("");
    setShowZipPopup(false);
  };

  const handleFavorites = (id) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(id)) {
        return prevFavorites.filter((favoriteId) => favoriteId !== id);
      } else {
        return [...prevFavorites, id];
      }
    });
  };

  const handleMatchNavigation = () => {
    navigate("/match", { state: { favorites } });
  };

  return (
    <>
      <Header actionButtonView={true} />
      <div className="search-page">
        <div className="search-banner">
          <div className="banner-content">
            <h1 className="banner-heading">Let's Find Your Friend</h1>
            <p className="banner-description">
              Discover the perfect dog companion. Whether you're looking for an
              energetic pup to join your adventures or a calm companion to relax
              with, our easy-to-use dog finder helps you locate the best match
              for your lifestyle.
            </p>
          </div>
        </div>

        <div className="content-container container">
          <div className="filter-form">
            <div className="filter-form-container">
              <div className="fields-container">
                <div className="zip-filter">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    onClick={() => setShowZipPopup(!showZipPopup)}
                    className={`location-icon ${
                      zip?.length > 0 ? "active" : "disabled"
                    }`}
                  />

                  {showZipPopup && (
                    <div className="zip-popup">
                      <div className="zip-popup-content">
                        <input
                          type="text"
                          placeholder="Enter Zip Code"
                          value={zip}
                          onChange={handleZipChange}
                        />
                        <button
                          onClick={handleClearZip}
                          className="clear-zip-button"
                        >
                          Clear Zip
                        </button>
                        <button
                          onClick={() => setShowZipPopup(false)}
                          className="close-zip-popup"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <select
                  onChange={handleBreedChange}
                  value={breed}
                  disabled={isLoadingBreeds || isErrorBreeds}
                >
                  <option value="">Select Breed</option>
                  {isLoadingBreeds && <option>Loading breeds...</option>}
                  {isErrorBreeds && <option>Error fetching breeds</option>}
                  {!isLoadingBreeds &&
                    !isErrorBreeds &&
                    breeds?.map((breedOption) => (
                      <option key={breedOption} value={breedOption}>
                        {breedOption}
                      </option>
                    ))}
                </select>

                <select onChange={handleSortFieldChange} value={sortField}>
                  <option value="breed">Sort by Breed</option>
                  <option value="name">Sort by Name</option>
                  <option value="age">Sort by Age</option>
                </select>

                <select onChange={handleSortOrderChange} value={sortOrder}>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>

                <a
                  onClick={
                    favorites.length > 0
                      ? handleMatchNavigation
                      : (e) => e.preventDefault()
                  }
                  className={`match-button ${
                    favorites.length === 0 ? "disabled" : ""
                  }`}
                >
                  Match By Favorites
                </a>
              </div>
            </div>
          </div>

          <h3 className="welcome-message">Welcome, {username}!</h3>
          {zip && city && dogs?.length > 0 ? (
            <p className="city-disclaimer">
              There {dogs.length > 1 ? "are" : "is"} {dogs.length} dog{dogs.length > 1 ? "s" : ""} within {city}
            </p>
          ) : null}
          {isLoadingIds && <p>Loading available dogs...</p>}
          {isErrorIds && (
            <p className="error-message">Error: {errorIds.message}</p>
          )}

          {isLoadingDogs && <p>Loading dog details...</p>}
          {isErrorDogs && (
            <p className="error-message">Error: {errorDogs.message}</p>
          )}

          {dogs?.length > 0 ? (
            <div className="cards-container">
              {dogs.map((dog) => (
                <div key={dog.id} className="card">
                  <img src={dog.img} alt={dog.name} className="card-img" />
                  <div className="card-content">
                    <h4 className="card-title">{dog.name}</h4>
                    <p className="card-description">Breed: {dog.breed}</p>
                    <p className="card-description">Age: {dog.age}</p>
                    <p className="card-description">Zip: {dog.zip_code}</p>
                    <div className="card-footer">
                      <button
                        onClick={() => handleFavorites(dog.id)}
                        className="card-button"
                      >
                        <FontAwesomeIcon
                          icon={
                            favorites.includes(dog.id) ? faStar : faStarHalfAlt
                          }
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !isLoadingDogs && <p>No dogs found for this breed.</p>
          )}

          <div className="pagination">
            {!isLoadingDogs && dogIdsData?.next && (
              <button onClick={handleNext} className="next-button">
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
