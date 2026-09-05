/* ============================================================
   data.js  -  everything you will want to edit lives here.

   PROJECTS
     featured : true  -> a card in the main grid
                false -> a row in the compact "Also built" list
     Cards are text only right now. To bring the media slot back, add
     media: { type: "video", src: "assets/video/x.mp4" } to a project and
     re-enable the one commented line in card() inside script.js.
     tags     : become the filter chips. Keep the vocabulary small.
     domain   : which cluster the card belongs to (see DOMAINS above)
     pos      : where the node sits on the map. x is a percentage of the map
                width, y is pixels from the top. Nodes are ~52px circles with
                a short label underneath; on hover they expand with more detail.
                Leave ~160px of vertical clearance between nodes in one column.
     short    : the label printed under the node, keep it to two or three words
     line     : the one-line version, shown when a node expands
   ============================================================ */

/* Cluster labels on the project map.
   lx is a percentage of the map width, ly is pixels from its top. */
const DOMAINS = [
  { key: "speech",   label: "Speech & Audio", lx: 8,  ly: 36 },
  { key: "vision",   label: "Vision",         lx: 58, ly: 36 },
  { key: "agents",   label: "Agents & LLMs",  lx: 34, ly: 250 },
  { key: "graphnlp", label: "Graph & NLP",    lx: 4,  ly: 250 },
  { key: "systems",  label: "Systems & Web",  lx: 44, ly: 490 }
];

/* How tall the map is, in pixels, on wide screens. */
const MAP_HEIGHT = 720;

