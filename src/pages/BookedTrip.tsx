import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import { PlanetInterface, TripInterface } from "../interfaces/interfaces";
import { API_URL, GET_TRIP, GET_PLANET } from "../reusable/urls";
import { AuthContext } from "../auth/AuthProvider";

const BookedTrip: React.FC = () => {
  const auth = useContext(AuthContext);
  const { tripId } = useParams();

  // const { userId, setUserId } = useContext();

  const [trip, setTrip] = useState<TripInterface>();
  const [planet, setPlanet] = useState<PlanetInterface>();

  useEffect(() => {
    fetch(API_URL(GET_TRIP(tripId)), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTrip({
            _id: data.trip._id,
            destination: data.trip.destination,
            travTime: data.trip.travTime,
            passengers: data.trip.passengers,
            seat: data.trip.seat,
            firstClass: data.trip.firstClass,
            createdAt: data.trip.createdAt,
          });

          getPlanet(data.trip.destination);
        }
      });
  }, []);

  const getPlanet = (planetId: string) => {
    axios.get(API_URL(GET_PLANET(planetId))).then((res) => {
      const data = res.data;
      console.log(data);

      setPlanet({
        _id: data.planet._id,
        name: data.planet.name,
        moons: data.planet.moons,
        avgTemp: data.planet.avgTemp,
        mass: data.planet.mass,
        grav: data.planet.grav,
        radius: data.planet.radius,
        earthDistance: data.planet.earthDistance,
        shortDescription: data.planet.shortDescription,
        description: data.planet.description,
        image: data.planet.image,
      });
    });
  };

  return (
    <main className="container-sm">
      <Link to={auth?.signedIn ? `/user` : "/"}>Back to user page</Link>
      <h1 className="text-white">Trip to {planet?.name}</h1>
      <section
        className="container-sm rounded"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.65)" }}
      >
        <h2>{planet?.name} specs</h2>
        <img
          className="rounded"
          src={planet?.image}
          alt={planet?.name}
          style={{ width: "20rem" }}
        />
        <p className="fs-5">
          Number of moons:{" "}
          <span className="fw-semibold">
            {planet?.moons === null ? 0 : planet?.moons?.length}
          </span>
        </p>
        <p className="fs-5">
          Average Temperature:{" "}
          <span className="fw-semibold">{planet?.avgTemp}</span>
        </p>
        <p className="fs-5">
          Mass: <span className="fw-semibold">{planet?.mass.massValue}</span>
        </p>
        <p className="fs-5">
          Gravity: <span className="fw-semibold">{planet?.grav}</span>
        </p>
        <p className="fs-5">
          Radius: <span className="fw-semibold">{planet?.radius}</span>
        </p>
        <p className="fs-5">
          Distance to earth:{" "}
          <span className="fw-semibold">{planet?.earthDistance}</span>
        </p>
        <p className="fs-5">{planet?.shortDescription}</p>
      </section>
      <section
        className="container-sm rounded"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.65)" }}
      >
        <h2>Booking specs</h2>
        <p className="fs-5">
          <span className="fw-semibold">
            {trip?.firstClass ? "First class" : "Economy"}
          </span>
        </p>
        <p className="fs-5">
          Number of passengers:{" "}
          <span className="fw-semibold">{trip?.passengers}</span>
        </p>
        <p className="fs-5">
          Seating preference: <span className="fw-semibold">{trip?.seat}</span>
        </p>
        <p className="fs-5">
          Travel time: <span className="fw-semibold">{trip?.travTime}</span>
        </p>
      </section>
    </main>
  );
};

export default BookedTrip;
