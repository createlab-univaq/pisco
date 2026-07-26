import type React from 'react';
import icon from '../../public/icona_emozioni.png';
import occhi from '../../public/icona_occhi.png';
import person from '../../public/icona_persone.png';

import EmotionAttributionAEmbedded from './EmotionAttributionANodeEmbedded/EmotionAttributionANodeEmbedded';
import EmotionAttributionBEmbedded from './EmotionAttributionBNodeEmbedded/EmotionAttributionBNodeEmbedded';
import RiconoscimentoEmozioniNodeEmbedded from './RiconoscimentoEmozioniNodeEmbedded/RiconoscimentoEmozioniNodeEmbedded';
import SocialSituationExerciseAEmbedded from './SocialSituationExerciseANodeEmbedded/SocialSituationExerciseANodeEmbedded';

export type EmbeddedProps = {
  basePath: string;
  parentNodeId?: string;
  parentItemId?: string;
  isDisabled?: boolean;
};

export type EmbeddedDefinition = {
  type: string;
  label: string;
  icon?: string;
  component: React.ComponentType<EmbeddedProps>;
  createDefaultData: () => any;
};

export const embeddedRegistry: EmbeddedDefinition[] = [
  {
    type: 'EmotionAttributionANode',
    label: 'Attribuzione delle Emozioni (A)',
    icon: icon.src,
    component: EmotionAttributionAEmbedded,
    createDefaultData: () => ({
      scenario: '',
      domanda: '',
      risposteCorrette: [''],
      spiegazioneS: '',
      spiegazioneR: '',
    }),
  },
  {
    type: 'EmotionAttributionBNode',
    label: 'Attribuzione delle Emozioni (B)',
    icon: icon.src,
    component: EmotionAttributionBEmbedded,
    createDefaultData: () => ({
      items: [
        {
          emotion: '',
          scenario: '',
          scenarioExplanation: '',
        },
      ],
    }),
  },
  {
    type: 'RiconoscimentoEmozioniNode',
    label: 'Riconoscimento Emozioni',
    icon: occhi.src,
    component: RiconoscimentoEmozioniNodeEmbedded,
    createDefaultData: () => ({
      imageId: undefined,
      answers: ['', ''],
      correctIndex: 0,
    }),
  },
  {
    type: 'SocialSituationExerciseANode',
    label: 'Situazione Sociale (A)',
    icon: person.src,
    component: SocialSituationExerciseAEmbedded,
    createDefaultData: () => ({
      scenario: '',
      items: [
        {
          answer: '',
          explanation: '',
        },
      ],
      correctIndex: 0,
    }),
  },
];

export const embeddedByType = Object.fromEntries(
  embeddedRegistry.map((d) => [d.type, d])
) as Record<string, EmbeddedDefinition>;
