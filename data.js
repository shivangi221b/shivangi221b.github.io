/* ============================================================
   data.js — everything you'll want to edit lives in this file.

   PROJECTS
     featured : true  -> big card with a media slot, near the top
     media    : { type: "video",   src: "assets/video/foo.mp4",
                  poster: "assets/img/foo.jpg" }        // local file
              | { type: "youtube", id: "dQw4w9WgXcQ" }  // YouTube embed
              | { type: "image",   src: "assets/img/foo.png" }
              | null                                    // draws a nice gradient
     links    : any number of { label, href }
     tags     : used for the filter chips
   ============================================================ */

const PROJECTS = [
  {
    title: "ASR Fine-Tuning & RL Adaptation",
    kicker: "Research · Columbia · 2026",
    blurb:
      "A cross-framework study of domain adaptation for speech-to-text. I ran supervised fine-tuning on clinical (AfriSpeech-200) and parliamentary (VoxPopuli) audio, then added a second reward-augmented stage on top of CTC using WER, domain-weighted WER, and an LLM-based scorer as the reward signal.",
    detail:
      "The interesting question wasn't whether reward shaping helps — it's whether it helps <em>consistently</em>, across toolkits, and at what cost. So NeMo and ESPnet get identical datasets, metrics, and reward designs, and every run reports the catastrophic-forgetting delta on LibriSpeech alongside the domain gains. Trained on GCP GPUs; artifacts and configs are checkpointed to GCS so nothing dies with the VM.",
    tags: ["Research", "Speech", "ML"],
    stack: ["NVIDIA NeMo", "ESPnet", "CTC", "Gemini", "GCP"],
    featured: true,
    media: null, // TODO: add a demo/poster, e.g. { type: "image", src: "assets/img/asr-results.png" }
    links: [
      { label: "GitHub", href: "https://github.com/shivangi221b/ASR-Fine-Tuning-Modules-and-RL-Adaptation-Analysis" }
      // TODO: add { label: "Paper (PDF)", href: "assets/docs/asr-paper.pdf" } when public
    ]
  },
  {
    title: "NutriGraph",
    kicker: "Big Data & AI · Columbia",
    blurb:
      "An agentic multimodal RAG system for nutritional analysis. A LangChain ReAct agent plans over a mix of structured nutrition data and images, calls retrieval and search tools as it needs them, and explains what it concluded — wrapped in a Streamlit UI you can actually poke at.",
    detail:
      "Most of the real work was in the failure modes: callback handlers that swallowed tool errors, prompt templates that silently truncated, and search output that the agent confidently misread. Written up as a four-page ACM-format report with the team.",
    tags: ["LLM & Agents", "ML"],
    stack: ["LangChain", "ReAct", "Streamlit", "Vector search"],
    featured: true,
    media: null, // TODO: your NutriGraph demo video -> { type: "video", src: "assets/video/nutrigraph.mp4" }
    links: [
      // TODO: add the repo + the ACM report PDF
      { label: "Report (PDF)", href: "assets/docs/nutrigraph-report.pdf" }
    ]
  },
  {
    title: "Plant Disease Detection with Explainable AI",
    kicker: "Deep Learning · Columbia",
    blurb:
      "A fine-tuned EfficientNetB3 that classifies 38 plant leaf diseases at 98.72% accuracy — and, more usefully, shows its work. Grad-CAM and LIME produce both image and text explanations, and a swappable LLM backend turns the diagnosis into an actual treatment recommendation.",
    detail:
      "The LLM layer runs against Gemini 2.5 Flash in the cloud or Llama 2 / Mistral locally through Ollama, so the whole thing works offline if you want it to. Ships as a single standalone Python file with a Streamlit front end — no separate API service to stand up.",
    tags: ["Vision", "LLM & Agents", "ML"],
    stack: ["EfficientNetB3", "Grad-CAM", "LIME", "Streamlit", "Ollama"],
    featured: true,
    // The presentation video already lives in the repo — copy it into assets/video/ to embed it here.
    media: null, // TODO: { type: "video", src: "assets/video/plant-disease-demo.mp4" }
    links: [
      { label: "GitHub", href: "https://github.com/shivangi221b/Plant-Disease-Detection-with-Explainable-AI" },
      { label: "Presentation video", href: "https://github.com/shivangi221b/Plant-Disease-Detection-with-Explainable-AI/blob/main/group_presentation_video.mp4" }
    ]
  },
  {
    title: "AI Wardrobe Planner",
    kicker: "Startup Studio · Columbia · 2026",
    blurb:
      "A wardrobe assistant that reads your calendar, your location, and your actual closet, then tells you what to wear. You upload a short video of your closet; a vision pipeline turns it into a structured inventory you can edit.",
    detail:
      "I worked on the onboarding flow and the ingestion path. The vision worker runs YOLOv8 for detection, EfficientSAM for segmentation, and CLIP for attribute tagging as a separate service behind a FastAPI + Postgres backend, so slow media processing never blocks the app. Built with a team of seven in Columbia's Startup Studio.",
    tags: ["Vision", "Full-stack"],
    stack: ["FastAPI", "PostgreSQL", "YOLOv8", "EfficientSAM", "CLIP", "TypeScript"],
    featured: true,
    media: null, // TODO: { type: "youtube", id: "..." } or a screen recording
    links: [
      { label: "GitHub", href: "https://github.com/shivangi221b/AI_Wardrobe_Planner" }
    ]
  },

  /* ---------- smaller / older work ---------- */
  {
    title: "Habit Tracker",
    kicker: "Weekend build",
    blurb:
      "A single-page habit tracker with no backend at all. Add habits, tap days on a two-week calendar, and it tells you which one you've been quietly neglecting.",
    tags: ["Web"],
    stack: ["Vanilla JS"],
    featured: false,
    media: null,
    links: [{ label: "GitHub", href: "https://github.com/shivangi221b/habit-tracker" }]
  },
  {
    title: "TEDxIITGuwahati",
    kicker: "IIT Guwahati",
    blurb:
      "Website and tooling for the TEDx chapter at IIT Guwahati — built and shipped against a hard, non-negotiable deadline: the event itself.",
    tags: ["Web"],
    stack: ["Python"],
    featured: false,
    media: null,
    links: [{ label: "GitHub", href: "https://github.com/shivangi221b/TEDxIITGuwahati" }]
  },
  {
    title: "xv6 Kernel Labs",
    kicker: "Operating Systems · IIT Guwahati",
    blurb:
      "Extending the xv6 teaching kernel in C — scheduling, system calls, and the particular humility that comes from debugging code with no printf.",
    tags: ["Systems"],
    stack: ["C", "xv6"],
    featured: false,
    media: null,
    links: [
      { label: "xv6", href: "https://github.com/shivangi221b/xv6" },
      { label: "Lab 3", href: "https://github.com/shivangi221b/xv6lab3" }
    ]
  },
  {
    title: "Diffusion & Flow Matching",
    kicker: "COMS 4732 · Columbia",
    blurb:
      "Implementing diffusion models and flow matching from scratch on MNIST, including a UNet built and debugged the hard way.",
    tags: ["Research", "Vision", "ML"],
    stack: ["PyTorch", "UNet"],
    featured: false,
    media: null,
    links: [] // TODO: link the repo if you make it public
  },
  {
    title: "Molecular ML with DeepChem",
    kicker: "EECS 6895 · Columbia",
    blurb:
      "Graph neural networks over molecular property prediction tasks with DeepChem, plus a close read of AlphaGenome.",
    tags: ["Research", "ML"],
    stack: ["DeepChem", "GNNs"],
    featured: false,
    media: null,
    links: []
  }
];

