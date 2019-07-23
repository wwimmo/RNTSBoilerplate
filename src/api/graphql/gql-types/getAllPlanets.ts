/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAllPlanets
// ====================================================

export interface GetAllPlanets_allPlanets_films {
  __typename: "Film";
  /**
   * The title of this film
   */
  title: string;
  /**
   * The name of the director of this film.
   */
  director: string | null;
  /**
   * The names of the producers of this film.
   */
  producers: string[] | null;
  createdAt: any;
}

export interface GetAllPlanets_allPlanets {
  __typename: "Planet";
  /**
   * The name of the planet
   */
  name: string;
  /**
   * The climate of this planet.
   */
  climate: string[] | null;
  /**
   * The diameter of this planet in kilometers.
   */
  diameter: number | null;
  /**
   * A number denoting the gravity of this planet, where "1" is normal or 1
   * standard G. "2" is twice or 2 standard Gs. "0.5" is half or 0.5 standard Gs.
   */
  gravity: string | null;
  films: GetAllPlanets_allPlanets_films[] | null;
}

export interface GetAllPlanets {
  allPlanets: GetAllPlanets_allPlanets[];
}