const PROJECTS = [
  {
    title: "Adaptive Self-Learning Speech-to-Text",
    kicker: "Research · 2026",
    domain: "speech",
    pos: { x: 12, y: 110 },
    short: "Self-Learning STT",
    line: "Speech recognition that retrains itself, and only when the accuracy is worth the compute.",
    blurb:
      "A speech recognition system that keeps improving after it ships. Runtime corrections feed back into the training set, and a scheduler retrains only when the accuracy gain justifies the compute.",
    detail:
      "Word error rate falls from 20.44% to 17.25% on the Edinburgh noisy speech set, at 40 to 60% less retraining cost than fixed-interval schedules. Error detection runs at 0.85 to 0.92 precision, a Llama 3.2 3B correction step lands 80 to 90% of the time, and LoRA holds trainable parameters to 40% of the full model.",
    tags: ["Research", "Speech", "ML"],
    stack: ["Wav2Vec2", "Llama 3.2", "LoRA", "PyTorch"],
    featured: true,
    links: [
      { label: "Google Scholar", href: "https://scholar.google.com/citations?user=40wdomcAAAAJ&hl=en" }
    ]
  },
  {
    title: "ASR Fine-Tuning and RL Adaptation",
    kicker: "Research · Columbia · 2026",
    domain: "speech",
    pos: { x: 30, y: 110 },
    short: "ASR + RL Adaptation",
    line: "Two toolkits held to identical data and metrics, to see whether reward shaping really helps.",
    blurb:
      "A controlled comparison of domain adaptation for speech-to-text across two toolkits: supervised fine-tuning on clinical and parliamentary audio, then a reward-augmented second stage on top of CTC.",
    detail:
      "Rewards come from word error rate, domain-weighted WER, or an LLM scorer. NeMo and ESPnet run identical data, metrics and reward designs so the comparison holds. Every run reports domain gains, the LibriSpeech retention delta, and cost in GPU-hours. Trained on GCP with checkpoints written to GCS.",
    tags: ["Research", "Speech", "ML"],
    stack: ["NVIDIA NeMo", "ESPnet", "CTC", "Gemini", "GCP"],
    featured: true,
    links: [
      { label: "GitHub", href: "https://github.com/shivangi221b/ASR-Fine-Tuning-Modules-and-RL-Adaptation-Analysis" }
    ]
  },
  {
    title: "Plant Disease Detection with Explainable AI",
    kicker: "Deep learning · Columbia · 2025",
    domain: "vision",
    pos: { x: 62, y: 110 },
    short: "Plant Disease XAI",
    line: "98.72% accuracy, with the evidence behind every diagnosis shown alongside it.",
    blurb:
      "Upload a photo of a leaf and get back a diagnosis, a heatmap of what the model looked at, and a treatment plan. EfficientNetB3 fine-tuned across 38 disease classes at 98.72% accuracy.",
    detail:
      "Grad-CAM and LIME sit beside every prediction and produce both image and text explanations, so a grower can see the evidence behind a diagnosis. The treatment layer runs on Gemini 2.5 Flash in the cloud or Llama 2 and Mistral locally through Ollama, so it works on a laptop in a field. One standalone Python file, Streamlit front end.",
    tags: ["Vision", "LLM & Agents", "ML"],
    stack: ["EfficientNetB3", "Grad-CAM", "LIME", "Streamlit", "Ollama"],
    featured: true,
    links: [
      { label: "GitHub", href: "https://github.com/shivangi221b/Plant-Disease-Detection-with-Explainable-AI" },
      { label: "Demo video", href: "https://github.com/shivangi221b/Plant-Disease-Detection-with-Explainable-AI/blob/main/group_presentation_video.mp4" }
    ]
  },
  {
    title: "AI Wardrobe Planner",
    kicker: "Startup Studio · Columbia · 2026",
    domain: "vision",
    pos: { x: 84, y: 110 },
    short: "Wardrobe Planner",
    line: "A video of your closet becomes an editable inventory, then an outfit for tomorrow.",
    blurb:
      "A wardrobe assistant that reads your calendar, your location and your closet, then tells you what to wear. Record a short video of the closet and a vision pipeline turns it into an inventory you can edit.",
    detail:
      "I built the onboarding flow and the media ingestion path. The vision worker runs YOLOv8 for detection, EfficientSAM for segmentation and CLIP for attribute tagging as its own service behind a FastAPI and Postgres backend, so media processing stays off the request path. Team of seven.",
    tags: ["Vision", "Full-stack"],
    stack: ["FastAPI", "PostgreSQL", "YOLOv8", "EfficientSAM", "CLIP", "TypeScript"],
    featured: true,
    links: [
      { label: "GitHub", href: "https://github.com/shivangi221b/AI_Wardrobe_Planner" }
    ]
  },
  {
    title: "NutriGraph",
    kicker: "Big Data & AI · Columbia · 2026",
    domain: "agents",
    pos: { x: 42, y: 330 },
    short: "NutriGraph",
    line: "An agent that reasons across nutrition data and images, and shows its working.",
    blurb:
      "An agentic multimodal RAG system for nutritional analysis. A LangChain ReAct agent plans across structured nutrition data and images, calls retrieval and search tools as it goes, and shows its reasoning in a Streamlit UI.",
    detail:
      "Getting an agent to be reliable is mostly plumbing: surfacing tool errors through the callback handler, keeping prompt templates inside the context window, and normalising search output so the agent reads it the same way every time. Written up as a four-page ACM-format report.",
    tags: ["LLM & Agents", "ML"],
    stack: ["LangChain", "ReAct", "Streamlit"],
    featured: true,
    links: [
      { label: "Report (PDF)", href: "assets/docs/nutrigraph-report.pdf" } // TODO: add repo + PDF
    ]
  },
  {
    title: "Context-Aware Sarcasm Detection",
    kicker: "B.Tech thesis · IIT Guwahati · 2022",
    domain: "graphnlp",
    pos: { x: 14, y: 330 },
    short: "Sarcasm Detection",
    line: "Reads the author and the entities they tag, not just the sentence. 86.51%.",
    blurb:
      "Reads the author and the entities they tag as part of the signal, not just the sentence. 86.51% accuracy, ahead of the linguistic baselines it was measured against.",
    detail:
      "A relational graph convolutional network runs over a social network graph carrying both linguistic and relational edges, combining contextual embeddings, feature attention and graph message passing.",
    tags: ["Research", "ML"],
    stack: ["RGCN", "PyTorch", "NLP"],
    featured: true,
    links: []
  },

  /* ---------- compact list ---------- */
  {
    title: "Diffusion and Flow Matching",
    kicker: "COMS 4732 · Columbia",
    domain: "vision",
    pos: { x: 68, y: 330 },
    short: "Diffusion & Flow",
    line: "Diffusion sampling and flow matching built from scratch, UNet included.",
    blurb: "Diffusion sampling and editing with DeepFloyd, plus flow matching and a UNet written from scratch on MNIST. Results render inline in the README.",
    tags: ["Research", "Vision", "ML"],
    featured: false,
    links: [{ label: "GitHub", href: "https://github.com/shivangi221b/diffusion-flow-matching" }]
  },
  {
    title: "Molecular ML with DeepChem",
    kicker: "EECS 6895 · Columbia",
    domain: "graphnlp",
    pos: { x: 18, y: 500 },
    short: "Molecular ML",
    line: "Graph networks over Tox21 toxicity and HIV activity prediction.",
    blurb: "Tox21 toxicity and HIV activity prediction with DeepChem, plus an AlphaGenome writeup. The notebook keeps every output plot intact.",
    tags: ["Research", "ML"],
    featured: false,
    links: [{ label: "GitHub", href: "https://github.com/shivangi221b/molecular-ml-deepchem" }]
  },
  {
    title: "xv6 Kernel Labs",
    kicker: "Operating Systems · IIT Guwahati",
    domain: "systems",
    pos: { x: 54, y: 530 },
    short: "xv6 Kernel",
    line: "Scheduling and system calls, at the layer underneath the standard library.",
    blurb: "Kernel work in C on xv6: scheduling, system calls and process management, built at the layer everything else sits on.",
    tags: ["Systems"],
    featured: false,
    links: [{ label: "GitHub", href: "https://github.com/shivangi221b/xv6" }]
  },
  {
    title: "TEDx IIT Guwahati portal",
    kicker: "Django · 2021",
    domain: "systems",
    pos: { x: 40, y: 620 },
    short: "TEDx Portal",
    line: "The site and booking system behind the campus's first virtual TEDx.",
    blurb: "The official web portal for TEDx IIT Guwahati, doubling as the talk scheduling and booking system for the campus's first virtual edition.",
    tags: ["Web"],
    featured: false,
    links: [{ label: "GitHub", href: "https://github.com/shivangi221b/TEDxIITGuwahati" }]
  },
  {
    title: "Habit Tracker",
    kicker: "Weekend build",
    domain: "systems",
    pos: { x: 72, y: 640 },
    short: "Habit Tracker",
    line: "A two-week calendar that points at the habit needing attention today.",
    blurb: "A single-page habit tracker that runs entirely in the browser. Tap days on a two-week calendar and it surfaces the habit that needs attention today.",
    tags: ["Web"],
    featured: false,
    links: [{ label: "GitHub", href: "https://github.com/shivangi221b/habit-tracker" }]
  }
];

