export type ScaleType = 'LONG' | 'BASE' | 'SHORT' | 'NUMERIC';
export type OptimizationDirection = 'MAX' | 'MIN';

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
