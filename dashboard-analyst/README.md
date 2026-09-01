<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/createlab-univaq/pisco">
    <img src="readme/logo.jpg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Dashboard Analyst</h3>

  <p align="center">
    Dashboard Analyst is a specialized web application built for clinical analysts to monitor and evaluate patient progress through interactive neurocognitive and social training protocols.
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-dashboard-analyst">About Dashboard Analyst</a>
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
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About Dashboard Analyst

Dashboard Analyst is a specialized web application built for clinical analysts to monitor and evaluate patient progress through interactive neurocognitive and social training protocols.

Key features include:
* **Patient Management**: Comprehensive tracking of patient profiles, educational levels, assigned protocol paths, and secure management actions.
* **Clinical Diagnoses Tracking**: Dedicated timeline and registration form for secure, immutable clinical evaluations, notes, and medication tracking.
* **Execution Analytics**: Detailed session breakdowns of test nodes, exercise nodes, and pre-post performance comparisons supported by interactive charts.
* **Excel Reporting**: Automated generation and download of fully formatted Excel reports conforming to clinical template standards for individual or bulk records.
* **Mock Environment**: A built-in local JSON mock database mode (`USE_MOCK_DATA`) to allow rapid frontend UI development alongside full backend integration.

<p align="right">(<a href="#readme-top">up</a>)</p>

### Built With

* [![SvelteKit][SvelteKit]][SvelteKit-url]
* [![Svelte][Svelte]][Svelte-url]
* [![TypeScript][TypeScript]][TS-url]

<p align="right">(<a href="#readme-top">up</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

Follow these steps to set up and run the Dashboard Analyst development server locally.

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
  cd dashboard-analyst
```

2. Install NPM packages

```sh
  npm install
```

3. Configure Environment Variables

Make a copy of `.env.example` in the root directory and rename it `.env` or `.env.local`. You will need to configure your backend API endpoint and the mock data flag.

```env
# API Configuration
API_BASE_URL="https://your-api-domain.com/api"

# Mock Data Toggle
USE_MOCK_DATA=true
```

4. Start the development server

```sh
  npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`.

## Top contributors:

<a href="https://github.com/createlab-univaq/pisco/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=createlab-univaq/pisco" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[SvelteKit]: https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white
[SvelteKit-url]: https://svelte.dev/
[Svelte]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TS-url]: https://www.typescriptlang.org/