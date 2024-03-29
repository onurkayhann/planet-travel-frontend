const BASE_URL = process.env.REACT_APP_API_URL;
export const API_URL = (slug: string) => `${BASE_URL}/${slug}`;

export const GET_PLANET = (id: string | undefined) => `planets/${id}`;

export const GET_TRIP = (tripId: string | undefined) => `get-trip/${tripId}`;
