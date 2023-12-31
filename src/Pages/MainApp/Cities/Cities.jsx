import styles from "./Cities.module.css";
import Loading from "../../../Components/Loading/Loading";
import { usePlaces } from "../../../Contexts/PlacesProvider";
import { Link } from "react-router-dom";

function Cities() {
  const {
    isLoading,
    data,
    formatDate,
    currentCity,
    deleteCity,
    setMapPosition,
  } = usePlaces();
  console.log(data);
  function handleClick(e, id) {
    e.preventDefault();
    const { lat, lng } = data.find((obj) => obj.id === id).position;
    setMapPosition([lat, lng]);
    deleteCity(id);
  }
  return (
    <div className={styles.cityContainer}>
      {!data.length > 0 && <p>Select a city to get started</p>}
      {isLoading && <Loading />}
      {!isLoading &&
        data.map((place) => (
          <Link
            className={`${styles.city} ${
              currentCity.id === place.id ? "activeCity" : ""
            }`}
            key={place.id}
            to={`${place.id}?lat=${place.position.lat}&lng=${place.position.lng}`}
          >
            <div className={styles.cityInfo}>
              <p>{place.emoji}</p>
              <p>{place.cityName}</p>
            </div>
            <div className={styles.cityDate}>
              <p>{formatDate(place.date)}</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="2rem"
                viewBox="0 0 448 512"
                onClick={(e) => handleClick(e, place.id)}
              >
                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
              </svg>
            </div>
          </Link>
        ))}
    </div>
  );
}

export default Cities;
