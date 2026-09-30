import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

const baseClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

// Rich demo data representing various computer science note types and subjects
const demoNotes = [
  {
    _id: "demo-note-1",
    _createdAt: "2026-07-20T12:00:00Z",
    title: "Introduction to Artificial Intelligence",
    syllabus: "Learn the fundamentals of Artificial Intelligence, Turing tests, state space search, heuristics, and basic machine learning algorithms.",
    slug: { current: "intro-to-ai" },
    university: "medicaps",
    degree: "btech-cse",
    year: "3rd-year",
    semester: "5th-semester",
    subject: "Artificial Intelligence",
    type: "NOTES",
    isPremium: false,
    tier: "TIER_1",
    content: [
      {
        _type: "block",
        style: "h2",
        _key: "k1",
        children: [{ _type: "span", text: "1. What is Artificial Intelligence?" }]
      },
      {
        _type: "block",
        style: "normal",
        _key: "k2",
        children: [
          {
            _type: "span",
            text: "Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think like humans and mimic their actions. The term may also be applied to any machine that exhibits traits associated with a human mind such as learning and problem-solving."
          }
        ]
      },
      {
        _type: "block",
        style: "h2",
        _key: "k3",
        children: [{ _type: "span", text: "2. The Turing Test" }]
      },
      {
        _type: "block",
        style: "normal",
        _key: "k4",
        children: [
          {
            _type: "span",
            text: "Proposed by Alan Turing in 1950, the Turing Test is a method of inquiry in artificial intelligence for determining whether or not a computer is capable of thinking like a human. It determines if a machine can achieve human-level performance in all cognitive tasks, sufficient to fool an interrogator."
          }
        ]
      },
      {
        _type: "block",
        style: "h3",
        _key: "k5",
        children: [{ _type: "span", text: "Key AI Subfields" }]
      },
      {
        _type: "block",
        style: "normal",
        _key: "k6",
        children: [
          {
            _type: "span",
            text: "• Machine Learning (ML): Algorithms that allow computers to learn from data.\n• Natural Language Processing (NLP): Enabling computers to understand human language.\n• Computer Vision: Helping machines interpret and understand the visual world."
          }
        ]
      }
    ]
  },
  {
    _id: "demo-note-2",
    _createdAt: "2026-07-20T12:10:00Z",
    title: "Database Management Systems (DBMS) - SQL Guide",
    syllabus: "Comprehensive guide to SQL queries, joins, subqueries, normalization, and transaction properties (ACID).",
    slug: { current: "dbms-sql-guide" },
    university: "medicaps",
    degree: "btech-cse",
    year: "2nd-year",
    semester: "3rd-semester",
    subject: "Database Management Systems",
    type: "NOTES",
    isPremium: true,
    tier: "TIER_1",
    content: [
      {
        _type: "block",
        style: "h2",
        _key: "k1",
        children: [{ _type: "span", text: "1. Introduction to SQL" }]
      },
      {
        _type: "block",
        style: "normal",
        _key: "k2",
        children: [
          {
            _type: "span",
            text: "Structured Query Language (SQL) is a standardized programming language that is used to manage relational databases and perform various operations on the data in them. It is widely used in handling structured data where relations exist between different tables."
          }
        ]
      },
      {
        _type: "block",
        style: "h2",
        _key: "k3",
        children: [{ _type: "span", text: "2. ACID Properties" }]
      },
      {
        _type: "block",
        style: "normal",
        _key: "k4",
        children: [
          {
            _type: "span",
            text: "A database transaction is a sequence of one or more SQL statements executed as a single logical unit of work. To ensure data integrity, relational databases guarantee that transactions comply with ACID properties:\n\n1. Atomicity: All changes are made, or none are made.\n2. Consistency: The database remains in a valid state.\n3. Isolation: Transactions execute independently of each other.\n4. Durability: Committed transaction data is safe from crashes."
          }
        ]
      }
    ]
  },
  {
    _id: "demo-note-3",
    _createdAt: "2026-07-20T12:20:00Z",
    title: "Computer Networks - OSI Model Lectures",
    syllabus: "Detailed study of the seven layers of the OSI model: Physical, Data Link, Network, Transport, Session, Presentation, and Application layers.",
    slug: { current: "computer-networks-osi" },
    university: "medicaps",
    degree: "btech-cse",
    year: "3rd-year",
    semester: "5th-semester",
    subject: "Computer Networks",
    type: "NOTES",
    isPremium: false,
    tier: "TIER_1",
    content: [
      {
        _type: "block",
        style: "h2",
        _key: "k1",
        children: [{ _type: "span", text: "1. The OSI Model Overview" }]
      },
      {
        _type: "block",
        style: "normal",
        _key: "k2",
        children: [
          {
            _type: "span",
            text: "The Open Systems Interconnection (OSI) model is a conceptual framework developed by the International Organization for Standardization (ISO) in 1984. It splits network communications into seven layers, where each layer serves the layer above it and is served by the layer below it."
          }
        ]
      },
      {
        _type: "block",
        style: "h2",
        _key: "k3",
        children: [{ _type: "span", text: "2. The Seven Layers" }]
      },
      {
        _type: "block",
        style: "normal",
        _key: "k4",
        children: [
          {
            _type: "span",
            text: "• Layer 7 (Application): End-user protocols like HTTP, DNS, SMTP.\n• Layer 6 (Presentation): Data translation, encryption, and compression.\n• Layer 5 (Session): Management of active communication sessions.\n• Layer 4 (Transport): Flow control, reliability (TCP/UDP).\n• Layer 3 (Network): Routing of logical packets (IP addressing).\n• Layer 2 (Data Link): Physical addressing (MAC), error checking.\n• Layer 1 (Physical): Transmission of raw bitstreams over media."
          }
        ]
      }
    ]
  },
  {
    _id: "demo-note-4",
    _createdAt: "2026-07-20T12:30:00Z",
    title: "Operating Systems - Process Scheduling",
    syllabus: "Learn about CPU scheduling algorithms: First Come First Served (FCFS), Shortest Job First (SJF), Round Robin (RR), and Priority Scheduling.",
    slug: { current: "os-process-scheduling" },
    university: "medicaps",
    degree: "btech-cse",
    year: "3rd-year",
    semester: "5th-semester",
    subject: "Operating Systems",
    type: "NOTES",
    isPremium: true,
    tier: "TIER_2",
    content: [
      {
        _type: "block",
        style: "h2",
        _key: "k1",
        children: [{ _type: "span", text: "1. CPU Scheduling Overview" }]
      },
      {
        _type: "block",
        style: "normal",
        _key: "k2",
        children: [
          {
            _type: "span",
            text: "CPU scheduling is a process that allows one process to use the CPU while another is on hold (e.g. waiting for I/O). The main objective is to keep the CPU busy at all times and minimize response time."
          }
        ]
      },
      {
        _type: "block",
        style: "h2",
        _key: "k3",
        children: [{ _type: "span", text: "2. Scheduling Algorithms" }]
      },
      {
        _type: "block",
        style: "normal",
        _key: "k4",
        children: [
          {
            _type: "span",
            text: "• First-Come, First-Served (FCFS): Simplest scheduling, but suffers from the Convoy Effect.\n• Shortest Job First (SJF): Gives the optimal average waiting time by executing shortest jobs first.\n• Round Robin (RR): Time-sliced algorithm designed for interactive time-sharing systems.\n• Priority Scheduling: Processes are assigned priorities, and the CPU is allocated to the highest priority process."
          }
        ]
      }
    ]
  },
  {
    _id: "demo-note-5",
    _createdAt: "2026-07-20T12:40:00Z",
    title: "Data Structures & Algorithms - Binary Search Trees",
    syllabus: "Introduction to Binary Search Trees (BST), insertion, deletion, search operations, and tree traversal algorithms.",
    slug: { current: "dsa-bst-guide" },
    university: "medicaps",
    degree: "btech-cse",
    year: "2nd-year",
    semester: "3rd-semester",
    subject: "Data Structures & Algorithms",
    type: "NOTES",
    isPremium: false,
    tier: "TIER_1",
    content: [
      {
        _type: "block",
        style: "h2",
        _key: "k1",
        children: [{ _type: "span", text: "1. BST Properties" }]
      },
      {
        _type: "block",
        style: "normal",
        _key: "k2",
        children: [
          {
            _type: "span",
            text: "A Binary Search Tree (BST) is a node-based binary tree data structure which has the following properties: The left subtree of a node contains only nodes with keys lesser than the node's key. The right subtree contains keys greater than the node's key."
          }
        ]
      }
    ]
  },
  {
    _id: "demo-note-6",
    _createdAt: "2026-07-20T12:50:00Z",
    title: "Discrete Mathematics - Propositional Logic",
    syllabus: "Understand propositions, truth tables, logical connectives (AND, OR, NOT, Implication, Biconditional), and tautologies.",
    slug: { current: "discrete-math-propositional-logic" },
    university: "medicaps",
    degree: "btech-cse",
    year: "1st-year",
    semester: "2nd-semester",
    subject: "Discrete Mathematics",
    type: "NOTES",
    isPremium: false,
    tier: "TIER_1",
    content: [
      {
        _type: "block",
        style: "h2",
        _key: "k1",
        children: [{ _type: "span", text: "1. Logic Declarations" }]
      },
      {
        _type: "block",
        style: "normal",
        _key: "k2",
        children: [
          {
            _type: "span",
            text: "A proposition is a declarative statement that is either true or false, but not both. For example, 'Paris is the capital of France' is a true proposition."
          }
        ]
      }
    ]
  },
  {
    _id: "demo-note-7",
    _createdAt: "2026-07-20T13:00:00Z",
    title: "DBMS Mid-Semester Test (MST) - 2025 Solved",
    syllabus: "Mid-semester test solved paper for Database Management Systems. Covering relational algebra queries and ER diagrams.",
    slug: { current: "dbms-mst-2025" },
    university: "medicaps",
    degree: "btech-cse",
    year: "2nd-year",
    semester: "3rd-semester",
    subject: "Database Management Systems",
    type: "MST",
    isPremium: true,
    tier: "TIER_1",
    content: [
      {
        _type: "block",
        style: "h2",
        _key: "k1",
        children: [{ _type: "span", text: "Solved relational algebra questions" }]
      },
      {
        _type: "block",
        style: "normal",
        _key: "k2",
        children: [
          {
            _type: "span",
            text: "Question 1: Find names of employees who work in department 'Sales'.\nAnswer: Π name ( σ dept_name = 'Sales' (Employee ⋈ Works) )"
          }
        ]
      }
    ]
  },
  {
    _id: "demo-note-8",
    _createdAt: "2026-07-20T13:10:00Z",
    title: "Computer Networks Previous Year Questions (PYQ) - 2024",
    syllabus: "Previous year question papers with full solutions for Computer Networks. Includes routing algorithm questions.",
    slug: { current: "cn-pyq-2024" },
    university: "medicaps",
    degree: "btech-cse",
    year: "3rd-year",
    semester: "5th-semester",
    subject: "Computer Networks",
    type: "PYQ",
    isPremium: true,
    tier: "TIER_2",
    content: [
      {
        _type: "block",
        style: "h2",
        _key: "k1",
        children: [{ _type: "span", text: "CN 2024 Solved paper" }]
      },
      {
        _type: "block",
        style: "normal",
        _key: "k2",
        children: [
          {
            _type: "span",
            text: "Contains solutions to Dijkstra's shortest path, Link State Routing, Distance Vector routing, and subnetting problems."
          }
        ]
      }
    ]
  },
  {
    _id: "demo-note-9",
    _createdAt: "2026-07-20T13:20:00Z",
    title: "Operating Systems One-Shot Revision Video Lectures",
    syllabus: "OS full syllabus one-shot video references and timestamps for quick exam preparation.",
    slug: { current: "os-oneshot-video" },
    university: "medicaps",
    degree: "btech-cse",
    year: "3rd-year",
    semester: "5th-semester",
    subject: "Operating Systems",
    type: "VIDEO-MATERIAL",
    isPremium: false,
    tier: "TIER_1",
    content: [
      {
        _type: "block",
        style: "h2",
        _key: "k1",
        children: [{ _type: "span", text: "OS Exam One-shot Links" }]
      },
      {
        _type: "block",
        style: "normal",
        _key: "k2",
        children: [
          {
            _type: "span",
            text: "This note aggregates high-quality YouTube lectures and timestamps for processes, synchronization, memory management, and paging structures."
          }
        ]
      }
    ]
  }
];