/* ============================================================
   SKILLS  (three scrolling rows; alternate directions)
   ============================================================ */
const CORE_SKILLS = [
  "Python", "Java", "PyTorch", "Machine Learning", "LLMs & RAG",
  "Computer Vision", "Distributed Systems", "SQL"
];

const SKILLS = [
  ["Python", "Java", "C++", "C", "JavaScript", "TypeScript", "SQL", "Shell", "LaTeX"],
  ["PyTorch", "TensorFlow", "Keras", "scikit-learn", "NumPy", "Pandas", "LangChain", "NVIDIA NeMo", "ESPnet", "Wav2Vec2", "LoRA", "CLIP", "YOLOv8", "Grad-CAM", "LIME", "DeepChem"],
  ["Kafka", "Prometheus", "FastAPI", "Django", "ReactJS", "PostgreSQL", "Firebase", "Streamlit", "Ollama", "GCP", "AWS", "Git", "Linux"]
];

/* ============================================================
   EXPERIENCE  (chronological, oldest first)
   ============================================================ */
const TIMELINE = [
  {
    period: "Jun – Aug 2026",
    role: "Software Engineer Intern",
    org: "Amazon",
    place: "Seattle",
    body: "Shipped four features across the Subscribe &amp; Save customer experience, spanning discovery, ranking and checkout. Added an anti-clustering constraint to the widget ranker so recommendations stay varied, rebuilt the product carousel into a compact layout that puts more products on a mobile screen, extended the Discover page to support the one-now-more-later order type, and cut checkout latency by moving redirection logic upstream.",
    chips: ["Recommendation ranking", "Backend services", "Latency optimisation", "A/B rollout"]
  },
  {
    period: "Aug 2025 – Dec 2026",
    role: "M.S. Computer Science, AI/ML",
    org: "Columbia University",
    place: "New York",
    body: "GPA 4.0. NLP, generative AI, large-scale distributed systems and deep learning for computer vision, alongside speech adaptation research.",
    chips: ["PyTorch", "NLP", "Generative AI", "Computer Vision", "Distributed Systems"]
  },
  {
    period: "Jan – Aug 2025",
    role: "Engineering Associate",
    org: "Goldman Sachs",
    place: "Bengaluru",
    body: "Led the rebuild of client onboarding for the futures and options trading system, moving it from a monolith to a modular architecture. Led the order execution work that doubled the instruments the platform supports. Sole liaison with clients and stakeholders.",
    chips: ["Java", "ReactJS", "System design", "Secure by design"]
  },
  {
    period: "Jul 2022 – Jan 2025",
    role: "Engineering Analyst",
    org: "Goldman Sachs",
    place: "Bengaluru",
    body: "Shipped Project Shepherdess, a full-stack tool that automated access control across the firm's financial systems. Lead developer on Project Health+, the monitoring layer for critical financial infrastructure, on a Kafka and ReactJS telemetry stack.",
    chips: ["Java", "ReactJS", "Kafka", "Real-time telemetry"]
  },
  {
    period: "May – Jul 2021",
    role: "Summer Analyst",
    org: "Goldman Sachs",
    place: "Bengaluru",
    body: "Delivered a production-ready feature inside a large-scale financial platform, building backend services and API integrations with senior engineers. Earned a full-time return offer.",
    chips: ["Java", "Kafka", "Prometheus", "API integration"]
  },
  {
    period: "2018 – 2022",
    role: "B.Tech Computer Science",
    org: "IIT Guwahati",
    place: "Guwahati",
    body: "GPA 8.06/10. Algorithms, operating systems, networks, machine learning, computational geometry. Thesis on context-aware sarcasm detection.",
    chips: ["C", "C++", "Machine Learning", "NLP", "Operating Systems"]
  }
];

