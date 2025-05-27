export interface Expert {
    id: number;
    name: string;
    email: string;
    surname?: string,
    position?: string
}

export interface ParticipantsResponse {
    responded: Expert[];
    pending: Expert[];
}