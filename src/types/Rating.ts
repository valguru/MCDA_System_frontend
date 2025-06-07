export interface RatingOption {
    label: string;
    value: string;
}

export const ratingOptionsByScale: Record<string, RatingOption[]> = {
    BASE: [
        { label: 'очень низко', value: 'ОН' },
        { label: 'низко', value: 'Н' },
        { label: 'средне', value: 'С' },
        { label: 'высоко', value: 'В' },
        { label: 'очень высоко', value: 'ОВ' },
    ],
    SHORT: [
        { label: 'низко', value: 'Н' },
        { label: 'средне', value: 'С' },
        { label: 'высоко', value: 'В' },
    ],
    LONG: [
        { label: 'экстремально низко', value: 'ЭН' },
        { label: 'очень низко', value: 'ОН' },
        { label: 'низко', value: 'Н' },
        { label: 'средне', value: 'С' },
        { label: 'высоко', value: 'В' },
        { label: 'очень высоко', value: 'ОВ' },
        { label: 'экстремально высоко', value: 'ЭВ' },
    ],
    NUMERIC: Array.from({ length: 10 }, (_, i) => ({
        label: (i + 1).toString(),
        value: (i + 1).toString(),
    })),
};

export interface RatingAnswer {
    alternativeId: number;
    criteriaId: number;
    value: string;
}

export interface RatingCreateRequest {
    questionId: number;
    answers: RatingAnswer[];
}

