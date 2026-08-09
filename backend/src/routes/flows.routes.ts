import express from "express";
import { checkAuth } from "../middlewares/auth.middleware";
import { checkServiceToken } from "../middlewares/service.middleware";
import * as FlowController from "../controllers/flows.controllers";

const router = express.Router();

router
  .route("/")
  .get(checkAuth, FlowController.getFlowList)
  .post(checkAuth, FlowController.createFlow);

router.route("/json").post(checkAuth, FlowController.createFlowJson);

// Server-to-server only: the analyst dashboard reads the flow catalogue
// through game-api, which has no Google identity to authenticate with.
// MUST stay above "/:id", otherwise that route swallows "/catalog".
router.route("/catalog").get(checkServiceToken, FlowController.getFlowList);

// Same caller, single flow. The analyst dashboard resolves a patient's unique code
// into the full path (nodes + edges) and has no Google identity to present, so
// "/:id" below is unreachable for it.
//
// Both this and "/catalog" MUST return every flow regardless of author: the analyst
// assigns paths authored by other Polyglot users. If the privacy filtering noted in
// the getFlowList FIXME is ever added, it has to skip these two service routes or
// path resolution breaks for the dashboard.
//
// MUST stay above "/:id", same reason as "/catalog".
router.route("/catalog/:id").get(checkServiceToken, FlowController.getFlowById);

router
  .route("/:id")
  .get(checkAuth, FlowController.getFlowById)
  .put(checkAuth, FlowController.updateFlow)
  .delete(checkAuth, FlowController.deleteFlow);

router
  .route("/:password/serverClean") //API to clean the server from empty flows
  .get(FlowController.serverCleanUp);

router
  .route("/:id/runFirst") //first version of the notebook (run the execution from the first call)
  .get(FlowController.downloadNotebookVSC);

router
  .route("/:ctxId/run/:filename") // version of notebook with only ctx information
  .get(FlowController.downloadNotebookVSCCTX);

router
  .route("/:id/:ctxId/run/:filename") //2nd version of notebook with ctx information and flowId
  .get(FlowController.downloadNotebookVSC2);

router
  .route("/:id/publish") //function to publish the flow
  .put(checkAuth, FlowController.publishFlow);

export default router;
