import axiosCreate, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import Router from 'next/router';
import { GeneralMetadata, Metadata } from '../types/metadata';
import {
  ManualProgressInfo,
  PolyglotCourse,
  PolyglotCourseInfo,
  polyglotEdgeComponentMapping,
  PolyglotFlow,
  PolyglotFlowInfo,
  polyglotNodeComponentMapping,
  ProgressInfo,
} from '../types/polyglotElements';
import { User } from '../types/user';
import { createNewDefaultPolyglotFlow } from '../utils/utils';
import exampleFlows from './exampleData';

const axios = axiosCreate.create({
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const axiosProgress = axiosCreate.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

type AutocompleteOutput = string[];

export class APIV2 {
  [x: string]: any;
  axios: AxiosInstance;
  redirect401: boolean;
  redirect401URL?: string;
  error401: boolean;

  constructor(access_token: string | undefined) {
    this.redirect401 = false;
    this.error401 = true;
    this.axios = axiosCreate.create({
      headers: {
        'Content-Type': 'application/json',
        Authorization: access_token ? 'Bearer ' + access_token : '',
      },
    });
  }

  setRedirect401(check: boolean, redirect_url?: string) {
    this.redirect401 = check;
    this.redirect401URL = redirect_url;
    return this;
  }

  disable401() {
    this.error401 = false;
    return this;
  }

  async handleGet(path: string) {
    try {
      const resp = await this.axios.get(path);
      return resp;
    } catch (err) {
      if ((err as AxiosError)?.response?.status === 401) {
        const BACK_URL = process.env.BACK_URL;
        const LOGIN_URL =
          BACK_URL + '/api/auth/google?returnUrl=' + Router.asPath;
        if (this.redirect401) await Router.push(LOGIN_URL);
        if (this.error401) throw err;
        return;
      }
      throw err;
    }
  }
  autocomplete(query?: string): Promise<AxiosResponse<AutocompleteOutput>> {
    return this.axios.get('/api/search/autocomplete' + query);
  }
  getUserInfo(): Promise<AxiosResponse<User>> {
    return this.axios.get('/api/user/me');
  }
  logout(): Promise<AxiosResponse> {
    return this.axios.post('/api/auth/logout');
  }
  loadExampleFlowElementsAsync(flowId: string): any {
    const flow = exampleFlows.get(flowId);
    return Promise.resolve({
      data: flow!,
      status: flow ? 200 : 404,
      statusText: flow ? 'OK' : 'Not Found',
      headers: {},
      config: {
        headers: {},
      },
    });
  }

  deleteFlow(flowId: string): Promise<AxiosResponse> {
    return this.axios.delete('/api/flows/' + flowId);
  }

  loadFlowElementsAsync(flowId: string): Promise<AxiosResponse<PolyglotFlow>> {
    return this.axios.get(`/api/flows/${flowId}`);
  }
  loadFlowList(query?: string): Promise<AxiosResponse<PolyglotFlow[]>> {
    return this.axios.get(`/api/flows` + (query ? query : ''));
  }
  createNewFlowAsync(): Promise<AxiosResponse> {
    return this.axios.post<{}, AxiosResponse, PolyglotFlow>(
      `/api/flows`,
      createNewDefaultPolyglotFlow()
    );
  }
  saveFlowAsync(flow: PolyglotFlow): Promise<AxiosResponse> {
    flow.nodes = flow.nodes?.map((e) =>
      polyglotNodeComponentMapping.applyTransformFunction(e)
    );
    flow.edges = flow.edges.filter((edge) => {
      const source = edge.reactFlow.source;
      const target = edge.reactFlow.target;
      return (
        flow.nodes.filter((node) => node._id === source || node._id === target)
          .length === 2
      );
    });
    flow.edges = flow.edges?.map((e) =>
      polyglotEdgeComponentMapping.applyTransformFunction(e)
    );
    return this.axios.put<{}, AxiosResponse, PolyglotFlow>(
      `/api/flows/${flow._id}`,
      flow
    );
  }
  createNewFlow(flow: PolyglotFlowInfo): Promise<AxiosResponse> {
    return this.axios.post<{}, AxiosResponse, {}>(`/api/flows`, flow);
  }
  createNewFlowJson(flow: PolyglotFlow): Promise<AxiosResponse> {
    return this.axios.post<{}, AxiosResponse, {}>(`/api/flows/json`, flow);
  }

  loadCourses(query?: string): Promise<AxiosResponse<PolyglotCourse[]>> {
    return this.axios.get('/api/course' + (query ? query : ''));
  }

  createNewCourse(course: PolyglotCourseInfo): Promise<AxiosResponse> {
    return this.axios.post('/api/course', course);
  }

  deleteCourse(courseId: string): Promise<AxiosResponse> {
    return this.axios.delete('/api/course/' + courseId);
  }
}

export const API = {
  edgeMetadata: (type: string): Promise<AxiosResponse<Metadata>> => {
    return axios.get('/api/metadata/edge/' + type);
  },
  nodeMetadata: (type: string): Promise<AxiosResponse<Metadata>> => {
    return axios.get('/api/metadata/node/' + type);
  },
  generalNodeMetadata: (): Promise<AxiosResponse<GeneralMetadata>> => {
    return axios.get('/api/metadata/node');
  },
  generalEdgeMetadata: (): Promise<AxiosResponse<GeneralMetadata>> => {
    return axios.get('/api/metadata/edge');
  },
  autocomplete: (
    query?: string
  ): Promise<AxiosResponse<AutocompleteOutput>> => {
    return axios.get('/api/search/autocomplete?q=' + query);
  },
  getUserInfo: (): Promise<AxiosResponse<User>> => {
    return axios.get('/api/user/me');
  },
  loadExampleFlowElementsAsync: (flowId: string): any => {
    const flow = exampleFlows.get(flowId);
    return Promise.resolve({
      data: flow!,
      status: flow ? 200 : 404,
      statusText: flow ? 'OK' : 'Not Found',
      headers: {},
      config: {},
    });
  },

  loadFlowElementsAsync: (
    flowId: string
  ): Promise<AxiosResponse<PolyglotFlow>> => {
    return axios.get<PolyglotFlow>(`/api/flows/${flowId}`);
  },
  loadFlowList: (query?: string): Promise<AxiosResponse<PolyglotFlow[]>> => {
    const queryParams = query ? '?q=' + query : '';
    return axios.get(`/api/flows` + queryParams);
  },
  createNewFlowAsync: (): Promise<AxiosResponse> => {
    return axios.post<{}, AxiosResponse, PolyglotFlow>(
      `/api/flows`,
      createNewDefaultPolyglotFlow()
    );
  },
  createNewFlowJson(flow: PolyglotFlow): Promise<AxiosResponse> {
    return axios.post<{}, AxiosResponse, {}>(`/api/flows/json`, flow);
  },
  saveFlowAsync: (flow: PolyglotFlow): Promise<AxiosResponse> => {
    flow.nodes = flow.nodes?.map((e) =>
      polyglotNodeComponentMapping.applyTransformFunction(e)
    );
    flow.edges = flow.edges?.map((e) =>
      polyglotEdgeComponentMapping.applyTransformFunction(e)
    );
    return axios.put<{}, AxiosResponse, PolyglotFlow>(
      `/api/flows/${flow._id}`,
      flow
    );
  },
  createNewFlow: (flow: PolyglotFlow): Promise<AxiosResponse> => {
    return axios.post<{}, AxiosResponse, {}>(`/api/flows`, flow);
  },

  progressInfo: (body: ProgressInfo): Promise<AxiosResponse> => {
    return axiosProgress.post<{}, AxiosResponse, {}>(
      `/api/execution/progressInfo`,
      body
    );
  },

  manualProgress: (body: ManualProgressInfo): Promise<AxiosResponse> => {
    return axiosProgress.post<{}, AxiosResponse, {}>(
      `/api/execution/progressAction`,
      body
    );
  },

  resetProgress: (body: ManualProgressInfo): Promise<AxiosResponse> => {
    return axiosProgress.post<{}, AxiosResponse, {}>(
      `/api/execution/resetProgress`,
      body
    );
  },

  getActualNodeInfo: (body: { ctxId: string }): Promise<AxiosResponse> => {
    return axiosProgress.post<{}, AxiosResponse, {}>(
      `/api/execution/actual`,
      body
    );
  },

  // API images (S3 + imageId)
  uploadImageGeneric: (body: {
    parentNodeId: string;
    parentItemId?: string; // nuovo opzionale
    file: File;
  }): Promise<AxiosResponse<{ imageId: string }>> => {
    const fd = new FormData();
    fd.append('file', body.file); // MUST be "file"
    fd.append('parentNodeId', body.parentNodeId);

    // aggiungi solo se presente
    if (body.parentItemId) {
      fd.append('parentItemId', body.parentItemId);
    }

    return axiosProgress.post(`/api/file/upload`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  downloadByFileId: (body: { fileId: string }): Promise<AxiosResponse> => {
    return axiosProgress.get(`/api/file/${body.fileId}`, {
      responseType: 'blob',
    });
  },

  deleteByFileId: (body: { fileId: string }): Promise<AxiosResponse> => {
    return axiosProgress.delete(`/api/file/${body.fileId}`);
  },

  // Delete all files belonging to a node (called when deleting a node)
  deleteAllNodeFiles: (body: { nodeId: string }): Promise<AxiosResponse> => {
    return axiosProgress.delete(`/api/file/node/${body.nodeId}`);
  },

  // Delete all files belonging to an item inside a node (container child)
  deleteItemFiles: (body: {
    nodeId: string;
    itemId: string;
  }): Promise<AxiosResponse> => {
    return axiosProgress.delete(
      `/api/file/node/${body.nodeId}/item/${body.itemId}`
    );
  },
};
