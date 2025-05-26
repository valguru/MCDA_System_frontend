import {Expert} from "./Expert";

export type ScaleType = 'LONG' | 'BASE' | 'SHORT' | 'NUMERIC';
export type OptimizationDirection = 'MAX' | 'MIN';
export type QuestionStatus = 'DRAFT' | 'ACTIVE' | 'RESOLVED';

export interface Criterion {
    name: string;
    scaleType: ScaleType;
    optimization: OptimizationDirection;
}

export interface CreateQuestionPayload {
    title: string;
    description?: string;
    alternatives: string[];
    criteria: Criterion[];
}

export interface Question {
    id: number;
    title: string;
    description?: string;
    alternatives: string[];
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


