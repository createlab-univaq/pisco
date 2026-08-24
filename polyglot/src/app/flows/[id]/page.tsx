import FlowEditorClient from './FlowEditorClient';

type FlowEditorPageProps = {
  // params is now a Promise in Next.js 15+
  params: Promise<{ id: string }>;
};

export default async function FlowEditorPage({ params }: FlowEditorPageProps) {
  // 1. Unwrap the params promise using await
  const { id } = await params;

  // 2. Pass the resolved id down to your client component
  return <FlowEditorClient flowId={id} />;
}