/* ============================================================
   LEADERSHIP, TEACHING, RECOGNITION
   ============================================================ */
const LEADERSHIP = [
  {
    role: "AI Education Development Assistant", org: "aiX Convergence Design Studio, Columbia", period: "Jan 2025 – May 2026",
    body: "Worked with faculty to design and evaluate LLM-driven assignments and workflows inside epidemiology coursework, mapped the AI competencies domain experts actually need in AI-augmented research, and built reproducible open-access materials for responsible AI adoption in higher education."
  },
  {
    role: "Mentor", org: "Goldman Sachs", period: "Jan – Aug 2025",
    body: "Guided interns and new engineers through code reviews, design walkthroughs and debugging. Wrote the onboarding documentation and ran the sessions that went with it."
  },
  {
    role: "Web Operations Head", org: "TEDx IIT Guwahati", period: "Aug 2020 – Jul 2021",
    body: "Led the technical execution of the chapter's first fully virtual conference: the event site, registration workflows and live streaming infrastructure, coordinated with speakers, designers and operations."
  },
  {
    role: "Samsung Fellowship", org: "Samsung Innovation Campus", period: "Award",
    body: "Awarded for excellence in interdisciplinary research."
  }
];

/* ============================================================
   WRITING AND PAPERS
   ============================================================ */
const PAPERS = [
  {
    title: "Adaptive Self-Learning Agentic AI System: A Continuous Fine-Tuning Framework for Speech-to-Text Models",
    venue: "Manuscript · Gautam Agarwal, Shivangi Kumar, Kavya Venkatesh · 2026",
    summary:
      "A closed-loop framework where runtime corrections populate training data and an adaptive scheduler triggers fine-tuning on performance trends and cost rather than a fixed interval. Word error rate drops from 20.44% to 17.25% on the Edinburgh noisy speech set, at 40 to 60% less retraining cost.",
    links: [
      { label: "Google Scholar", href: "https://scholar.google.com/citations?user=40wdomcAAAAJ&hl=en" }
    ]
  },
  {
    title: "NutriGraph: Agentic Multimodal RAG for Nutritional Analysis",
    venue: "Course report, ACM format · Columbia",
    summary:
      "Four-page write-up of an agentic retrieval system that reasons jointly over nutritional records and images.",
    links: [
      { label: "PDF", href: "assets/docs/nutrigraph-report.pdf" } // TODO: add the file
    ]
  }
];
