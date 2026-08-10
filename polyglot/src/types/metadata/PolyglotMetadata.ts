export type PolyglotMetadata = {
  type: string;
  sub?: string;
  fields?: PolyglotMetadata[]; 
  name: string;
  label?: string;
  options?: string[];
  constraints: Record<string, any>;
};