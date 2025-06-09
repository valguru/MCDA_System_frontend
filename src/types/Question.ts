import {Expert} from "./Expert";

export type ScaleType = 'LONG' | 'BASE' | 'SHORT' | 'NUMERIC';
export type OptimizationDirection = 'MAX' | 'MIN';
export type QuestionStatus = 'DRAFT' | 'ACTIVE' | 'AWAITING_DECISION' |'RESOLVED';

export interface QuestionsFilterPayload {
    teamId: number;
    status?: QuestionStatus | 'ALL';
}

export interface Criterion {
    id?: number;
    name: string;
    scaleType: ScaleType;
    optimization: OptimizationDirection;
}

export interface Alternative {
    id: number;
    value: string;
}

export interface QuestionCreatePayload {
    teamId: number;
    title: string;
    description?: string;
    alternatives: string[];
    criteria: Criterion[];
}

export interface Question {
    id: number;
    title: string;
    description?: string;
    alternatives: Alternative[];
    criteria: Criterion[];
    status: QuestionStatus;
    createdAt: string;
    createdBy: Expert;
}

export const scaleTypeLabels: Record<ScaleType, string> = {
    BASE: 'Standard',
    SHORT: 'Compact',
    LONG: 'Extended',
    NUMERIC: 'Numeric',
};

export const optimizationLabels: Record<OptimizationDirection, string> = {
    MIN: 'Минимизация',
    MAX: 'Максимизация',
};