export const client = new Proxy(baseClient, {
  get(target, prop, receiver) {
    if (prop === "fetch") {
      return async function (query: any, params: any, options: any) {
        try {
          return await target.fetch(query, params, options);
        } catch (err: any) {
          console.warn("Sanity fetch error (using local mock fallback):", err.message || err);
          
          const qStr = typeof query === "string" ? query : "";
          
          // 1. NOTES_COUNT_QUERY
          if (qStr.trim().toLowerCase().startsWith("count(")) {
            let filtered = [...demoNotes];
            if (params?.university) {
              filtered = filtered.filter(n => n.university === params.university);
            }
            if (params?.degree) {
              filtered = filtered.filter(n => n.degree === params.degree);
            }
            if (params?.year) {
              filtered = filtered.filter(n => n.year === params.year);
            }
            if (params?.semester) {
              filtered = filtered.filter(n => n.semester === params.semester);
            }
            if (params?.search) {
              const s = params.search.toLowerCase();
              filtered = filtered.filter(n => n.title.toLowerCase().includes(s) || n.syllabus.toLowerCase().includes(s));
            }
            return filtered.length;
          }

          // 2. NOTE_BY_SLUG_QUERY
          if (qStr.includes("slug.current == $slug") || qStr.includes("NOTE_BY_SLUG_QUERY")) {
            const slugVal = params?.slug;
            const noteObj = demoNotes.find(n => n.slug.current === slugVal);
            if (noteObj) {
              const headings = noteObj.content.filter((b: any) => ["h2", "h3", "h4", "h5", "h6"].includes(b.style));
              return {
                ...noteObj,
                headings
              };
            }
            return null;
          }

          // 3. SUBJECTS_QUERY
          if ((qStr.includes("subject") && qStr.includes("SUBJECTS_QUERY")) || qStr.includes('"subject": subject')) {
            let filtered = [...demoNotes];
            if (params?.university) {
              filtered = filtered.filter(n => n.university === params.university);
            }
            if (params?.degree) {
              filtered = filtered.filter(n => n.degree === params.degree);
            }
            if (params?.year) {
              filtered = filtered.filter(n => n.year === params.year);
            }
            if (params?.semester) {
              filtered = filtered.filter(n => n.semester === params.semester);
            }
            const subjects = Array.from(new Set(filtered.map(n => n.subject))).map(sub => ({ subject: sub }));
            return subjects;
          }

          // 4. NOTES_QUERY or NEXT_UNITS_QUERY or SUBJECT_OTHER_CONTENT_QUERY
          if (qStr.includes('*[_type == "note"') || qStr.includes("NOTES_QUERY") || qStr.includes("NEXT_UNITS_QUERY") || qStr.includes("SUBJECT_OTHER_CONTENT_QUERY")) {
            let filtered = [...demoNotes];
            
            if (params?.university) {
              filtered = filtered.filter(n => n.university === params.university);
            }
            if (params?.degree) {
              filtered = filtered.filter(n => n.degree === params.degree);
            }
            if (params?.year) {
              filtered = filtered.filter(n => n.year === params.year);
            }
            if (params?.semester) {
              filtered = filtered.filter(n => n.semester === params.semester);
            }
            if (params?.subject) {
              filtered = filtered.filter(n => n.subject === params.subject);
            }
            if (params?.currentSlug) {
              filtered = filtered.filter(n => n.slug.current !== params.currentSlug);
            }
            if (params?.search) {
              const s = params.search.toLowerCase();
              filtered = filtered.filter(n => n.title.toLowerCase().includes(s) || n.syllabus.toLowerCase().includes(s));
            }

            // Filter by type depending on query specifics
            if (qStr.includes('type == "NOTES"')) {
              filtered = filtered.filter(n => n.type === "NOTES");
            } else if (qStr.includes('(type == "MST" || type == "PYQ"')) {
              filtered = filtered.filter(n => ["MST", "PYQ", "ONE-SHOT", "VIDEO-MATERIAL", "HANDWRITTEN-NOTES"].includes(n.type));
            } else if (params?.type && params.type !== "all") {
              filtered = filtered.filter(n => n.type === params.type.toUpperCase());
            }

            return filtered;
          }

          return [];
        }
      };
    }
    return Reflect.get(target, prop, receiver);
  }
});
