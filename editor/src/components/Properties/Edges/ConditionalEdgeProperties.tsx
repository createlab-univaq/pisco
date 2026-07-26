import {
  Box,
  Divider,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
} from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import useStore from '../../../store';
import TextField from '../../Forms/Fields/TextField';

type ConditionalOperator = '>' | '>=' | '<' | '<=' | '==';

function getQuestionCountFromNode(node: any): number | null {
  if (!node) return null;

  const t = node.type;
  const d = node.data;

  if (t === 'EmotionAttributionTestNode')
    return Array.isArray(d?.questions) ? d.questions.length : 0;
  if (t === 'TeoriaDellaMenteNode')
    return Array.isArray(d?.quiz) ? d.quiz.length : 0;
  if (t === 'FauxPasNode') return Array.isArray(d?.quiz) ? d.quiz.length : 0;
  if (t === 'socialSituationsNode')
    return Array.isArray(d?.items) ? d.items.length : 0;
  if (t === 'EyesTaskTestNode')
    return Array.isArray(d?.questions) ? d.questions.length : 0;

  return null;
}

// operator+threshold -> range [min,max] su dominio 0..Q
function toRange(
  op: ConditionalOperator,
  th: number,
  Q: number
): [number, number] {
  switch (op) {
    case '==':
      return [th, th];
    case '>':
      return [th + 1, Q];
    case '>=':
      return [th, Q];
    case '<':
      return [0, th - 1];
    case '<=':
      return [0, th];
  }
}

function normalizeRange(r: [number, number], Q: number): [number, number] {
  const a = Math.max(0, Math.min(Q, r[0]));
  const b = Math.max(0, Math.min(Q, r[1]));
  return a <= b ? [a, b] : [1, 0]; // range vuoto se min>max
}

function rangesOverlap(a: [number, number], b: [number, number]) {
  return a[0] <= b[1] && b[0] <= a[1];
}

function isConditionPossible(op: ConditionalOperator, th: number, Q: number) {
  const r = normalizeRange(toRange(op, th, Q), Q);
  return r[0] <= r[1];
}

