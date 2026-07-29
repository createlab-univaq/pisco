import { Divider, Heading } from '@chakra-ui/react';
import StringArrayField from '../../Forms/Fields/StringArrayField';
import TextField from '../../Forms/Fields/TextField';

type Props = {
  /**
   * Prefisso del path nel form:
   * - Nodo singolo: "data"
   * - Dentro container: "data.items.0" (esempio)
   */
  basePath: string;

  isDisabled?: boolean;
};

const path = (basePath: string, field: string) => `${basePath}.${field}`;

const EmotionAttributionAEmbedded = ({ basePath, isDisabled }: Props) => {
  return (
    <>
      <TextField
        label="Scenario"
        name={path(basePath, 'scenario')}
        isTextArea
        isDisabled={isDisabled}
      />
      <TextField
        label="Domanda"
        name={path(basePath, 'domanda')}
        isTextArea
        isDisabled={isDisabled}
      />

      <Heading size="xs" mb={2}>
        Risposte corrette (lista)
      </Heading>

      <StringArrayField
        name={path(basePath, 'risposteCorrette')}
        itemLabel="Risposta corretta"
        addLabel="Aggiungi risposta corretta"
        defaultItemValue=""
        keepAtLeastOne
        // se il tuo component lo supporta:
        // isDisabled={isDisabled}
      />

      <Divider my={3} />

      <TextField
        label="Spiegazione (Scenario)"
        name={path(basePath, 'spiegazioneS')}
        isTextArea
        isDisabled={isDisabled}
      />
      <TextField
        label="Spiegazione (Risposta)"
        name={path(basePath, 'spiegazioneR')}
        isTextArea
        isDisabled={isDisabled}
      />
    </>
  );
};

export default EmotionAttributionAEmbedded;
