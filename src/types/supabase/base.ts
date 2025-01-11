/**
 * Base types used across the application
 */

/** Timestamp string in ISO format */
export type Timestamp = string;

/** Generic JSON object */
export type Json = Record<string, any>;

/** Base interface for database records */
export interface BaseRecord {
  id: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}