import EdgeProperties from '../../../components/Properties/Edges/EdgeProperties';
import { ReactFlowSmartBezierEdge } from '../../../components/ReactFlowEdge';
import { polyglotEdgeComponentMapping } from '../elementMapping';
import { defaultPolyglotEdgeData, EdgeData, PolyglotEdge } from './Edge';

export type UnconditionalEdgeData = EdgeData & {};

export type UnconditionalEdge = PolyglotEdge & {
  type: 'unconditionalEdge';
  data: UnconditionalEdgeData;
};

polyglotEdgeComponentMapping.registerMapping<UnconditionalEdge>({
  elementType: 'unconditionalEdge',
  name: 'Unconditional',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  propertiesComponent: EdgeProperties,
  elementComponent: ReactFlowSmartBezierEdge,
  defaultData: {
    ...defaultPolyglotEdgeData,
  },
  transformData: (edge) => {
    const code = `
async Task<(bool, string)> validate(PolyglotValidationContext context) {
    return (true, "Unconditional edge");
}`;

    return {
      ...edge,
      code,
    };
  },
});
