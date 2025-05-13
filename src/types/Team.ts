import {Expert} from "./Expert";

export type Team = {
    id: number;
    name: string;
    createdBy: Expert;
    members: [Expert];
};