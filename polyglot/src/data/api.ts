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

// --- MOCK CONFIGURATION ---
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
const MOCK_STORAGE_KEY = 'debug_mock_flows';

const getMockFlows = (): PolyglotFlow[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(MOCK_STORAGE_KEY);
  if (!data) {
    return [];
  }
  return JSON.parse(data);
};

const saveMockFlows = (flows: PolyglotFlow[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(flows));
};
// --------------------------

export const fetcher = async (url: string) => {
  // Mock interception for GET requests starting with /api/flows
  if (USE_MOCK && url.startsWith('/api/flows')) {
    const parts = url.split('?')[0].split('/');
    if (parts.length === 3) {
      // GET /api/flows
      return getMockFlows();
    } else if (parts.length === 4) {
      // GET /api/flows/[id]
      const id = parts[3];
      const flows = getMockFlows();
      const flow = flows.find((f) => f._id === id);
      if (!flow) throw new Error('API Error 404: Flow not found');
      return flow;
    }
  }

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
};

// Generic internal fetch wrapper for mutations (and direct single GETs)
async function fetchMutate<T>(url: string, options: RequestInit = {}): Promise<T> {
  // --- DEBUG MOCK INTERCEPTIONS ---
  if (USE_MOCK) {
    const urlParts = url.split('?')[0].split('/');
    const method = options.method || 'GET';
    // Safely parse body if it's a string, ignore FormData
    const body = options.body && typeof options.body === 'string' ? JSON.parse(options.body) : null;

    // 1. MOCK FLOWS API
    if (url.startsWith('/api/flows')) {
      if (urlParts.length === 4 && method === 'GET') {
        const id = urlParts[3];
        const flows = getMockFlows();
        const flow = flows.find((f) => f._id === id);
        if (!flow) throw new Error('API Error 404: Flow not found');
        return flow as unknown as T;
      }

      if (urlParts.length === 3 && method === 'POST') {
        const flows = getMockFlows();
        const newFlow: PolyglotFlow = {
          _id: `mock-flow-${Date.now()}`,
          title: body?.title || 'New Flow',
          description: body?.description || '',
          tags: body?.tags || [],
          publish: body?.publish || false,
          nodes: body?.nodes || [],
          edges: body?.edges || [],
          ...(body || {}),
        };
        flows.push(newFlow);
        saveMockFlows(flows);
        return newFlow as unknown as T;
      }

      if (urlParts.length === 4 && urlParts[3] === 'json' && method === 'POST') {
        const flows = getMockFlows();
        const newFlow: PolyglotFlow = {
          ...body,
          _id: body?._id || `mock-flow-${Date.now()}`,
        };
        const index = flows.findIndex((f) => f._id === newFlow._id);
        if (index >= 0) {
          flows[index] = newFlow;
        } else {
          flows.push(newFlow);
        }
        saveMockFlows(flows);
        return newFlow as unknown as T;
      }

      if (urlParts.length === 4 && method === 'PUT') {
        const id = urlParts[3];
        const flows = getMockFlows();
        const index = flows.findIndex((f) => f._id === id);
        const updatedFlow: PolyglotFlow = { ...body, _id: id };
        if (index >= 0) {
          flows[index] = updatedFlow;
        } else {
          flows.push(updatedFlow);
        }
        saveMockFlows(flows);
        return updatedFlow as unknown as T;
      }

      if (urlParts.length === 4 && method === 'DELETE') {
        const id = urlParts[3];
        let flows = getMockFlows();
        flows = flows.filter((f) => f._id !== id);
        saveMockFlows(flows);
        return {} as T;
      }
    }

    // 2. MOCK METADATA API (Required for the properties panel to load without crashing)
    if (url.startsWith('/api/metadata')) {
      return {} as unknown as T;
    }

    // 3. MOCK FILES API (Required for the Image Upload property fields to work)
    if (url.startsWith('/api/file')) {
      if (method === 'POST') {
        // Return a dummy image ID immediately so the property panel registers an upload
        return { imageId: `dummy-img-${Date.now()}` } as unknown as T;
      }
      return {} as unknown as T;
    }

    // 4. MOCK USER API
    if (url.startsWith('/api/user')) {
      return { _id: 'debug-user', username: 'Debug Developer' } as unknown as T;
    }
  }
  // --------------------------------

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

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return {} as T;
  }

  if (options.headers && (options.headers as Record<string, string>)['Accept'] === 'application/octet-stream') {
    return res.blob() as unknown as T;
  }

  return res.json();
}

// ... Rest of the file (useFlows, UserAPI, MetadataAPI, FlowsAPI, CoursesAPI, ExecutionAPI, FilesAPI) remains exactly the same!
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