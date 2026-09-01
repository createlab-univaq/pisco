<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/createlab-univaq/pisco">
    <img src="readme/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Polyglot</h3>

  <p align="center">
    A flow-based application for creating, managing, and validating interactive learning paths. Polyglot features a robust drag-and-drop node editor, complex validation logic, nested container support, and a flexible edge routing system to build adaptive learning experiences.
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-polyglot">About Polyglot</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#install">Install</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About Polyglot

Polyglot is a specialized flow-based editor designed for educational content creators and analysts. It allows users to visually construct learning paths using a node-based architecture. 

Key features include:
* **Interactive Canvas**: Drag and drop nodes to build complex logic flows, supported by React Flow.
* **Nested Structures**: Support for complex container nodes that can embed specific exercise nodes (e.g., FauxPas, Multiple Choice).
* **Advanced Validation**: Real-time validation of node configurations, edge connections, point calculations, and missing data (e.g., questions and explanations).
* **Mock Environment**: A built-in local JSON mock database mode (`USE_MOCK_DATA`) to allow rapid frontend UI development without requiring a live backend.

<p align="right">(<a href="#readme-top">up</a>)</p>

### Built With

* [![Next][Next.js]][Next-url] (App Router & Turbopack)
* [![React][React.js]][React-url]
* [![TypeScript][TypeScript]][TS-url]
* [![React Flow][ReactFlow]][ReactFlow-url]

<p align="right">(<a href="#readme-top">up</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

Follow these steps to set up and run the Polyglot development server locally.

<p align="right">(<a href="#readme-top">up</a>)</p>

### Prerequisites

Before starting, please ensure that you have the following software installed:
* **Node.js** (v18.x or higher recommended)
* **npm** (comes with Node.js)

<p align="right">(<a href="#readme-top">up</a>)</p>

### Install

1. Clone the repository
```sh
  git clone https://github.com/createlab-univaq/pisco.git
  cd polyglot
```

2. Install NPM packages
```sh
  npm install
```

3. Configure Environment Variables

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

4. Start the development server (with Turbopack)
```sh
  npm run dev
```


5. Open your browser and navigate to `http://localhost:3000`.

## Contributing

If you want to add new Nodes, Exercise types, or Custom Edges, please check the [CONTRIBUTING.md](https://www.google.com/search?q=./CONTRIBUTING.md) guide in the root directory for standard architectural procedures.

### Top contributors:

<a href="https://github.com/createlab-univaq/pisco/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=createlab-univaq/pisco" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TS-url]: https://www.typescriptlang.org/
[ReactFlow]: https://img.shields.io/badge/React_Flow-FF0072?style=for-the-badge&logo=react&logoColor=white
[ReactFlow-url]: https://reactflow.dev/