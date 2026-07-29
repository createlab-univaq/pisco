import { NextFunction, Request, Response } from "express";
import PolyglotFlowModel from "../models/flow.model";
import { PolyglotFlow } from "../types/PolyglotFlow";
import { Document } from "mongoose";
import { PolyglotNodeModel } from "../models/node.model";
import { PolyglotEdge, PolyglotFlowInfo, PolyglotNode } from "../types";
import { PolyglotEdgeModel } from "../models/edge.models";
import { DOMAIN_APP_DEPLOY } from "../utils/secrets";

function customizeErrorMessage(err: any) {
  console.log(err.message);
  if (err.message.search("title") != -1)
    return "To create a flow a title is required";
  if (err.message.search("description") != -1)
    return "To create a flow a description is required";
  if (err.message.search("duration") != -1)
    return "The duration need to be a number, please correct or remove any characters, you can always change it later on. (For decimals use dot)";
  return err.message;
}

export async function deleteFlow(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const resp = await PolyglotFlowModel.deleteOne({
      _id: req.params.id,
      author: req.user?._id,
    });
    console.log(resp);
    res.status(204).json();
  } catch (error) {
    next(error);
  }
}

export async function serverCleanUp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.params.password != "polyglotClean") throw "Wrong password";

    const resp = await PolyglotFlowModel.deleteMany({ nodes: [] });
    console.log(resp);

    const resp2 = await PolyglotFlowModel.deleteMany({
      nodes: { $size: 1 },
    });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
}

/*
    Get flow by id
    @route GET /flows/:id
*/
export async function getFlowById(
  req: Request,
  res: Response<Document<unknown, any, PolyglotFlow> & PolyglotFlow>,
  next: NextFunction,
) {
  // await param("id", "UUID v4 is required").isUUID(4).run(req);

  try {
    const flow = await PolyglotFlowModel.findById(req.params.id)
      .populate("nodes")
      .populate("edges");
    if (!flow) {
      return res.status(404).send();
    }
    //filter function for nodes
    let seen: string[] = ["default"];
    const filteredNodes = flow.nodes.filter((node) => {
      if (seen.includes(node._id)) {
        console.log("catch");
        return false;
      } else {
        seen.push(node._id);
        return true;
      }
    });
    flow.nodes = filteredNodes;
    if (!flow) {
      return res.status(404).send();
    }
    return res.status(200).send(flow);
  } catch (err: any) {
    return res.status(500).send(err);
  }
}

