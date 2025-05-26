import {Expert} from "./Expert";

export interface Team {
    id: number;
    name: string;
    description?: string,
    createdBy: Expert;
    members: [Expert];
};