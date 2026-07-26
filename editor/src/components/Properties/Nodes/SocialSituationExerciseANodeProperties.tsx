import { Divider } from '@chakra-ui/react';
import SocialSituationExerciseAEmbedded from '../../Embedded/SocialSituationExerciseANodeEmbedded/SocialSituationExerciseANodeEmbedded';
import NodeProperties from './NodeProperties';

/**
 * Properties panel for node "SocialSituationExerciseANode".
 *
 * Backend fields:
 * - data.scenario: string
 * - data.items: { answer: string; explanation: string }[]
 * - data.correctIndex: number (0-based)
 */
const SocialSituationExerciseANodeProperties = () => {
  return (
    <>
      <NodeProperties
        platform={['WebApp']}
        activityDescription="Esercitazione di situazione sociale (Tipo A): inserisci uno scenario e una lista di risposte con spiegazione. Imposta poi l'indice della risposta corretta."
      />

      <Divider my={3} />

      <SocialSituationExerciseAEmbedded basePath="data" />
    </>
  );
};

export default SocialSituationExerciseANodeProperties;
