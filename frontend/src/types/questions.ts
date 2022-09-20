/**
 * Defines the structure of the QuestionData that
 * is received from the backend.
 */
export interface QuestionData {
    student: number;
    question_content: string;
    vote_count: number;
}
  