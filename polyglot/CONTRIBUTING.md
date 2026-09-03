# Contributing to Polyglot

Welcome to the Polyglot project! We are thrilled you want to help expand our flow-based application. This guide outlines how to set up your local development environment, use our mock data system, and extend the core building blocks of the platform: **Nodes**, **Exercise Nodes**, and **Edges**.

By following these patterns, you ensure your contributions remain type-safe, integrate cleanly with our validation systems, and appear correctly in the editor UI.

---

## Getting Started: Local Development

To run the Polyglot application locally, you need Node.js installed.

1. **Clone the repository and install dependencies:**

```bash
git clone <repository-url>
cd polyglot
npm install
```

2. **Set up Environment Variables:**

Make a copy of `.env.example` in the root directory and rename it `.env` or `.env.local`. You will need to configure your API endpoint and the mock data flag.
```env
# API Configuration
# Use NEXT_PUBLIC_ prefix so it is accessible in client components
NEXT_PUBLIC_API_BASE_URL="[https://your-api-domain.com/api](https://your-api-domain.com/api)"

# Mock Data Toggle
USE_MOCK_DATA=true

# Max image upload size
MAX_UPLOAD_SIZE=10mb
```


3. **Understanding `USE_MOCK_DATA`:**
* When `USE_MOCK_DATA=true`: The application intercepts API calls and reads/writes to a local `mock-database.json` file. This is ideal for frontend UI development, building new nodes, and testing layouts without needing a live backend. Image uploads will generate local Base64 strings.
* When `USE_MOCK_DATA=false`: The application connects to the real backend defined in `NEXT_PUBLIC_API_BASE_URL`. Ensure your backend server is running and accessible.


4. **Start the development server:**
```bash
npm run dev
```

---

## How to Add a New Node

Adding a new standard node requires touching a few central registries and creating a standardized folder structure.

**Step 1: Define the Identifier**

* Update `src/types/NodeType.ts`: Add your new node type constant identifier (e.g., `YOUR_NEW_NODE: 'YourNewNode'`).

**Step 2: Create the Component Folder & Files**
Create a new folder in `src/components/nodes/YourNewNode/` containing the following 7 files:

1. `types.ts`: Defines the TypeScript interfaces for the node and its specific data structure.
2. `YourNewNodeProperties.tsx`: The properties editor component (the right sidebar form).
3. `YourNewNodeProperties.module.css`: Styles for the properties editor.
4. `ReactFlowYourNewNode.tsx`: The visual node component rendered directly on the React Flow canvas.
5. `ReactFlowYourNewNode.module.css`: Styles for the canvas node.
6. `validate.ts`: The specific validation logic for your node's data.
7. `index.ts`: Exports the config object required by the central registry.

**Step 3: Register the Node Configuration**

* Update `src/components/nodes/ElementMapping.ts`: Import your node's configuration object from its `index.ts` and add it to the bulk registration list so the React Flow engine recognizes it.

**Step 4: Ensure Global Type Safety**

* Update `src/types/PolyglotNode.ts`: Include your new node type interface in the master global TypeScript union. This ensures state updates and data handlers remain fully type-safe.

**Step 5: Update Validation Rules**

* Update `src/lib/validation/nodeValidator.ts` (and `conditionalEdgeValidator.ts` if your node calculates points) to include your node in the global validation cycle.

---

## How to Add an Exercise Node (Container-Compatible)

Exercise nodes are a special subset of nodes that can be embedded inside a `ContainerNode`.

**Step 1: Create the Standard Node and Extract the Core Form**

* Follow the **"How to Add a New Node"** guide above.
* Refactor your `YourNewNodeProperties.tsx` to extract the main form logic into a separate `CoreForm.tsx` component.
* Create a `YourNewNodeEmbedded.tsx` file that wraps the `CoreForm` for use inside containers.

**Step 2: Register the Embed Component**

* Open `src/components/nodes/Container/components/EmbeddedRegistry.ts`.
* Import your embedded component and its configuration, then add it to the `embeddedRegistry` array.

**Step 3: Whitelist the Type**

* Open `src/components/nodes/Container/types.ts` (or your container types file).
* Add your node's type constant to the `CONTAINER_NODE_ALLOWED_TYPES` array so the type system legally allows it to be nested.

---

## How to Add a New Edge

If you need a new way to connect nodes (e.g., a new logical operator or visual line style), follow these steps:

**Step 1: Define the Identifier**

* Update `src/types/EdgeType.ts` with the new edge identifier.

**Step 2: Create the Edge Component**

* Create a new folder in `src/components/edges/YourNewEdge/`.
* Create `ReactFlowYourNewEdge.tsx` utilizing React Flow's `<BaseEdge/>` or standard SVG paths to draw the line.
* Create `YourNewEdgeProperties.tsx` if the edge requires a settings panel (e.g., for threshold inputs or custom logic).

**Step 3: Register the Edge Configuration**

* Update `ElementMapping.ts` to map your custom edge string identifier to your new React Flow edge component.

**Step 4: Update Edge Types**

* Update `PolyglotEdge.ts` to include your new edge type interface in the global union.

**Step 5: Add Validation Logic**

* Update `conditionalEdgeValidator.ts` (or `edgeValidator.ts`) to handle the rules for your new edge type, ensuring it doesn't cause logical conflicts or infinite loops in the flow execution.

---

## Submitting Pull Requests

We welcome all contributions! To submit your code:

1. **Fork the repository** and create your branch from `main`.
```bash
git checkout -b feature/add-new-quiz-node
```
2. **Write clean, typed code** following the existing project architecture.
3. **Test your changes** locally with both `USE_MOCK_DATA=true` and `USE_MOCK_DATA=false` (if you have backend access) to ensure everything renders and saves correctly.
4. **Commit your changes** with clear, descriptive commit messages.
5. **Push to your fork** and open a Pull Request against the `main` branch.
6. **Describe your PR** in detail, noting which node/edge you added and any new dependencies introduced.

Thank you for helping make Polyglot better!