export async function downloadNotebookVSC(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const template = `#!csharp

#r "nuget: Polyglot.Interactive, 0.0.3-*"

#!csharp

#!polyglot-setup --flowid ${req.params.id} --serverurl http${DOMAIN_APP_DEPLOY.includes("localhost") ? "" : "s"}://${DOMAIN_APP_DEPLOY}`;

  const file = Buffer.from(template);
  res.setHeader("Content-Length", file.length);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=notebook-${req.params.id}.dib`,
  );
  res.write(file, "binary");
  res.end();
}

//2nd version of notebook with ctx information
export async function downloadNotebookVSC2(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const template = `#!csharp

#r "nuget: Polyglot.Interactive, 0.0.3-*"

#!csharp

#!polyglot-setup --flowid ${req.params.id} --serverurl http${DOMAIN_APP_DEPLOY.includes("localhost") ? "" : "s"}://${DOMAIN_APP_DEPLOY} --contextid ${req.params.ctxId}`;

  const file = Buffer.from(template);
  res.setHeader("Content-Length", file.length);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${req.params.filename}`,
  );
  res.write(file, "binary");
  res.end();
}

// version of notebook with only ctx information
export async function downloadNotebookVSCCTX(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const template = `#!csharp

#r "nuget: Polyglot.Interactive, 0.0.3-*"

#!csharp

#!polyglot-setup --serverurl http${DOMAIN_APP_DEPLOY.includes("localhost") ? "" : "s"}://${DOMAIN_APP_DEPLOY} --contextid ${req.params.ctxId}`;

  const file = Buffer.from(template);
  res.setHeader("Content-Length", file.length);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${req.params.filename}`,
  );
  res.write(file, "binary");
  res.end();
}

/*
    Get all the flows FIX: refactor with auth
    @route GET /flows
*/
export async function getFlowList(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // await param("id", "UUID v4 is required").isUUID(4).run(req);

  try {
    const q = req.query?.q?.toString();
    const me = req.query?.me?.toString();
    // FIXME: create privacy policy in order to display only the right flows
    const query: any = q ? { title: { $regex: q, $options: "i" } } : {};
    if (me) {
      query.author = req.user?._id;
    }
    const flows: Omit<
      Document<unknown, any, PolyglotFlow> &
        Omit<
          PolyglotFlowInfo & {
            nodes: string[];
            edges: PolyglotEdge[];
          } & Required<{
              _id: string;
            }>,
          never
        >,
      never
    >[] = await PolyglotFlowModel.find(query).populate("author", "username");
    //filter function for nodes
    let seen: string[] = ["default"];
    const filteredFlows = flows.map((flow) => {
      const filteredNodes = flow.nodes.filter((node) => {
        if (seen.includes(node)) return false;
        else {
          seen.push(node);
          return true;
        }
      });
      console.log(filteredNodes);
      flow.nodes = filteredNodes;
      return flow;
    });
    if (!filteredFlows) {
      return res.status(404).send();
    }
    return res.status(200).send(filteredFlows);
  } catch (err: any) {
    return res.status(500).send(err);
  }
}

type ConditionalOperator = ">" | ">=" | "<" | "<=" | "==";

class BadRequestError extends Error {
  statusCode = 400;
  constructor(message: string) {
    super(message);
  }
}

function getQuestionCountFromNode(node: any): number | null {
  if (!node) return null;
  const t = node.type;
  const d = node.data;

  if (t === "EmotionAttributionTestNode") return Array.isArray(d?.questions) ? d.questions.length : 0;
  if (t === "EyesTaskTestNode") return Array.isArray(d?.questions) ? d.questions.length : 0;
  if (t === "TeoriaDellaMenteNode") return Array.isArray(d?.quiz) ? d.quiz.length : 0;
  if (t === "FauxPasNode") return Array.isArray(d?.quiz) ? d.quiz.length : 0;
  if (t === "socialSituationsNode") return Array.isArray(d?.items) ? d.items.length : 0;
  return null;
}

function toRange(op: ConditionalOperator, th: number, Q: number): [number, number] {
  switch (op) {
    case "==": return [th, th];
    case ">":  return [th + 1, Q];
    case ">=": return [th, Q];
    case "<":  return [0, th - 1];
    case "<=": return [0, th];
  }
}

function normalizeRange(r: [number, number], Q: number): [number, number] {
  const a = Math.max(0, Math.min(Q, r[0]));
  const b = Math.max(0, Math.min(Q, r[1]));
  return a <= b ? [a, b] : [1, 0]; // range vuoto
}

function rangesOverlap(a: [number, number], b: [number, number]) {
  return a[0] <= b[1] && b[0] <= a[1];
}

function validateNoOverlappingConditionalEdges(flow: any) {
  // valida solo quando arrivano NODES/EDGES come oggetti (non come id stringhe)
  if (!Array.isArray(flow?.nodes) || !Array.isArray(flow?.edges)) return;
  if (flow.nodes.length === 0 || flow.edges.length === 0) return;
  if (typeof flow.nodes[0] !== "object" || typeof flow.edges[0] !== "object") return;

  const nodesById = new Map<string, any>();
  for (const n of flow.nodes) {
    const id = n?._id || n?.reactFlow?.id;
    if (id) nodesById.set(id, n);
  }

  // raggruppa conditionalEdge per source
  const bySource = new Map<string, any[]>();
  for (const e of flow.edges) {
    if (e?.type !== "conditionalEdge") continue;
    const source = e?.reactFlow?.source;
    if (!source) continue;
    const arr = bySource.get(source) ?? [];
    arr.push(e);
    bySource.set(source, arr);
  }

  for (const [sourceId, edges] of bySource.entries()) {
    const sourceNode = nodesById.get(sourceId);
    const Q = getQuestionCountFromNode(sourceNode);

    // Se non conosco Q, non posso garantire disgiunzione.
    // Se vuoi essere "strict", lancia errore; altrimenti skip.
    if (typeof Q !== "number" || !Number.isFinite(Q)) continue;

    const ranges: Array<{ edgeId: string; range: [number, number] }> = edges.map((e) => {
      const op = (e?.data?.operator ?? ">=") as ConditionalOperator;
      const th = Math.floor(Number(e?.data?.threshold ?? 0));
      const r = normalizeRange(toRange(op, th, Q), Q);
      return { edgeId: e?._id ?? e?.reactFlow?.id ?? "unknown", range: r };
    });

    // check overlap pairwise
    for (let i = 0; i < ranges.length; i++) {
      for (let j = i + 1; j < ranges.length; j++) {
        if (rangesOverlap(ranges[i].range, ranges[j].range)) {
          throw new BadRequestError(
            `Conditional edges overlap on source node ${sourceId}: ` +
              `${ranges[i].edgeId}=${JSON.stringify(ranges[i].range)} intersects ` +
              `${ranges[j].edgeId}=${JSON.stringify(ranges[j].range)} (Q=${Q}).`
          );
        }
      }
    }
  }
}


export const updateFlowQuery = async (
  id: string,
  flow: PolyglotFlow &
    (
      | { nodes: PolyglotNode[]; edges: PolyglotEdge[] }
      | { nodes: string[]; edges: string[] }
    ),
) => {
  const currentFlow = await PolyglotFlowModel.findOne({ _id: id })
    .populate("nodes", "type")
    .populate("edges", "type");

  if (!currentFlow) {
    console.log("Flow not found");
    return null;
  }

  // ----------------------------
  // TYPE GUARDS: nodes/edges popolati o solo ids?
  // ----------------------------
  const nodesAreObjects =
    Array.isArray((flow as any).nodes) &&
    (flow as any).nodes.length > 0 &&
    typeof (flow as any).nodes[0] === "object";

  const edgesAreObjects =
    Array.isArray((flow as any).edges) &&
    (flow as any).edges.length > 0 &&
    typeof (flow as any).edges[0] === "object";

  // Validazione semantica (solo se ho i nodi/edge completi)
  // (Questa deve lanciare errore se trova overlap)
  if (nodesAreObjects && edgesAreObjects) {
    validateNoOverlappingConditionalEdges(flow);
  }

  const nodeIds: string[] = [];
  const edgesIds: string[] = [];

  // ----------------------------
  // NODES
  // ----------------------------
  if (nodesAreObjects) {
    let nodes: { [k: string]: any } = {};
    if (PolyglotNodeModel.discriminators) {
      Object.keys(PolyglotNodeModel.discriminators).forEach((key) => {
        nodes[key] = [];
      });
    }

    await Promise.all(
      ((flow as any).nodes as PolyglotNode[])?.map(async (obj: PolyglotNode) => {
        const existing = currentFlow.nodes.filter((node: any) => node._id === obj._id);
        if (existing.length && obj.type !== existing[0].type) {
          await PolyglotNodeModel.findByIdAndDelete(obj._id);
        }

        if (obj._id) nodeIds.push(obj._id);

        // sicurezza: se per qualche motivo manca nodes[obj.type], inizializzo
        if (!nodes[obj.type]) nodes[obj.type] = [];

        nodes[obj.type].push({
          updateOne: {
            filter: { _id: obj._id || obj.reactFlow.id },
            update: obj,
            upsert: true,
          },
        });
      }) ?? [],
    );

    await Promise.all(
      Object.keys(nodes).map(async (key: string) => {
        try {
          const result = await PolyglotNodeModel.discriminators?.[key].bulkWrite(
            nodes[key],
            { ordered: false },
          );
          if (result?.upsertedIds) {
            nodeIds.push(
              ...Object.keys(result.upsertedIds).map((k) => result.upsertedIds[+k]),
            );
          }
        } catch (e) {
          console.log(e);
        }
      }),
    );

    // FIX: assicuro che il flow venga salvato con ids
    (flow as any).nodes = nodeIds;
  } else if (Array.isArray((flow as any).nodes)) {
    // nodes sono già ids
    (flow as any).nodes = (flow as any).nodes;
  }

  // ----------------------------
  // EDGES
  // ----------------------------
  if (edgesAreObjects) {
    let edges: { [k: string]: any } = {};
    if (PolyglotEdgeModel.discriminators) {
      Object.keys(PolyglotEdgeModel.discriminators).forEach((key) => {
        edges[key] = [];
      });
    }

    await Promise.all(
      ((flow as any).edges as PolyglotEdge[])?.map(async (obj: PolyglotEdge) => {
        const existing = currentFlow.edges.filter((edge: any) => edge._id === obj._id);
        if (existing.length && obj.type !== existing[0].type) {
          await PolyglotEdgeModel.findByIdAndDelete(obj._id);
        }

        if (obj._id) edgesIds.push(obj._id);

        if (!edges[obj.type]) edges[obj.type] = [];

        edges[obj.type].push({
          updateOne: {
            filter: { _id: obj._id || (obj as any).reactFlow?.id },
            update: obj,
            upsert: true,
          },
        });
      }) ?? [],
    );

    await Promise.all(
      Object.keys(edges).map(async (key: string) => {
        try {
          const result = await PolyglotEdgeModel.discriminators?.[key].bulkWrite(
            edges[key],
            { ordered: true },
          );
          if (result?.upsertedIds) {
            edgesIds.push(
              ...Object.keys(result.upsertedIds).map((k) => result.upsertedIds[+k]),
            );
          }
        } catch (e) {
          console.log(e);
        }
      }),
    );

    (flow as any).edges = edgesIds;
  } else if (Array.isArray((flow as any).edges)) {
    // edges sono già ids
    (flow as any).edges = (flow as any).edges;
  }

  return await PolyglotFlowModel.findByIdAndUpdate(id, flow, { new: true });
};


/*
    Update flow with given id
    @route PUT /flows/:id
*/
export async function updateFlow(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // await param("id", "UUID v4 is required").isUUID(4).run(req);
  // TODO: FIXME: custom validation here for flow
  // await body("flow", "Flow is required").exists().run(req);

  try {
    const flow = await updateFlowQuery(req.params.id, req.body);

    if (!flow) {
      return res.status(404).send();
    }
    return res.status(200).send(flow);
  } catch (err: any) {
    err.message = customizeErrorMessage(err);
    return res.status(500).send(err);
  }
}

//function to publish the flow (change publish to true)
export async function publishFlow(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    req.body.publish = true;

    const flows = await updateFlowQuery(req.params.id, req.body);

    if (!flows) {
      return res.status(404).send();
    }

    return res.status(200).send(flows);
  } catch (err) {
    return res.status(500).send(err);
  }
}

export async function createFlow(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const newFlow = req.body as PolyglotFlowInfo;
    newFlow.author = req.user?._id;

    const flow = await PolyglotFlowModel.create(newFlow);
    return res.status(200).send(flow);
  } catch (err: any) {
    err.message = customizeErrorMessage(err);
    return res.status(500).send(err);
  }
}

export async function createFlowJson(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = req.body as PolyglotFlowInfo & {
      nodes: PolyglotNode[];
      edges: PolyglotEdge[];
    };
    input.author = req.user?._id;

    const filtered = JSON.parse(JSON.stringify(input));
    filtered.nodes = [];
    filtered.edges = [];
    delete filtered["_id"];

    const flow = await PolyglotFlowModel.create(filtered);
    input._id = flow._id;
    const newFlow = await updateFlowQuery(flow._id, input);
    if (!newFlow) return res.status(500).json({ error: "internal error" });

    return res.status(200).send({ id: newFlow?._id });
  } catch (err: any) {
    console.log(err);
    err.message = customizeErrorMessage(err);
    return res.status(500).send(err);
  }
}
