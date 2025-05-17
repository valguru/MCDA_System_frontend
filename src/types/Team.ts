import {Expert} from "./Expert";

export type Team = {
    id: number;
    name: string;
    description?: string,
    createdBy: Expert;
    members: [Expert];
};