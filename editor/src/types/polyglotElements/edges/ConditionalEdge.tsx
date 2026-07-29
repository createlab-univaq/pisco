import ConditionalEdgeProperties from '../../../components/Properties/Edges/ConditionalEdgeProperties';
import { ReactFlowSmartBezierEdge } from '../../../components/ReactFlowEdge';
import { polyglotEdgeComponentMapping } from '../elementMapping';
import { defaultPolyglotEdgeData, EdgeData, PolyglotEdge } from './Edge';

export type ConditionalOperator = '>' | '>=' | '<' | '<=' | '==';

export type ConditionalEdgeData = EdgeData & {
  operator?: ConditionalOperator;
  threshold?: number;
};

export type ConditionalEdge = PolyglotEdge & {
  type: 'conditionalEdge';
  data: ConditionalEdgeData;
};

polyglotEdgeComponentMapping.registerMapping<ConditionalEdge>({
  elementType: 'conditionalEdge',
  name: 'Conditional',
  elementComponent: ReactFlowSmartBezierEdge,
  propertiesComponent: ConditionalEdgeProperties,
  defaultData: {
    ...defaultPolyglotEdgeData,
    operator: '>=',
    threshold: 0,
  },
  transformData: (edge) => {
    // Code sempre valido (anche se la consumer poi ignora e usa edge.data.*)
    const code = `
      async Task<(bool, string)> validate(PolyglotValidationContext context) {
        return (true, "Conditional edge evaluated by consumer");
      }
    `;
    return { ...edge, code };
  },
});
