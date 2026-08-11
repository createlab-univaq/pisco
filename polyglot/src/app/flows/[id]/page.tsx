import FlowEditorClient from "./FlowEditorClient";

export default function FlowEditorPage({ params }: { params: { id: string } }) {
  // We extract the ID on the server and pass it down to our interactive client module
  return <FlowEditorClient flowId={params.id} />;
}