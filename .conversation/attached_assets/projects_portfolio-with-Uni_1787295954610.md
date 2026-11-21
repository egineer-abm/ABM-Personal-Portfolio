# Software, Hardware & Academic Projects Catalog

A comprehensive, structured portfolio catalog of agentic AI systems, local-first developer utilities, mobile applications, hardware/robotics projects, and community repositories created and maintained by **Abdul Basit Memon** ([@abm1119](https://github.com/abm1119)).

---

## 1. Agentic AI, Developer Tools & Content Systems

### Overview Matrix

| # | Project Name | Primary Stack / Tools | Category | Status / Access |
|---|--------------|------------------------|----------|-----------------|
| 1 | **AGERE** | Google ADK, RAG, Streamlit, Gemini API | Agentic AI / HR Tech | [Kaggle Writeup](https://kaggle.com/competitions/agents-intensive-capstone-project/writeups/agere-agentic-recruiter) |
| 2 | **BakeryOS** | Python, FastAPI, SQLite, Agentic Skills Loop, Harness | Local AI / Retail & Wholesale Operations | Local App (Active Development) |
| 3 | **Kutbi** | FastAPI, Streamlit, Groq/OpenRouter, yt-dlp | Content & Learning Engine | [GitHub Repo](https://github.com/abm1119/Kutbi) |
| 4 | **Tool Stash** | Agentic AI, Notion DB API | AI Bookmarking & Search | [Live Web App](https://abm-tools.lovable.app/) |
| 5 | **SB0** | Gemini API (BYOK), RAG, Graph UI | Knowledge Base / Second Brain | [GitHub Repo](https://github.com/abm1119/SB0) |
| 6 | **Roznama** | Markdown, Git, Offline Cognitive Engine | Distraction-Free Notes Wiki | Private Repo (On Demand) |
| 7 | **Notion Vault** | Tkinter, Flask, Waitress, SQLite3, Chrome Ext | Local Password Manager | [GitHub Release](https://github.com/abm1119/password-manager-vault/releases) |
| 7A | **Notion Vault CLI** | Python, SQLite, Natural Language Interface | Encrypted CLI Vault | `pip install notion-vault-cli` |
| 8 | **Agentic Learning-Mentor** | Tessl, Agentic IDEs / AI Assistants | AI Mentorship Skill | [GitHub Repo](https://github.com/abm1119/agentic-learning-mentor) |
| 9 | **Prompt Inspector** | Python, Web UI, CLI | Prompt Hardening & Testing | [GitHub Repo](https://github.com/abm1119/prompt-inspector) |
| 10 | **Mamba Widget** | Portable Desktop EXE, Glassmorphic UI | Focus & Productivity | [GitHub Release v1.0.0](https://github.com/abm1119/Mamba-widget/releases/tag/v1.0.0) |
| 11 | **Resources Heaven** | Curated Markdown Resources | Open Source Knowledge Hub | [GitHub Repo](https://github.com/abm1119/Resources-Heaven) |
| 12 | **AI Coding Tools Directory** | Markdown Directory & Python Agent | Developer Tooling Directory | [GitHub Directory](https://github.com/abm1119/AI-Coding-Tools-Directory) |
| 13 | **Writely** | Streamlit, FastAPI, Groq API | Content Synthesis & Frameworks | [GitHub Repo](https://github.com/abm1119/Thoughtforge) |
| 14 | **Code Editing Agent** | Go, LLM Tool Calling, Filesystem Harness | Terminal AI Code Editor | [GitHub Repo](https://github.com/abm1119/code-editing-agent-demo) |

---

### Detailed Project Descriptions

#### 1. AGERE — Agentic Recruiter
- **Event / Program**: Google Intensive Agentic AI Course Capstone Project (2025)
- **Tech Stack**: Google Agent Development Kit (ADK), RAG Architecture, Streamlit, Gemini API
- **Team**: International Collaboration (Pakistan, UK, France, Italy)
- **Link**: [Kaggle Competition Writeup](https://kaggle.com/competitions/agents-intensive-capstone-project/writeups/agere-agentic-recruiter)
- **Description**: An intelligent recruitment agent designed to streamline candidate experience and hiring workflows. AGERE assists candidates dynamically through interview phases, provides intelligent evaluation, and assists HR teams in screening and candidate management.

#### 2. BakeryOS — Agentic Retail & Wholesale Management System
- **Tech Stack**: Python, FastAPI, SQLite, Agentic Skills Loop, Execution Harness, Gemini API
- **Status**: Local App (Active Development)
- **Description**: An intelligent, agentic operating system built specifically for family-owned and retail/wholesale bakery operations, drawing directly from real-world retail domain experience. BakeryOS bridges the gap between traditional store management and autonomous agentic workflows by replacing clunky POS menus with a natural language prompt-driven interface.
- **Core Architecture & Persistence**:
  - **Persistent State Engine**: Local-first SQLite persistence layer maintaining durable records of inventory batches, daily sales, customer accounts, and merchant supplier records across sessions without cloud dependency.
  - **Skills Loop & Execution Harness**: Features a modular agent harness executing an iterative sense-plan-act-observe loop. It exposes specialized tools ("skills") for inventory inspection, invoice generation, bill reconciliation, and price updates.
- **Key Operational Modules (Prompt-Driven)**:
  - **Retail & Wholesale Management**: Instantly switches between counter retail sales and bulk wholesale dispatch orders via natural language prompts (e.g., *"Create a wholesale invoice for 50 boxes of sourdough for Café Vienna with a 10% volume discount"*).
  - **Inventory & Stock Tracking**: Real-time ingredient and baked goods tracking with low-stock alerts, wastage logging, and automated batch replenishment suggestions.
  - **Invoices & Billing**: Automated invoice creation with tax calculations, discounts, and payment tracking, triggered entirely through conversational prompts.
  - **Merchant Bills & Supplier Accounts**: Tracks raw material purchases (flour, butter, sugar, packaging), logs vendor invoices, and manages payable accounts.
  - **Dynamic Item Pricing**: Instantly updates individual item prices, category markups, or seasonal promotional pricing across all terminals and price tags through plain English instructions.

#### 3. Kutbi — YouTube Learning & Workout Extractor
- **Repository**: [https://github.com/abm1119/Kutbi](https://github.com/abm1119/Kutbi)
- **Tech Stack**: FastAPI (Backend), Streamlit (UI), Groq / OpenRouter API, `yt-dlp` / YouTube Data API
- **Description**: An interactive video processing platform that converts YouTube videos or entire channel feeds into actionable, 5-minute practical exercises and structured summaries.
- **Key Features**:
  - **Feed Processing**: Input channel handles or video links; retrieves customizable video lists.
  - **Resource Optimization**: Processes up to 2 videos concurrently to minimize API costs and credit consumption.
  - **Transcription & Extraction**: Automatically pulls transcripts and generates structured timelines, key topics, resource links, required tools, and executable code snippets.

#### 4. Tool Stash — Agentic Bookmark & Tool Discovery
- **Deployment**: [https://abm-tools.lovable.app/](https://abm-tools.lovable.app/)
- **Tech Stack**: Vibe-Coded Agentic AI Architecture, Notion Database API, Web Search Tools
- **Description**: An agent-driven web bookmarking system equipped with a Human-in-the-Loop (HITL) approval layer. Users describe software tools or web links in natural language, and the agent searches the internet, provides context, and prompts the user before persisting bookmarks into an organized Notion database.

#### 5. SB0 — Second Brain Cognitive Engine
- **Repository**: [https://github.com/abm1119/SB0](https://github.com/abm1119/SB0)
- **Tech Stack**: Gemini API (Bring Your Own Key / BYOK), RAG Architecture, Interactive Graph Visualizer
- **Description**: A local-first knowledge management system featuring an interactive Knowledge Base Graph supporting multi-format previews (PDFs, Markdown, images), semantic RAG querying, and dynamic modification triggers.

#### 6. Roznama — Minimalist Daily Notes & Wiki Engine
- **Access**: Private Repository (Available on Demand)
- **Tech Stack**: Markdown Files, Git Synchronization, Offline Search Engine, Custom Agent Skills
- **Description**: A minimalist, distraction-free daily notes app and personal wiki system featuring automatic Git backup across devices, CLI integrations, and an offline cognitive engine with fast slash (`/`) commands and fuzzy matching.

#### 7. Notion Vault — Portable Local Password Manager
- **Repository**: [https://github.com/abm1119/password-manager-vault/releases](https://github.com/abm1119/password-manager-vault/releases)
- **Tech Stack**: Python (Tkinter + `ttkbootstrap`), Flask, Waitress, SQLite3, Node.js, Companion Chrome Extension
- **Description**: A portable, offline, open-source password manager built for complete privacy without cloud infrastructure, distributed as a lightweight standalone executable (`.exe`) with native Chrome extension support.

#### 7A. Notion Vault CLI — Natural Language Encrypted Vault
- **Package**: `pip install notion-vault-cli`
- **Tech Stack**: Python, SQLite, Natural Language Processing
- **Description**: A private, locally encrypted command-line password vault operated through plain English prompts, featuring zero cloud sync, master password authentication, and natural language credential retrieval.

#### 8. Agentic Learning-Mentor Skill
- **Repository**: [https://github.com/abm1119/agentic-learning-mentor](https://github.com/abm1119/agentic-learning-mentor)
- **Installation Commands**:
  ```bash
  npx tessl i github:abm1119/agentic-learning-mentor@05715a2 --skill agentic-learning-mentor
  npx skills add https://github.com/abm1119/agentic-learning-mentor.git --skill agentic-learning-mentor
  ```
- **Description**: An educational agent skill tailored for AI-first environments and agentic IDEs (Claude Code, Gemini-CLI, Cursor) that assesses user skill levels, adapts to project context, and delivers structured mentorship from core concepts to production code.

#### 9. Prompt Inspector — Local Prompt Analysis & Hardening Tool
- **Repository**: [https://github.com/abm1119/prompt-inspector](https://github.com/abm1119/prompt-inspector)
- **Tech Stack**: Python, Local Web UI, Terminal CLI
- **Description**: A unified workspace and CLI tool for analyzing, stress-testing, and hardening AI prompts locally through structural parsing, automated rewriting, adversarial stress-testing, and multi-format exports.

#### 10. Mamba — Glassmorphic Daily Focus Desktop Widget
- **Repository**: [https://github.com/abm1119/Mamba-widget/releases/tag/v1.0.0](https://github.com/abm1119/Mamba-widget/releases/tag/v1.0.0)
- **Tech Stack**: Windows Portable Executable (`.exe`), Glassmorphic CSS/UI, System Tray Hotkey Hooks
- **Description**: A compact daily focus utility featuring a plant-inspired aesthetic, 25px background blur, floating launcher, bold Pomodoro timer, and category-coded persistent task scratchpad.

#### 11. Resources Heaven — Open Source Learning Repository
- **Repository**: [https://github.com/abm1119/Resources-Heaven](https://github.com/abm1119/Resources-Heaven)
- **Description**: A community-maintained collection featuring over 1,000 curated technology, design, and AI resources across 10+ categorized sub-directories (MOOCs, AI learning tools, research tools, image/video generators, and vibe coding guides).

#### 12. AI Coding Tools Directory & Code Editing Agent
- **Directories**:
  - [AI Coding Tools Directory Repository](https://github.com/abm1119/AI-Coding-Tools-Directory)
  - [Code Editing Agent Demo Repository](https://github.com/abm1119/code-editing-agent-demo)
- **Description**: Curated developer directory and practical code demonstrations maintained under Prologware Solutions to help indie builders prototype and ship products faster using AI coding assistants.

#### 13. Writely — AI Content Transformer & Tone Polisher
- **Repository**: [https://github.com/abm1119/Thoughtforge](https://github.com/abm1119/Thoughtforge)
- **Tech Stack**: Streamlit, FastAPI, Groq API
- **Description**: An AI-assisted writing app that transforms raw notes into polished posts for LinkedIn, X (Twitter), or personal tech blogs using established copywriting frameworks (AIDA, PAS, BHC) and custom user writing profiles.

#### 14. Code Editing Agent — Simple for Learning
- **Repository**: [https://github.com/abm1119/code-editing-agent-demo](https://github.com/abm1119/code-editing-agent-demo)
- **Tech Stack**: Go, LLM Tool Calling, Filesystem Interaction
- **Description**: A real-world implementation of an autonomous AI code-editing agent running in the terminal (~300 lines of Go). Demonstrates core concepts of LLM tool calling, conversation state management, and filesystem interaction.

---

## 2. Mobile, Hardware, Web & Academic Projects --- University Projects

### Overview Matrix

| Domain | Project Name | Tech Stack / Tools | Semester / Context | Links / Artifacts |
|--------|--------------|---------------------|--------------------|-------------------|
| **Mobile** | **TechdioApp** | .NET MAUI, C#, SQLite, Firebase, XAML | 7th Semester Project | [Screens](https://github.com/abm1119/TechdioApp/blob/ad0ddb6ec780a06ef24d9a16ab8e5e2883b62449/Techdio-AppScreens.png) \| [GitHub](https://github.com/abm1119/TechdioApp) |
| **Mobile** | **Intelligent Carpooling App** | Android Studio, Java, Kotlin, Firebase, Mapbox, A* Algo | Final Year Capstone & Thesis | [Demo Video](https://vimeo.com/1102623700?fl=pl&fe=sh) \| [GitHub](https://github.com/urooj-marvi/Carpooling_App) |
| **Hardware** | **Arduino Vehicle Speed Detector** | Arduino Uno, IR Sensors, 16x2 LCD, C++ | 1st Semester Workshop | [GitHub & Demo](https://github.com/abm1119/Arduino-Vehicle-Speed-Detector-) |
| **Hardware** | **Arduino Crane with Servo Motors** | Arduino UNO, Servo Motors, Mini Joystick, Pictoblox, C++ | 2nd Semester Curriculum Project | [Demo Video](https://www.playbook.com/s/computer-systems-engineeing/HMoaREBPy6L1mzWnEouCkgfx) \| [GitHub](https://github.com/abm1119/Arduino-Crain-by-Pictoblox-Interfacing-) |
| **Hardware** | **Arduino Night Patrol Surveillance Robot** | Arduino Uno, IR, PIR, Ultrasonic, Laser, Buzzer | 7th Semester Open Lab | [Demo Video](https://vimeo.com/1104576834?fl=pl&fe=sh) \| [Tutorial](https://www.instructables.com/Arduino-Servilliance-Mobile-Robot/) |
| **Web** | **Student Management System** | ASP.NET Core, EF Core, SQL Server, Bootstrap, JS | Final Year Coursework | [Demo Video](https://www.playbook.com/s/computer-systems-engineeing/2sP2yksKvEegmQSQi6tQJGRr?assetToken=ysdqT8vLdLbv2h1de2pYG6kg) \| [GitHub](https://github.com/abm1119/student-management-app) |
| **Game** | **Space Shooter** | Scratch (MIT), Block Logic | 1st Semester Project | [Scratch Web Play](https://scratch.mit.edu/projects/630050190) \| [Deck](https://speakerdeck.com/abdulbasit_abm/scratch-based-block-programming-scratch-dot-mit-to-a-game-space-shooter-custom) |
| **CAD** | **3D House Design (Interior & Exterior)** | AutoCAD 3D, Architectural Modeling | 3rd Semester CAD Course | [BitDocs View](https://engrabm.bitdocs.ai/share/d/T1H8XsQDDj5ZKUoQ) \| [GrabCAD](https://grabcad.com/library/a-complete-interior-and-exterior-of-the-home-in-cad-3d-1) |

---

### Detailed Descriptions & Background

### Mobile Applications

#### TechdioApp
- **Tech Stack**: .NET MAUI, C#, SQLite + Firebase, XAML (2024)
- **Links**: [App Screens](https://github.com/abm1119/TechdioApp/blob/ad0ddb6ec780a06ef24d9a16ab8e5e2883b62449/Techdio-AppScreens.png) | [GitHub Repository](https://github.com/abm1119/TechdioApp)
- **Description**: A sleek, cross-platform mobile learning hub built with .NET MAUI. Allows users to browse curated tech courses, schedule one-on-one tutor sessions, and track learning progress with offline-capable data syncing.

#### Intelligent Carpooling App
- **Tech Stack**: Android Studio, Java + Kotlin, Firebase Realtime Database, Mapbox Maps API, A* Search Algorithm
- **Links**: [Demo Video](https://vimeo.com/1102623700?fl=pl&fe=sh) | [GitHub Repository](https://github.com/urooj-marvi/Carpooling_App)
- **Description**: A full-featured mobile carpooling solution offering real-time ride matching, secure payments, and live GPS route tracking using Mapbox, supported by an academic research thesis evaluating route matching via the A* algorithm.

---

### Hardware & Robotics Systems

#### Arduino Vehicle Speed Detector
- **Tech Stack**: Arduino Uno, IR Sensors, 16x2 LCD Display, C++, Arduino IDE
- **Link**: [GitHub Repository & Demo](https://github.com/abm1119/Arduino-Vehicle-Speed-Detector-)
- **Description**: An IR-based speed detection system using sensor break-beams to measure vehicle speed and display measurements in real-time on an LCD output.

#### Arduino-Based Crane with Servo Motors
- **Tech Stack**: Arduino UNO, 90-Degree Servo Motors (x2), Mini Joystick Module, Pictoblox, C++, Arduino IDE
- **Links**: [Video Demo](https://www.playbook.com/s/computer-systems-engineeing/HMoaREBPy6L1mzWnEouCkgfx) | [GitHub Repository](https://github.com/abm1119/Arduino-Crain-by-Pictoblox-Interfacing-)
- **Description**: `A robotic crane driven by dual servo motors and controlled via a mini joystick module, utilizing block-based logic via Pictoblox for axis manipulation.`

#### Arduino Night Patrol Surveillance Robot
- **Tech Stack**: Arduino Uno, IR Sensors, PIR Motion Sensor, Ultrasonic Sensor, Laser Module, Buzzer, Mobile Car Frame
- **Links**: [Video Demo](https://vimeo.com/1104576834?fl=pl&fe=sh) | [Instructables Tutorial](https://www.instructables.com/Arduino-Servilliance-Mobile-Robot/)
- **Description**: An autonomous mobile robot built for night surveillance, equipped with IR sensors for darkness detection, PIR motion sensors, ultrasonic obstacle avoidance, and laser/buzzer security alerts.

---

### Web Applications

#### Student Management System
- **Tech Stack**: ASP.NET Core, Entity Framework Core, SQL Server, Bootstrap, JavaScript, HTML/CSS
- **Links**: [Video Demo](https://www.playbook.com/s/computer-systems-engineeing/2sP2yksKvEegmQSQi6tQJGRr?assetToken=ysdqT8vLdLbv2h1de2pYG6kg) | [GitHub Repository](https://github.com/abm1119/student-management-app)
- **Description**: A web-based administrative application designed for class advisors and academic leaders to manage course registrations, student progress, and batch monitoring.

---

### Games & 3D CAD Modeling

#### Space Shooter
- **Tech Stack**: Scratch (MIT), Block-Based Logic, Design Tools, Game Engine Logic
- **Links**: [Playable Game on Browser](https://scratch.mit.edu/projects/630050190) | [SpeakerDeck Presentation](https://speakerdeck.com/abdulbasit_abm/scratch-based-block-programming-scratch-dot-mit-to-a-game-space-shooter-custom)
- **Description**: A beginner-friendly arcade space shooter game built using MIT Scratch block programming, demonstrating fundamental game loop mechanics, collision detection, and scoring logic.

#### 3D House Design – Interior & Exterior
- **Tech Stack**: AutoCAD 3D, Architectural Design & 3D Modeling Tools
- **Links**: [BitDocs Online Viewer](https://engrabm.bitdocs.ai/share/d/T1H8XsQDDj5ZKUoQ) | [GrabCAD Project Files](https://grabcad.com/library/a-complete-interior-and-exterior-of-the-home-in-cad-3d-1)
- **Description**: A complete 3D architectural house model built from scratch in AutoCAD, featuring precise interior layout plans, external structural elevations, and detailed measurement schematics.