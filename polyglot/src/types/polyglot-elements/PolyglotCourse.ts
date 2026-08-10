import { PolyglotCourseInfo } from "./PolyglotCourseInfo";
import { PolyglotFlow } from "./PolyglotFlow";

export type PolyglotCourse = PolyglotCourseInfo & {
  flows: PolyglotFlow[];
};