/* ============================================================
   TIMELINE
   TODO: replace the 20XX placeholders with your real years.
   ============================================================ */
const TIMELINE = [
  {
    period: "20XX &ndash; 20XX",
    role: "B.Tech, Computer Science",
    org: "Indian Institute of Technology Guwahati",
    place: "Guwahati, India",
    body:
      "Where the whole thing started. Systems courses in C, an AI study group that met more reliably than most classes, and the TEDx chapter site that taught me shipping beats polishing."
  },
  {
    period: "20XX &ndash; 20XX",
    role: "Engineering Analyst &rarr; Associate",
    org: "Goldman Sachs",
    place: "Bengaluru, India",
    body:
      "Three-plus years building and running software in a regulated financial environment. I learned to think in failure modes first — what breaks, who notices, and how fast you can prove it's fixed. That instinct still shapes how I build ML systems."
  },
  {
    period: "2025 &ndash; 2026",
    role: "MS, Computer Science (AI/ML track)",
    org: "Columbia University",
    place: "New York, NY",
    body:
      "A deliberate pivot into machine learning. Coursework in deep learning, big data and AI, and computer vision; a TA role; a 4.0; and a research project on speech adaptation that turned into a paper. Graduating December 2026."
  },
  {
    period: "Summer 2026",
    role: "Software Development Engineer Intern",
    org: "Amazon",
    place: "Seattle, WA",
    body:
      "On the Subscribe &amp; Save customer experience team — production code, real customers, and a crash course in how a system that large actually holds together."
  }
];

/* ============================================================
   PAPERS / WRITING
   ============================================================ */
const PAPERS = [
  {
    title: "ASR Fine-Tuning, Modules, and RL Adaptation",
    venue: "Manuscript in preparation · 2026",
    summary:
      "A cross-framework empirical study of reward-augmented domain adaptation for speech recognition, comparing NVIDIA NeMo and ESPnet under identical data, metrics, and reward designs.",
    links: [
      { label: "Code & experiments", href: "https://github.com/shivangi221b/ASR-Fine-Tuning-Modules-and-RL-Adaptation-Analysis" }
      // TODO: { label: "PDF", href: "assets/docs/asr-paper.pdf" }
    ]
  },
  {
    title: "NutriGraph: Agentic Multimodal RAG for Nutritional Analysis",
    venue: "Course report, ACM format · Columbia",
    summary:
      "Four-page write-up of an agentic retrieval system that reasons jointly over nutritional records and images.",
    links: [
      { label: "PDF", href: "assets/docs/nutrigraph-report.pdf" } // TODO: drop the PDF in
    ]
  }
];
