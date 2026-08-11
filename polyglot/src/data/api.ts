import useSWR from 'swr';
import { PolyglotCourseInfo } from '@/types/polyglot-elements/PolyglotCourseInfo';
import { PolyglotCourse } from '@/types/polyglot-elements/PolyglotCourse';
import { PolyglotFlow } from '@/types/polyglot-elements/PolyglotFlow';
import { ManualProgressInfo } from '@/types/polyglot-elements/ManualProgressInfo';
import { ProgressInfo } from '@/types/polyglot-elements/ProgressInfo';
import { PolyglotFlowInfo } from '@/types/polyglot-elements/PolyglotFlowInfo';
import { User } from '@/types/User';
import { GeneralMetadata } from '@/types/metadata/GeneralMetadata';
import { PolyglotMetadata } from '@/types/metadata/PolyglotMetadata';
import { createNewDefaultPolyglotFlow } from '@/utils/utils';
import { polyglotEdgeComponentMapping, polyglotNodeComponentMapping } from '@/components/ElementMapping';
import exampleFlows from './exampleData';

export const fetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
};

// Generic internal fetch wrapper for mutations (POST, PUT, DELETE)
async function fetchMutate<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => 'Unknown Error');
    throw new Error(`API Error ${res.status}: ${errText}`);
  }

  // If the response is empty (like a 204 No Content delete), don't try to parse JSON
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return {} as T;
  }
  
  // If it's a blob (for file downloads)
  if (options.headers && (options.headers as Record<string, string>)['Accept'] === 'application/octet-stream') {
    return res.blob() as unknown as T;
  }

  return res.json();
}

export function useFlows(queryString: string = '') {
  const { data, error, isLoading, mutate } = useSWR<PolyglotFlow[]>(
    `/api/flows${queryString}`,
    fetcher
  );

  return {
    flows: data || [],
    isLoading,
    isError: error,
    mutateFlows: mutate,
  };
}

export const UserAPI = {
  getUserInfo: () => fetchMutate<User>('/api/user/me'),
  autocomplete: (query: string = '') =>
    fetchMutate<string[]>(`/api/search/autocomplete?q=${query}`),
};

export const MetadataAPI = {
  generalNode: () => fetchMutate<GeneralMetadata>('/api/metadata/node'),
  generalEdge: () => fetchMutate<GeneralMetadata>('/api/metadata/edge'),
  node: (type: string) => fetchMutate<PolyglotMetadata>(`/api/metadata/node/${type}`),
  edge: (type: string) => fetchMutate<PolyglotMetadata>(`/api/metadata/edge/${type}`),
};

export const FlowsAPI = {
  getById: (flowId: string) => fetchMutate<PolyglotFlow>(`/api/flows/${flowId}`),
  
  createDefault: () =>
    fetchMutate<PolyglotFlow>(`/api/flows`, {
      method: 'POST',
      body: JSON.stringify(createNewDefaultPolyglotFlow()),
    }),
  
  create: (flow: PolyglotFlowInfo) =>
    fetchMutate<PolyglotFlow>(`/api/flows`, {
      method: 'POST',
      body: JSON.stringify(flow),
    }),
  
  createFromJson: (flow: PolyglotFlow) =>
    fetchMutate<PolyglotFlow>(`/api/flows/json`, {
      method: 'POST',
      body: JSON.stringify(flow),
    }),

  delete: (flowId: string) =>
    fetchMutate(`/api/flows/${flowId}`, { method: 'DELETE' }),

  save: (flow: PolyglotFlow) => {
    const processedNodes = flow.nodes?.map((n) =>
      polyglotNodeComponentMapping.applyTransformFunction(n)
    ) || [];

    const processedEdges = flow.edges
      ?.filter((edge) => {
        const hasSource = processedNodes.some((n) => n._id === edge.reactFlow?.source);
        const hasTarget = processedNodes.some((n) => n._id === edge.reactFlow?.target);
        return hasSource && hasTarget;
      })
      .map((e) => polyglotEdgeComponentMapping.applyTransformFunction(e)) || [];

    return fetchMutate<PolyglotFlow>(`/api/flows/${flow._id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...flow, nodes: processedNodes, edges: processedEdges }),
    });
  },

  loadExample: (flowId: string): Promise<PolyglotFlow> => {
    const flow = exampleFlows.get(flowId);
    if (!flow) return Promise.reject(new Error('Not Found'));
    return Promise.resolve(flow);
  },
};

export const CoursesAPI = {
  list: (queryString: string = '') =>
    fetchMutate<PolyglotCourse[]>(`/api/course${queryString}`),
  
  create: (course: PolyglotCourseInfo) =>
    fetchMutate<PolyglotCourse>('/api/course', {
      method: 'POST',
      body: JSON.stringify(course),
    }),
  
  delete: (courseId: string) =>
    fetchMutate(`/api/course/${courseId}`, { method: 'DELETE' }),
};

export const ExecutionAPI = {
  progressInfo: (body: ProgressInfo) =>
    fetchMutate('/api/execution/progressInfo', { method: 'POST', body: JSON.stringify(body) }),
  
  manualProgress: (body: ManualProgressInfo) =>
    fetchMutate('/api/execution/progressAction', { method: 'POST', body: JSON.stringify(body) }),
  
  resetProgress: (body: ManualProgressInfo) =>
    fetchMutate('/api/execution/resetProgress', { method: 'POST', body: JSON.stringify(body) }),
  
  getActualNodeInfo: (ctxId: string) =>
    fetchMutate('/api/execution/actual', { method: 'POST', body: JSON.stringify({ ctxId }) }),
};

export const FilesAPI = {
  uploadGeneric: (parentNodeId: string, file: File, parentItemId?: string) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('parentNodeId', parentNodeId);
    if (parentItemId) fd.append('parentItemId', parentItemId);

    return fetchMutate<{ imageId: string }>('/api/file/upload', {
      method: 'POST',
      body: fd,
    });
  },

  download: (fileId: string) =>
    fetchMutate<Blob>(`/api/file/${fileId}`, {
      headers: { Accept: 'application/octet-stream' }
    }),

  delete: (fileId: string) => fetchMutate(`/api/file/${fileId}`, { method: 'DELETE' }),

  deleteAllNodeFiles: (nodeId: string) =>
    fetchMutate(`/api/file/node/${nodeId}`, { method: 'DELETE' }),

  deleteItemFiles: (nodeId: string, itemId: string) =>
    fetchMutate(`/api/file/node/${nodeId}/item/${itemId}`, { method: 'DELETE' }),
};