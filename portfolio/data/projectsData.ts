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
    subtitle: 'Specialty Roastery & Interactive Barista Ordering Platform',
    category: 'WEB',
    type: 'Luxury Coffee Roastery E-Commerce & Barista Dispatch',
    role: 'Lead Full-Stack Developer & UI/UX Designer',
    period: '2026',
    status: 'Live on Vercel',
    link: 'https://jhescafe.vercel.app/',
    github: 'https://github.com/tabanginarjay-sketch/jhes-cafe',
    image: '/images/projects/jhes-cafe.png',
    overview:
      "Jhe's Cafe' is a Starbucks Reserve-inspired luxury coffee ordering web application designed for a premier highland roastery in Tagaytay. The platform features an interactive cup formulation engine, strict type-specific product rules, live Airtable inventory synchronization, and server-side price validation.",
    problemStatement:
      'Standard e-commerce platforms treat all food and beverage items identically, causing illogical options (such as sugar level sliders on pastries) and client-side price tampering. Jhe\'s Cafe required an artisanal, barista-grade experience where drink formulations adhere to strict barista physics.',
    solutionSummary:
      'Engineered a data-driven formulation architecture in Next.js 16 and FastAPI with centralized product taxonomy, dynamic price recalculation, and a fluid curved fly-to-cart animation.',
    tags: ['Next.js 16', 'FastAPI', 'Python 3.12', 'Airtable Sync', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    features: [
      {
        title: 'Interactive Barista Customizer',
        description:
          'Customers configure cup size, hot/iced temperature, milk selection (whole, oat, almond), sweetness sliders (0–100%), and extra espresso shots with a live updating cup ticket.',
      },
      {
        title: 'Type-Specific Formulation Rules',
        description:
          'Strict configuration rules prevent invalid options: cold brews lock to iced only, espresso drinks include roast origin notes, while doughnuts and pastries never show beverage sliders.',
      },
      {
        title: 'Physics-Based Fly-to-Cart Experience',
        description:
          'Smooth curved motion path animation that floats the selected cup into the header bag icon upon click, accompanied by subtle cart counter bounce and a sliding drawer.',
      },
      {
        title: 'Server-Side Price Validation',
        description:
          'FastAPI backend recalculates all item prices from raw option deltas before writing orders to Airtable, ensuring client-tampered prices are discarded.',
      },
    ],
    architecture: [
      {
        layer: 'Frontend Client',
        tech: 'Next.js 16 (Turbopack) & React',
        purpose: 'Interactive cup customizer, real-time ticket calculation, and fly-to-cart animations.',
      },
      {
        layer: 'Styling & Design System',
        tech: 'Tailwind CSS',
        purpose: 'Starbucks Reserve aesthetic: Forest green (#173D2B), warm cream (#F5F0E7), and serif typography.',
      },
      {
        layer: 'API & Backend',
        tech: 'FastAPI (Python 3.12) & Uvicorn',
        purpose: 'Order intake, price delta recalculation, and relational data serialization.',
      },
      {
        layer: 'Database & CMS',
        tech: 'Airtable Relational API',
        purpose: 'Real-time catalog source of truth: products, orders, categories, and inventory tags.',
      },
      {
        layer: 'Production Hosting',
        tech: 'Vercel Cloud Platform',
        purpose: 'Global edge distribution with zero-downtime automated deployment.',
      },
    ],
    technicalDecisions: [
      {
        decision: 'FastAPI for Backend Microservice',
        rationale:
          'FastAPI offers high-speed asynchronous request handling and strict Pydantic model validation, ideal for recalculating order prices and interfacing with Airtable.',
      },
      {
        decision: 'Data-Driven Product Customization System',
        rationale:
          'Instead of hardcoded forms per product, created a centralized registry that renders only supported options based on product category (coffee, cold brew, cake, doughnut).',
      },
      {
        decision: 'Airtable as Headless CMS',
        rationale:
          'Allows non-technical cafe managers to update prices, origin tags, and roast levels in real time without triggering code redeployments.',
      },
    ],
    challengesAndSolutions: [
      {
        challenge: 'Preventing Invalid Customization Options on Pastries',
        solution:
          'Enforced a discriminated union type structure in productCustomization.ts that binds customization UI elements strictly to product category tags.',
      },
      {
        challenge: 'Protecting Revenue from Client Price Tampering',
        solution:
          'Implemented server-side order price recalculation in orders/repository.py, fetching the base price and adding verified option deltas on the server.',
      },
    ],
    keyLearnings: [
      'Architecting resilient state synchronization between client drawers and server endpoints.',
      'Integrating external headless databases with high-performance Next.js caching.',
      'Translating premium retail brand guidelines into responsive web micro-interactions.',
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
