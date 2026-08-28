import useSWR from 'swr';
import { PolyglotFlow } from '@/types/PolyglotFlow';
import { PolyglotFlowInfo } from '@/types/PolyglotFlowInfo';
import { polyglotEdgeComponentMapping, polyglotNodeComponentMapping } from '@/components/ElementMapping';
import { createNewDefaultPolyglotFlow } from '@/lib/factories/polyglotGenerators';

// --- MOCK CONFIGURATION ---
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
const MOCK_STORAGE_KEY = 'debug_mock_flows';

// --- IN-MEMORY MOCK FILE REGISTRY FOR URL.createObjectURL ---
const mockFileStore = new Map<string, Blob>();

const getMockFlows = (): PolyglotFlow[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(MOCK_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveMockFlows = (flows: PolyglotFlow[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(flows));
};
// --------------------------

export const fetcher = async (url: string) => {
  if (USE_MOCK && url.startsWith('/api/flows')) {
    const parts = url.split('?')[0].split('/');
    if (parts.length === 3) {
      return getMockFlows();
    } else if (parts.length === 4) {
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

async function fetchMutate<T>(url: string, options: RequestInit = {}): Promise<T> {
  // --- DEBUG MOCK INTERCEPTIONS ---
  if (USE_MOCK) {
    const urlParts = url.split('?')[0].split('/');
    const method = options.method || 'GET';
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

    // 2. MOCK FILE API (With In-Memory Blob Store for URL.createObjectURL support)
    if (url.startsWith('/api/file')) {
      if (method === 'POST') {
        const formData = options.body as FormData;
        const fileObj = formData instanceof FormData ? formData.get('file') : null;
        const imageId = `dummy-img-${Date.now()}`;

        if (fileObj instanceof Blob) {
          mockFileStore.set(imageId, fileObj);
        } else {
          const dummyBlob = new Blob(
            [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 11, 73, 68, 65, 84, 120, 156, 99, 250, 255, 255, 63, 0, 5, 254, 2, 254, 166, 41, 202, 185, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130])],
            { type: 'image/png' }
          );
          mockFileStore.set(imageId, dummyBlob);
        }
        return { imageId } as unknown as T;
      }

      if (method === 'GET') {
        const fileId = url.split('/').pop() || '';
        const storedBlob = mockFileStore.get(fileId);
        if (storedBlob) {
          return storedBlob as unknown as T;
        }
        const dummyBlob = new Blob(
          [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 11, 73, 68, 65, 84, 120, 156, 99, 250, 255, 255, 63, 0, 5, 254, 2, 254, 166, 41, 202, 185, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130])],
          { type: 'image/png' }
        );
        return dummyBlob as unknown as T;
      }

      if (method === 'DELETE') {
        const fileId = url.split('/').pop() || '';
        mockFileStore.delete(fileId);
        return {} as unknown as T;
      }
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