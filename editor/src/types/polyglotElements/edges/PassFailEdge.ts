import * as t from 'io-ts';
import PassFailEdgeProperties from '../../../components/Properties/Edges/PassFailEdgeProperties';
import { ReactFlowSmartBezierEdgePassFail } from '../../../components/ReactFlowEdge';
import { polyglotEdgeComponentMapping } from '../elementMapping';
import { defaultPolyglotEdgeData, EdgeData, PolyglotEdge } from './Edge';

export const PassFailEdgeConditionKind_IoTs = t.union([
  t.literal('pass'),
  t.literal('fail'),
]);
type PassFailEdgeConditionKind = t.TypeOf<
  typeof PassFailEdgeConditionKind_IoTs
>;

export type PassFailEdgeData = EdgeData & {
  conditionKind: PassFailEdgeConditionKind;
};

export type PassFailEdge = PolyglotEdge & {
  type: 'passFailEdge';
  data: PassFailEdgeData;
};

polyglotEdgeComponentMapping.registerMapping<PassFailEdge>({
  elementType: 'passFailEdge',
  name: 'Pass/Fail',
  propertiesComponent: PassFailEdgeProperties,
  elementComponent: ReactFlowSmartBezierEdgePassFail,
  defaultData: {
    ...defaultPolyglotEdgeData,
    conditionKind: 'pass',
  },
  transformData: (edge) => {
    const code = `
async Task<(bool, string)> validate(PolyglotValidationContext context) {
    var getMultipleChoiceAnswer = () => {
        var submitted = context.JourneyContext.EventsProduced.OfType<ReturnValueProduced>().FirstOrDefault()?.Value as HashSet<string>;
        var answersCorrect = ((List<object>)context.Exercise.Data.isChoiceCorrect).Select((c, i) => (c, i))
                                                                                .Where(c => bool.Parse(c.c.ToString()))
                                                                                .Select(c => (c.i + 1).ToString())
                                                                                .ToHashSet();
        return submitted.SetEquals(answersCorrect);
    };

    var isSubmissionCorrect = context.Exercise.NodeType switch
    {
        "multipleChoiceQuestionNode" => getMultipleChoiceAnswer(),
        _ => context.Exercise.Data.correctAnswers.Contains(context.JourneyContext.SubmittedCode),
    };

    var conditionKind = context.Condition.Data.conditionKind switch
    {
        "pass" => true,
        "fail" => false,
        _ => throw new Exception("Unknown condition kind")
    };
    return (conditionKind == isSubmissionCorrect, "Pass/Fail edge");
}    
`;

    return {
      ...edge,
      code,
    };
  },
});
