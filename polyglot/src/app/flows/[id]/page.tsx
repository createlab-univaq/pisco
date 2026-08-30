import FlowEditorClient from './FlowEditorClient';

type FlowEditorPageProps = {
  // params is now a Promise in Next.js 15+
  params: Promise<{ id: string }>;
};

export default async function FlowEditorPage({ params }: FlowEditorPageProps) {
  const { id } = await params;

  return <FlowEditorClient flowId={id} />;
}