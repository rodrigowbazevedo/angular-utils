export interface Timestamps {
  created_at: string;
  updated_at: string;
}

export interface SoftDelete extends Timestamps {
  deleted_at: string;
}
