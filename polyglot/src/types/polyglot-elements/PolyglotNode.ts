import { CircuitNode } from "./CircuitNode";
import { CloseEndedQuestionNode } from "./CloseEndedQuestionNode";
import { ContainerNode } from "./ContainerNode";
import { EmotionAttributionANode } from "./EmotionAttributionANode";
import { EmotionAttributionBNode } from "./EmotionAttributionBNode";
import { EmotionAttributionTestNode } from "./EmotionAttributionTestNode";
import { EyesTaskTestNode } from "./EyesTaskTestNode";
import { FauxPasNode } from "./FauxPasNode";
import { LessonTextNode } from "./LessonTextNode";
import { MultipleChoiceQuestionNode } from "./MultipleChoiceQuestionNode";
import { OpenQuestionNode } from "./OpenQuestionNode";
import { PolyglotNodeBase } from "./PolyglotNodeBase";
import { RiconoscimentoEmozioniNode } from "./RiconoscimentoEmozioniNode";
import { SocialSituationExerciseANode } from "./SocialSituationExerciseANode";
import { SocialSituationsNode } from "./SocialSituationsNode";
import { TeoriaDellaMenteNode } from "./TeoriaDellaMenteNode";
import { TrueFalseNode } from "./TrueFalseNode";
import { WatchVideoNode } from "./WatchVideoNode";

export type PolyglotNode = 
  | CircuitNode
  | EmotionAttributionBNode
  | EmotionAttributionANode
  | FauxPasNode
  | ContainerNode
  | EyesTaskTestNode
  | CloseEndedQuestionNode
  | EmotionAttributionTestNode
  | LessonTextNode
  | MultipleChoiceQuestionNode
  | RiconoscimentoEmozioniNode
  | TrueFalseNode
  | SocialSituationsNode
  | SocialSituationExerciseANode
  | TeoriaDellaMenteNode
  | OpenQuestionNode
  | WatchVideoNode
  | (PolyglotNodeBase & { 
    type: string; 
    data: {
        nodeData: Record<string, any>;
    }
});