export default function ConditionalEdgeProperties() {
  const { register, watch, setValue } = useFormContext();

  const nodeMap = useStore((s: any) => s.nodeMap);
  const edgeMap = useStore((s: any) => s.edgeMap);

  // edge corrente: nel tuo form è _id
  const edgeId = watch('_id') as string | undefined;

  const sourceId = watch('reactFlow.source') as string | undefined;

  const sourceNode = useMemo(() => {
    if (!sourceId) return null;
    return nodeMap.get(sourceId) ?? null;
  }, [nodeMap, sourceId]);

  const questionCount = useMemo(
    () => getQuestionCountFromNode(sourceNode),
    [sourceNode]
  );

  const operatorPath = 'data.operator';
  const thresholdPath = 'data.threshold';

  useEffect(() => {
    register(operatorPath as any);
    register(thresholdPath as any);
  }, [register]);

  const operatorRaw = watch(operatorPath) as ConditionalOperator | undefined;
  const thresholdRaw = watch(thresholdPath);

  const toInt = (v: any) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.floor(n) : 0;
  };

  const clamp = (n: number) => {
    const base = Math.max(0, Math.floor(n));
    if (typeof questionCount === 'number' && Number.isFinite(questionCount)) {
      return Math.min(base, questionCount);
    }
    return base;
  };

  const currentThreshold = clamp(toInt(thresholdRaw));
  const currentOperator: ConditionalOperator = operatorRaw ?? '>=';

  const maxAllowed =
    typeof questionCount === 'number' && Number.isFinite(questionCount)
      ? questionCount
      : Number.MAX_SAFE_INTEGER;

  const emitWarning = (title: string, msg: string) => {
    // Opzione 2: toast gestito da FlowEditor tramite uiToast nello store
    (useStore as any).setState((state: any) => ({
      ...state,
      uiToast: {
        title,
        description: msg,
        status: 'warning',
        duration: 3500,
      },
    }));
  };

  // tutti gli altri conditionalEdge in uscita da source (escludendo questo edge)
  const otherOutgoingRanges = useMemo(() => {
    if (!sourceId) return [];
    if (typeof questionCount !== 'number' || !Number.isFinite(questionCount))
      return [];

    const Q = questionCount;

    const edges = Array.from(edgeMap?.values?.() ?? []);
    return edges
      .filter((e: any) => {
        if (!e) return false;
        if (e.type !== 'conditionalEdge') return false;
        if (e.reactFlow?.source !== sourceId) return false;
        if (edgeId && e._id === edgeId) return false;
        return true;
      })
      .map((e: any) => {
        const op = (e.data?.operator ?? '>=') as ConditionalOperator;
        const th = clamp(Number(e.data?.threshold ?? 0));
        return normalizeRange(toRange(op, th, Q), Q);
      });
  }, [edgeMap, sourceId, edgeId, questionCount]);

  const wouldOverlap = (op: ConditionalOperator, th: number) => {
    if (typeof questionCount !== 'number' || !Number.isFinite(questionCount)) {
      // se non so Q non blocco (comportamento permissivo)
      return false;
    }
    const Q = questionCount;
    const candidate = normalizeRange(toRange(op, th, Q), Q);
    return otherOutgoingRanges.some((r) => rangesOverlap(candidate, r));
  };

  const isImpossible = (op: ConditionalOperator, th: number) => {
    if (typeof questionCount !== 'number' || !Number.isFinite(questionCount))
      return false;
    return !isConditionPossible(op, th, questionCount);
  };

  // default se manca (allineato al mapping: >=)
  useEffect(() => {
    if (
      thresholdRaw === undefined ||
      thresholdRaw === null ||
      thresholdRaw === ''
    ) {
      setValue(thresholdPath, 0, { shouldDirty: false, shouldValidate: true });
    }
    if (!operatorRaw) {
      setValue(operatorPath, '>=', {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  }, [thresholdRaw, operatorRaw, setValue]);

  // clamp automatico quando cambia soglia o cambia questionCount
  useEffect(() => {
    const n = toInt(thresholdRaw);
    const c = clamp(n);
    if (n !== c) {
      setValue(thresholdPath, c, { shouldDirty: true, shouldValidate: true });
    }
  }, [thresholdRaw, questionCount, setValue]);

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      {/* ✅ titolo (usato dal renderer: edge.title) */}
      <TextField
        label="Title"
        name="title"
        constraints={{
          required: 'Title is required',
        }}
      />

      <Divider />

      <Box>
        <Text fontSize="sm" opacity={0.85}>
          Imposta una regola del tipo{' '}
          <b>&ldquo;risposte corrette {currentOperator} X&rdquo;</b>.
          {typeof questionCount === 'number' &&
          Number.isFinite(questionCount) ? (
            <> (X può essere al massimo {questionCount}.)</>
          ) : null}
        </Text>
      </Box>

      <FormControl>
        <FormLabel fontWeight="semibold">Condizione</FormLabel>
        <Select
          value={currentOperator}
          onChange={(e) => {
            const nextOp = e.target.value as ConditionalOperator;

            // HARD BLOCK: condizione impossibile
            if (isImpossible(nextOp, currentThreshold)) {
              emitWarning(
                'Condizione non valida',
                'Questa condizione non può verificarsi con il numero di domande disponibile.'
              );
              return;
            }

            // HARD BLOCK: overlap
            if (wouldOverlap(nextOp, currentThreshold)) {
              emitWarning(
                'Condizione ambigua',
                'Questa condizione si sovrappone a un altro edge condizionale in uscita dallo stesso nodo. Modifica l’altro edge oppure scegli una condizione diversa.'
              );
              return;
            }

            setValue(operatorPath, nextOp, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
        >
          <option value=">">{'Maggiore di (>)'}</option>
          <option value=">=">{'Maggiore o uguale (>=)'}</option>
          <option value="<">{'Minore di (<)'}</option>
          <option value="<=">{'Minore o uguale (<=)'}</option>
          <option value="==">{'Uguale a (==)'}</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel fontWeight="semibold">Valore di confronto (X)</FormLabel>
        <NumberInput
          value={currentThreshold}
          min={0}
          max={maxAllowed}
          onChange={(valueString) => {
            const nextTh = clamp(toInt(valueString));

            // HARD BLOCK: condizione impossibile
            if (isImpossible(currentOperator, nextTh)) {
              emitWarning(
                'Soglia non valida',
                'Questa soglia rende la condizione impossibile. Scegli un valore diverso.'
              );
              return;
            }

            // HARD BLOCK: overlap
            if (wouldOverlap(currentOperator, nextTh)) {
              emitWarning(
                'Condizione ambigua',
                'Questa soglia rende la condizione sovrapposta a un altro edge condizionale in uscita. Scegli un valore diverso oppure modifica l’altro edge.'
              );
              return;
            }

            setValue(thresholdPath, nextTh, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
        >
          <NumberInputField placeholder="Inserisci X" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
    </Box>
  );
}
