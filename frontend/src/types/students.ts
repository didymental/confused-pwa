/**
 * Defines the structure of the StudentData that
 * is received from the backend.
 */
export interface StudentData {
    id: number;
    display_name: string;
    session: number;
    reaction_type: number | null;
}