
import {
  PolyglotEdge,
  PolyglotFlow,
  PolyglotNode,
  PolyglotNodeValidation,
} from "../types";
import {
  getPathSelectorAlgorithm,
  pathSelectorMap,
} from "./algo/register";
import { DistrubutionAlgorithm } from "./algo/base";
export type ExecCtx = {
  flowId: string;
  username?: string;
  userId: string | null;
  gameId: string;
  currentNodeId: string;
  numberTrys?: number;
  execNodeInfo: ExecCtxNodeInfo;
};

export type ExecCtxNodeInfo = { [x: string]: any };

export type ExecProps = {
  ctx: ExecCtx;
  algo: string;
  flow: PolyglotFlow;
};

export class Execution {
  private ctx: ExecCtx;
  private algo: DistrubutionAlgorithm;
  private flow: PolyglotFlow;

  constructor(params: ExecProps) {
    const { ctx, algo, flow } = params;

    if (!pathSelectorMap[algo]) {
      throw Error("Path selector algorithm not set");
    }

    this.ctx = ctx;
    this.algo = getPathSelectorAlgorithm(algo, ctx);
    this.flow = flow;

    // TODO: refactor
    this.algo.setFlow(flow);
  }

  public static createCtx(
    flowId: string,
    currentNodeId: string,
    userId?: string,
    username?: string,
  ) {
    return {
      flowId: flowId,
      userId: userId ?? null,
      currentNodeId: currentNodeId,
      username: username ?? "guest",
      execNodeInfo: {},
    } as ExecCtx;
  }

  // TODO: check if the first node is an abstract node
  public getFirstExercise(
    username?: string,
    userId?: string,
  ): {
    ctx: ExecCtx;
    node: PolyglotNodeValidation | null;
  } {
    const nodesWithIncomingEdges = new Set(
      this.flow.edges.map((edge) =>
        this.flow.nodes.find(
          (node) => node.reactFlow.id === edge.reactFlow.target,
        ),
      ),
    );
    const nodesWithoutIncomingEdges = this.flow.nodes.filter(
      (node) => !nodesWithIncomingEdges.has(node),
    );
    // if (nodesWithoutIncomingEdges.length === 0) return null;

    const firstNode =
      nodesWithoutIncomingEdges[
        Math.floor(Math.random() * nodesWithoutIncomingEdges.length)
      ];
    const outgoingEdges = this.flow.edges.filter(
      (edge) => edge.reactFlow.source === firstNode.reactFlow.id,
    );

    const ctx = Execution.createCtx(
      this.flow._id,
      firstNode._id,
      userId,
      username,
    );

    const actualNode: PolyglotNodeValidation = {
      ...firstNode,
      validation: outgoingEdges.map((e) => ({
        id: e.reactFlow.id,
        title: e.title,
        code: e.code,
        data: e.data,
        type: e.type,
      })),
    };
    return {
      ctx: ctx,
      node: actualNode,
    };
  }

  public getCurrentNode() {
    return (
      this.flow.nodes.find((node) => node._id === this.ctx.currentNodeId) ??
      null
    );
  }

  public getActualNode(ctxId: string) {
    const currentNode = this.getCurrentNode();
    return this.selectAlgoRec(this.ctx.execNodeInfo, currentNode, null, ctxId);
  }

  private async selectAlgoRec(
    execNodeInfo: ExecCtxNodeInfo,
    currentNode: PolyglotNode | null,
    satisfiedEdges: PolyglotEdge[] | null,
    ctxId: string,
  ): Promise<{ ctx: ExecCtx; node: PolyglotNodeValidation | null }> {
    // caso in cui current node è null (fine esecuzione)
    if (!currentNode) {
      return { ctx: this.ctx, node: null };
    }
    const outgoingEdges = this.flow.edges.filter(
      (edge) => edge.reactFlow.source === currentNode.reactFlow.id,
    );
    const actualNode: PolyglotNodeValidation = {
      ...currentNode,
      validation: outgoingEdges.map((e) => ({
        id: e.reactFlow.id,
        title: e.title,
        code: e.code,
        data: e.data,
        type: e.type,
      })),
    };

    if (satisfiedEdges) {
      const possibleNextNodes = satisfiedEdges.map((edge) =>
        this.flow.nodes.find(
          (node) => node.reactFlow.id === edge.reactFlow.target,
        ),
      ) as PolyglotNode[];

      const { execNodeInfo, node } =
        this.algo.getNextExercise(possibleNextNodes);

      this.ctx.currentNodeId = node?.reactFlow.id;

      return await this.selectAlgoRec(execNodeInfo, node, null, ctxId);
    }

    // caso in cui mi sono calcolato il nodo successivo con l'algo normale e mi ha ritornato un nodo non astratto
    this.ctx.execNodeInfo = execNodeInfo;
    this.ctx.currentNodeId = currentNode.reactFlow.id; // todo check if needed
    return { ctx: this.ctx, node: actualNode };
  }

  private ghostNodeAdvance(
    execNodeInfo: ExecCtxNodeInfo,
    satisfiedEdges: PolyglotEdge[] | null,
    ctxId: string,
  ) {
    if (satisfiedEdges) {
      const currentNode = this.flow.nodes.find(
        (node) => node.reactFlow.id === satisfiedEdges[0].reactFlow.target,
      );
      if (!currentNode) return { ctx: this.ctx, node: null };
      const outgoingEdges = this.flow.edges.filter(
        (edge) => edge.reactFlow.source === currentNode.reactFlow.id,
      );
      const actualNode: PolyglotNodeValidation = {
        ...currentNode,
        validation: outgoingEdges.map((e) => ({
          id: e.reactFlow.id,
          title: e.title,
          code: e.code,
          data: e.data,
          type: e.type,
        })),
      };
      this.ctx.execNodeInfo = execNodeInfo;
      this.ctx.currentNodeId = currentNode.reactFlow.id; // todo check if needed
      return { ctx: this.ctx, node: actualNode };
    }
    return { ctx: this.ctx, node: null };
  }

  public async getNextExercise(
    satisfiedConditions: string[],
    ctxId: string,
  ): Promise<{ ctx: ExecCtx; node: PolyglotNodeValidation | null }> {
    const { userId, gameId } = this.ctx;
    const satisfiedEdges = this.flow.edges.filter((edge) =>
      satisfiedConditions.includes(edge.reactFlow.id),
    );

    if (this.ctx.currentNodeId == "ghostNode") {
      //ghost Execution done
      return await this.ghostNodeAdvance(
        this.ctx.execNodeInfo,
        satisfiedEdges,
        ctxId,
      );
    }

    const currentNode = this.getCurrentNode();

    return await this.selectAlgoRec(
      this.ctx.execNodeInfo,
      currentNode,
      satisfiedEdges,
      ctxId,
    );
  }
}
