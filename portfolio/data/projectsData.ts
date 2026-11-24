export interface ProjectCaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'WEB' | 'PWA';
  type: string;
  role: string;
  period: string;
  status: string;
  link: string;
  github: string;
  image: string;
  overview: string;
  problemStatement: string;
  solutionSummary: string;
  tags: string[];
  features: {
    title: string;
    description: string;
  }[];
  architecture: {
    layer: string;
    tech: string;
    purpose: string;
  }[];
  technicalDecisions: {
    decision: string;
    rationale: string;
  }[];
  challengesAndSolutions: {
    challenge: string;
    solution: string;
  }[];
  keyLearnings: string[];
}

export const PROJECTS_DATA: ProjectCaseStudy[] = [
  {
    id: 'proj-jhes-cafe',
    slug: 'jhes-cafe',
    title: "Jhe's Cafe'",
    subtitle: 'Full-Stack Specialty Roastery, Ordering, Delivery Dispatch & Driver Portal Platform',
    category: 'WEB',
    type: 'Full-Stack Cafe E-Commerce, Delivery Dispatch & Driver Portal',
    role: 'Lead Full-Stack Developer & UI/UX Designer',
    period: '2026',
    status: 'Live on Vercel',
    link: 'https://jhescafe.vercel.app/',
    github: 'https://github.com/tabanginarjay-sketch/jhes-cafe',
    image: '/images/projects/jhes-cafe.png',
    overview:
      "Jhe's Cafe' is a full-stack specialty coffee ordering, delivery management, and loyalty platform built with Next.js 16, TypeScript, Python 3.12 (FastAPI & Pydantic v2), Google OAuth 2.0, Google Maps, Facebook OAuth, and Airtable. Beyond its Starbucks Reserve-inspired Interactive Barista Bar, the system runs end-to-end cafe operations: persistent account carts, configurable delivery zones, Cash on Delivery (COD) & verified payment ledgers, an Admin Operations Dashboard, and a role-protected Driver Portal.",
    problemStatement:
      'Independent cafes often stitch together disconnected menu sites, manual delivery tracking, unverified payment claims, and fragile login flows—causing client-side price tampering, duplicate customer accounts across Google/Email logins, unvalidated delivery fees, and mixed payment/order states.',
    solutionSummary:
      'Engineered an end-to-end full-stack architecture pairing Next.js 16 App Router with a Python 3.12 FastAPI + Pydantic v2 backend, live Airtable relational persistence, Google OAuth 2.0 & Facebook OAuth unified identity mapping, configurable delivery zones, separated order/delivery/payment lifecycles, and isolated RBAC portals for Customers, Admins, and Delivery Drivers.',
    tags: [
      'Next.js 16',
      'Python 3.12',
      'FastAPI',
      'Pydantic v2',
      'Google OAuth 2.0',
      'Google Maps',
      'Facebook OAuth',
      'TypeScript',
      'Tailwind CSS v4',
      'Airtable REST API',
      'RBAC & HttpOnly Auth',
      'COD & Payment Ledger',
    ],
    features: [
      {
        title: 'Interactive Barista Bar ("Your Perfect Cup, Your Way")',
        description:
          'Side-by-side live coffee studio featuring smooth image crossfades, dynamic pricing, cup size, temperature, milk selection, sweetness level, and strict category rules so pastries never display beverage options.',
      },
      {
        title: 'Complete Checkout & Configurable Delivery System',
        description:
          'Supports Dine-in (table/seating), Takeaway / Counter Pickup (pickup window), and Delivery with saved addresses, ASAP/scheduled windows, admin-configured serviceable barangays (zero hardcoded rates), minimum-order enforcement, and authoritative backend calculation (Subtotal + Delivery Fee - Discount).',
      },
      {
        title: 'Role-Protected Driver Portal (/driver)',
        description:
          'Isolated driver authentication against Airtable Staff with strict RBAC scoping: drivers see only their assigned deliveries (with customer 6-char handoff codes masked), advance strict state-machine milestones (PICKED_UP -> OUT_FOR_DELIVERY -> DELIVERED / FAILED_DELIVERY), verify handoff codes, and log COD cash collection.',
      },
      {
        title: 'Admin Dispatch, Delivery Zones & Live Orders Suite (/admin)',
        description:
          'Dedicated Admin Delivery Management (/admin/deliveries) for configuring serviceable zones, registering riders, assigning deliveries, updating ETAs, handling failed attempts, and confirming COD remittances alongside Live Barista Orders, Inventory auto-deduction, and Financial Reports.',
      },
      {
        title: 'Separated Order, Delivery & Payment Lifecycles (COD + Online)',
        description:
          'Supports Cash on Delivery (COD_PENDING -> driver cash collection -> separate authorized admin confirmation -> PAID), GCash, Maya, Credit/Debit Card, and Counter Cash with webhook verification, inline Live Order verification, and full audit trails.',
      },
      {
        title: 'Unified Google OAuth 2.0, Facebook OAuth & Email Auth',
        description:
          'Production Google Identity Services (authorization code & ID token verification), Facebook Graph API OAuth, and salted scrypt/Argon2 email/password login unified onto one canonical customer record per email with signed HttpOnly session cookies.',
      },
      {
        title: 'Customer Portal, Loyalty Bean Points & Live Delivery Tracking',
        description:
          'Clean customer IA with dedicated /account (Profile, Digital Member Card, immutable Bean Points Ledger), persistent /cart, focused /checkout, and /my-orders featuring a 6-stage delivery timeline, assigned driver contact, persisted in-app notifications, and restricted Customer–Driver–Admin messaging.',
      },
      {
        title: 'Python 3.12 FastAPI Backend & Server-Side Integrity',
        description:
          'Asynchronous Python FastAPI & Pydantic v2 modules validate payloads, enforce delivery transition matrices, recalculate catalog prices & fees on the server, and guard against client-side total tampering or duplicate order submissions.',
      },
    ],
    architecture: [
      {
        layer: 'Frontend & Customer UI',
        tech: 'Next.js 16 (App Router, Turbopack), React 19 & TypeScript',
        purpose: 'Interactive Barista Bar, persistent account cart, checkout dining preferences, customer tracking, Admin Suite, and isolated Driver Portal.',
      },
      {
        layer: 'Python Backend & Validation',
        tech: 'Python 3.12, FastAPI, Pydantic v2, Uvicorn & Async HTTPX',
        purpose: 'Typed API schemas, delivery zone & transition validation, price recalculation, Argon2/PyJWT auth services, and Airtable repository layer.',
      },
      {
        layer: 'Google & Third-Party APIs',
        tech: 'Google OAuth 2.0 / Identity Services, Google Maps & Facebook Graph API',
        purpose: 'Live Google & Facebook single sign-on with server-side token exchange, plus interactive Tagaytay flagship Google Maps embed & navigation.',
      },
      {
        layer: 'Security & RBAC Sessions',
        tech: 'HMAC-SHA256 HttpOnly Cookies, Scrypt/Argon2 & Role Guards',
        purpose: 'Separate verified sessions for Customers, Admins/Baristas, and Delivery Drivers with strict ownership checks on orders, deliveries, and payments.',
      },
      {
        layer: 'Database & Headless CMS',
        tech: 'Airtable Relational REST API',
        purpose: 'Live persistence for Products, Categories, Inventory, Users, Orders, OrderItems, Staff/Drivers, Payments Ledger, Delivery Zones, Dispatches, Saved Addresses, and Notifications.',
      },
      {
        layer: 'Styling & Cloud Hosting',
        tech: 'Tailwind CSS v4 & Vercel Production',
        purpose: 'Warm neighborhood reserve aesthetic (#173D2B forest green, #F5F0E7 oat cream, walnut accents) deployed globally with automated E2E verification.',
      },
    ],
    technicalDecisions: [
      {
        decision: 'Python FastAPI + Pydantic v2 Alongside Next.js Route Handlers',
        rationale:
          'Combining Python FastAPI/Pydantic v2 backend modules with Next.js serverless API routes provides strict schema validation, server-side catalog price & delivery fee recalculation, and zero-downtime edge deployment on Vercel.',
      },
      {
        decision: 'Unified Canonical Customer Identity Across Google, Facebook & Email',
        rationale:
          'Mapping Google OAuth, Facebook OAuth, and Email/Password logins to a single canonical customer ID per email prevents duplicate accounts and preserves one unified loyalty balance, saved cart, and order history.',
      },
      {
        decision: 'Strict Separation of Order, Delivery & Payment State Machines',
        rationale:
          'Decoupling order prep status, 6-stage delivery dispatch status, and payment settlement ensures drivers can record COD cash collection upon delivery without ever prematurely marking financial transactions as PAID.',
      },
      {
        decision: 'Zero Hardcoded Delivery Rates (Admin-Configurable Zones)',
        rationale:
          'Checkout fetches live active barangays and fees strictly from Airtable-backed Delivery Zones managed in /admin/deliveries, rejecting unsupported addresses and below-minimum carts on the backend.',
      },
    ],
    challengesAndSolutions: [
      {
        challenge: 'Preventing Stale Login Prompts & Duplicate Accounts Across OAuth & Email',
        solution:
          'Consolidated session verification onto one authoritative /api/v1/auth/me HttpOnly cookie endpoint, disabled stale prefetch redirect caching on protected routes, and implemented canonical email identity resolution across Google, Facebook, and Email logins.',
      },
      {
        challenge: 'Enforcing Strict Driver Isolation & Delivery Lifecycle Integrity',
        solution:
          'Issued an isolated jhes_driver_session cookie verified against Airtable Staff (role="driver"), masked customer 6-character handoff codes from driver APIs, enforced backend transition matrices, and blocked cross-driver or payment-settlement access with HTTP 403.',
      },
      {
        challenge: 'Protecting Revenue & Preventing Ledger Contamination',
        solution:
          'Recomputed all drink deltas, promo discounts, and delivery zone fees exclusively on the backend, rejected client-tampered totals, and isolated system envelopes (loyalty, saved addresses, delivery dispatch, notifications) from financial payment totals.',
      },
      {
        challenge: 'Preventing Invalid Drink Customizations on Pastries & Food',
        solution:
          'Enforced a category-driven customization contract in productCustomization.ts so espresso drinks render milk, temperature, and sweetness controls while pastries hide beverage options.',
      },
    ],
    keyLearnings: [
      'Architecting multi-role RBAC systems (Customer, Admin/Cashier, Delivery Driver) with strict backend ownership enforcement.',
      'Integrating Google OAuth 2.0, Facebook Graph API, and salted password authentication into a unified canonical user identity.',
      'Designing decoupled state machines for e-commerce fulfillment, delivery dispatch, and Cash on Delivery (COD) financial reconciliation.',
      'Validating production deployments end-to-end with automated multi-role API and workflow test suites.',
    ],
  },
  {
    id: 'proj-sole-surgeon',
    slug: 'sole-surgeon',
    title: 'Sole Surgeon Atelier & Worker PWA',
    subtitle: 'Bespoke Footwear Restoration Atelier & Offline-First Shop Floor PWA',
    category: 'PWA',
    type: 'E-Commerce Atelier & Worker Progressive Web App',
    role: 'PWA Architect & Full-Stack Developer',
    period: '2026',
    status: 'Production PWA',
    link: 'https://sole-surgeon-pwa.vercel.app/',
    github: 'https://github.com/tabanginarjay-sketch',
    image: '/images/projects/sole-surgeon.png',
    overview:
      'Sole Surgeon is a dual-interface platform for a precision footwear restoration atelier. It pairs a customer-facing service booking experience with an offline-first Progressive Web App (PWA) designed for technician shop floor intake and stage progression.',
    problemStatement:
      'Footwear restoration ateliers struggle with loose repair tracking, manual intake tickets, and unstable internet connectivity on the workshop floor, leading to lost customer status updates.',
    solutionSummary:
      'Built a Next.js 15 Progressive Web App with service worker background caching, before/after interactive sliders, sequential workflow stages, and real-time Airtable synchronization.',
    tags: ['Next.js 15', 'PWA Manifest', 'Service Worker', 'TypeScript', 'Tailwind CSS', 'Airtable API'],
    features: [
      {
        title: 'Interactive Before/After Slider',
        description:
          'Custom touch-friendly split canvas slider demonstrating deep cleaning, leather re-dyeing, and unyellowing results.',
      },
      {
        title: 'Offline-First Shop Floor PWA',
        description:
          'Service Worker caching allows technicians to log restoration stages (intake, deep wash, reglue, paint, QC) even during workshop network dropouts.',
      },
      {
        title: 'Live Order Tracking Portal',
        description:
          'Customers enter their unique tracking reference code to see live timeline stages and photo evidence of their footwear restoration.',
      },
      {
        title: 'Multi-Step Service Booking Workflow',
        description:
          'Streamlined intake wizard allowing customers to select services, specify sneaker models, and upload condition photos.',
      },
    ],
    architecture: [
      {
        layer: 'Frontend & PWA Shell',
        tech: 'Next.js 15 & React',
        purpose: 'Mobile-first atelier interface, standalone manifest mode, and installable app icon.',
      },
      {
        layer: 'Offline Worker',
        tech: 'Service Worker & Cache Storage API',
        purpose: 'Pre-caching critical assets and queuing shop floor updates during offline periods.',
      },
      {
        layer: 'Database & Sync',
        tech: 'Airtable API & LocalStorage Cache',
        purpose: 'Two-way synchronization for service requests, technician stages, and customer notifications.',
      },
      {
        layer: 'Styling',
        tech: 'Tailwind CSS',
        purpose: 'Industrial dark atelier aesthetic with high-contrast status badges.',
      },
    ],
    technicalDecisions: [
      {
        decision: 'PWA Standalone Configuration',
        rationale:
          'Enables shop floor technicians to install the app on mobile tablets without the friction of app store deployments.',
      },
      {
        decision: 'Hardware-Accelerated Before/After Slider',
        rationale:
          'Used GPU-composited container sizing rather than layout-thrashing left offset changes for smooth 60fps touch gestures.',
      },
    ],
    challengesAndSolutions: [
      {
        challenge: 'Data Synchronization during Network Interruptions',
        solution:
          'Designed a fallback LocalStorage action queue that buffers technician updates and flushes them to Airtable once internet reconnects.',
      },
    ],
    keyLearnings: [
      'Configuring production web app manifests and service worker caching strategies.',
      'Designing touch-optimized mobile interfaces for industrial working environments.',
    ],
  },
  {
    id: 'proj-eduscholar',
    slug: 'eduscholar',
    title: 'EduScholar - Scholarship Management System',
    subtitle: 'Cloud Scholarship Application & Automated Verification Portal',
    category: 'WEB',
    type: 'Full-Stack Student Scholarship Management Platform',
    role: 'Lead Full-Stack Developer & Database Architect',
    period: '2026',
    status: 'Live on Railway',
    link: 'https://eduscholar.up.railway.app',
    github: 'https://github.com/tabanginarjay-sketch',
    image: '/images/projects/eduscholar.png',
    overview:
      'EduScholar is a full-stack cloud scholarship application, document verification, grant tracking, and automated qualification evaluation portal deployed live on Railway for Bestlink College of the Philippines.',
    problemStatement:
      'The university scholarship office previously processed hundreds of paper application folders by hand, resulting in delayed grant disbursements, lost qualification forms, and duplicate manual grading.',
    solutionSummary:
      'Architected a cloud web portal that digitizes student scholarship submissions, validates financial documents, automates GPA threshold scoring, and provides administrators with grant disbursement tracking.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Railway Deployment', 'Auth'],
    features: [
      {
        title: 'Student Application & Document Intake',
        description:
          'Multi-step application wizard for income statements, Certificate of Grades (COG), and enrollment forms with server-side document verification.',
      },
      {
        title: 'Automated Qualification Evaluation',
        description:
          'Dynamic algorithm evaluates student GPA, household income bracket, and academic standing against scholarship grant requirements.',
      },
      {
        title: 'Administrator Verification Dashboard',
        description:
          'Faculty reviewers can inspect student files, approve or reject submissions with feedback, and monitor campus-wide grant allocations.',
      },
      {
        title: 'Relational Audit Trail',
        description:
          'Every application status change is timestamped in PostgreSQL with reviewer identification for institutional accountability.',
      },
    ],
    architecture: [
      {
        layer: 'Application Frontend',
        tech: 'Next.js & TypeScript',
        purpose: 'Accessible student application flow and high-density administration tables.',
      },
      {
        layer: 'Relational Database',
        tech: 'PostgreSQL',
        purpose: 'Normalized schemas for students, scholarship grants, applications, and documents.',
      },
      {
        layer: 'Cloud Infrastructure',
        tech: 'Railway Cloud Platform',
        purpose: 'Containerized production hosting with automated PostgreSQL backups.',
      },
    ],
    technicalDecisions: [
      {
        decision: 'PostgreSQL for Data Integrity',
        rationale:
          'Relational integrity constraints (foreign keys, check constraints) prevent orphaned applications and duplicate grant awards.',
      },
      {
        decision: 'Server-Side Document Validation',
        rationale:
          'Protects the portal against unauthorized file uploads by validating MIME types and sizes before persisting files.',
      },
    ],
    challengesAndSolutions: [
      {
        challenge: 'Handling Peak Application Deadlines without Slowdowns',
        solution:
          'Optimized database queries with compound indexing on student IDs and application status fields, reducing query response times under load.',
      },
    ],
    keyLearnings: [
      'Designing relational schemas for institutional compliance and academic grants.',
      'Deploying containerized web services on Railway cloud infrastructure.',
    ],
  },
  {
    id: 'proj-kusina',
    slug: 'kusina',
    title: 'Kusina Ordering App',
    subtitle: 'Restaurant Food Ordering, Dynamic Cart & Dispatch Platform',
    category: 'WEB',
    type: 'Restaurant Food Ordering & Menu App',
    role: 'Full-Stack Web Developer',
    period: '2026',
    status: 'Live on Render',
    link: 'https://kusina-ordering-app.onrender.com/',
    github: 'https://github.com/tabanginarjay-sketch',
    image: '/images/projects/kusina.png',
    overview:
      'Kusina Ordering App is a live restaurant ordering and menu platform developed for Anna Quintos Lagmay. It delivers a fast digital menu, dynamic item builder, real-time checkout cart, and customer dispatch system.',
    problemStatement:
      'Independent restaurants struggle with high third-party delivery commissions and complex proprietary POS systems, needing a lightweight, branded online ordering solution.',
    solutionSummary:
      'Developed a modern restaurant storefront powered by Laravel and Vite with rapid dish customization, instant cart subtotaling, secure payment integration, and customer order status tracking.',
    tags: ['Laravel', 'Vite', 'Tailwind CSS', 'Stripe Checkout', 'REST API', 'Render Cloud'],
    features: [
      {
        title: 'Interactive Restaurant Menu',
        description:
          'Visual food menu with instant category switching, dish availability indicators, and ingredient customization.',
      },
      {
        title: 'Dynamic Real-Time Cart',
        description:
          'Live checkout bag that calculates portion sizes, addon extras, and delivery subtotals on the fly.',
      },
      {
        title: 'Secure Checkout Gateway',
        description:
          'Integrated Stripe payment processing supporting card payments, mobile wallets, and order dispatch confirmations.',
      },
      {
        title: 'Order Status & Dispatch Tracking',
        description:
          'Generates a unique session order reference allowing customers to monitor preparation and delivery status in real time.',
      },
    ],
    architecture: [
      {
        layer: 'Full-Stack Framework',
        tech: 'Laravel & PHP',
        purpose: 'MVC backend routing, CSRF protection, session management, and Stripe API controller.',
      },
      {
        layer: 'Frontend Bundler',
        tech: 'Vite & Tailwind CSS',
        purpose: 'Sub-second Hot Module Replacement (HMR) and optimized CSS/JS bundles for mobile diners.',
      },
      {
        layer: 'Cloud Hosting',
        tech: 'Render Cloud Platform',
        purpose: 'Live web service hosting with SSL certificates and continuous deployment.',
      },
    ],
    technicalDecisions: [
      {
        decision: 'Vite with Tailwind CSS',
        rationale:
          'Minimizes asset download size on mobile cellular connections, ensuring customers can browse menus with zero lag.',
      },
      {
        decision: 'Server-Side Session Handling',
        rationale:
          'Guarantees order items and checkout amounts cannot be tampered with prior to Stripe payment generation.',
      },
    ],
    challengesAndSolutions: [
      {
        challenge: 'Seamless Mobile Dine-In and Takeout UX',
        solution:
          'Designed a sticky bottom cart bar and thumb-friendly order controls tailored for smartphone viewports.',
      },
    ],
    keyLearnings: [
      'Integrating Stripe Checkout webhooks with server-side order lifecycle handling.',
      'Deploying full-stack web applications on Render cloud hosting.',
    ],
  },
];
