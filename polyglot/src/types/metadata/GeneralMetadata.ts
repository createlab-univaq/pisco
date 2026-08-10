import { PolyglotMetadata } from "./PolyglotMetadata";

export type GeneralMetadata = { 
    [discriminator: string]: PolyglotMetadata
};