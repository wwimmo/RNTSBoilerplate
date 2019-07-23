import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { GetAllPlanets } from "./gql-types/getAllPlanets";
import { ComponentInputPropsDefault } from "../../types";

export const GET_ALL_PLANETS = gql`
    query GetAllPlanets {
        allPlanets {
            name
            climate
            diameter
            gravity
            films {
                title
                director
                producers
                createdAt
            }
        }
    }
`;

const withAllPlanets = graphql<ComponentInputPropsDefault, GetAllPlanets>(GET_ALL_PLANETS);

export { withAllPlanets };
