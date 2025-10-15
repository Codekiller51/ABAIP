/*
  # Seed Initial Data

  1. Sample Data
    - Create initial admin user
    - Add sample insights
    - Add sample team members
    - Add sample services

  Note: This is sample data for development/testing purposes
*/

-- Insert sample team members
INSERT INTO team_members (name, title, bio, email, specialties, education, experience, order_index, active) VALUES
(
  'Angela M. Malando',
  'Managing Partner',
  'Experienced legal professional with a robust background in intellectual property management, corporate liability, and environmental laws. Demonstrates expertise in legal research, drafting, and analysis, with a strong focus on international law and alternative dispute resolution.',
  'angela@abaip.co.tz',
  ARRAY['Patent Law', 'Technology Licensing', 'IP Strategy'],
  ARRAY['Masters in IP', 'Post-Graduate Diploma in Legal Practice', 'LLB'],
  '10+ years',
  1,
  true
);

-- Insert sample services
INSERT INTO services (title, description, features, icon, color, order_index, active) VALUES
(
  'Patent Services',
  'Comprehensive patent prosecution, portfolio management, and strategic IP development.',
  ARRAY['Utility Patent Applications', 'Design Patent Protection', 'Provisional Patent Filing', 'Patent Portfolio Management', 'Prior Art Searches', 'Freedom to Operate Analysis'],
  'Shield',
  'from-primary-500 to-primary-600',
  1,
  true
),
(
  'Trademark Services',
  'Brand protection through strategic trademark registration and enforcement worldwide.',
  ARRAY['Trademark Search & Clearance', 'Federal Trademark Registration', 'International Trademark Filing', 'Trademark Portfolio Management', 'Brand Protection Strategy', 'Trademark Enforcement'],
  'Award',
  'from-accent-500 to-accent-600',
  2,
  true
),
(
  'Copyright Services',
  'Protection for creative works including software, content, and artistic expressions.',
  ARRAY['Copyright Registration', 'Software Copyright Protection', 'DMCA Compliance', 'Copyright Licensing', 'Infringement Defense', 'Work for Hire Agreements'],
  'FileText',
  'from-primary-600 to-primary-700',
  3,
  true
),
(
  'Trade Secrets',
  'Confidential information protection and trade secret compliance programs.',
  ARRAY['Trade Secret Audits', 'Protection Protocols', 'Employee Training', 'Non-Disclosure Agreements', 'Misappropriation Defense', 'Compliance Programs'],
  'Lock',
  'from-accent-600 to-accent-700',
  4,
  true
),
(
  'IP Litigation',
  'Aggressive representation in intellectual property disputes and enforcement actions.',
  ARRAY['Patent Infringement Litigation', 'Trademark Disputes', 'Copyright Enforcement', 'Trade Secret Litigation', 'IP Due Diligence', 'Settlement Negotiations'],
  'Scale',
  'from-primary-700 to-primary-800',
  5,
  true
),
(
  'Licensing & Transactions',
  'Strategic IP monetization through licensing agreements and technology transfers.',
  ARRAY['License Agreement Drafting', 'Technology Transfer', 'IP Valuation', 'Due Diligence', 'M&A IP Support', 'Joint Venture Agreements'],
  'Briefcase',
  'from-accent-700 to-accent-800',
  6,
  true
);

-- Insert sample insights
INSERT INTO insights (title, summary, content, author, status, featured, slug, categories, tags) VALUES
(
  'The Future of Intellectual Property in Africa',
  'An in-depth look at emerging trends and challenges in IP law across the African continent.',
  '<h2>Introduction</h2><p>This is the full content for the first insight. It discusses various aspects of intellectual property, including patents, trademarks, and copyrights, within the African context. We explore the impact of technology, globalization, and local regulations on IP development and protection.</p><h2>Key Trends</h2><p>The article also highlights key opportunities and challenges for businesses and innovators operating in or looking to enter African markets.</p>',
  'Dr. Aisha Rahman',
  'published',
  true,
  'future-of-ip-in-africa',
  ARRAY['Patents', 'Africa'],
  ARRAY['intellectual property', 'africa', 'trends']
),
(
  'Navigating Trademark Registration in Tanzania',
  'A comprehensive guide to the process of registering trademarks in Tanzania, from application to enforcement.',
  '<h2>Introduction</h2><p>This is the full content for the second insight. It provides a step-by-step guide for trademark registration in Tanzania, covering legal requirements, necessary documentation, and common pitfalls to avoid.</p><h2>Key Aspects</h2><p>We also delve into the importance of trademark protection for brand identity and market differentiation, offering practical advice for both local and international businesses.</p>',
  'Mr. David Kimaro',
  'published',
  true,
  'trademark-registration-tanzania',
  ARRAY['Trademarks', 'Tanzania'],
  ARRAY['trademark', 'tanzania', 'registration']
),
(
  'Copyright in the Digital Age: Protecting Creative Works Online',
  'Exploring the complexities of copyright protection for digital content and strategies for creators.',
  '<h2>Digital Copyright Challenges</h2><p>This is the full content for the third insight. It addresses the evolving landscape of copyright law in the digital era, focusing on the challenges and opportunities presented by online content distribution.</p><h2>Protection Strategies</h2><p>The article examines various digital rights management (DRM) strategies, fair use considerations, and international treaties relevant to protecting creative works such as software, music, and digital art. Practical tips for creators to safeguard their intellectual property online are also provided.</p>',
  'Prof. Elena Petrova',
  'published',
  false,
  'copyright-digital-age',
  ARRAY['Copyright', 'Digital'],
  ARRAY['copyright', 'digital', 'online']
),
(
  'Patent Law Innovations: A Global Perspective',
  'An overview of recent advancements and changes in patent law worldwide and their implications.',
  '<h2>Global Patent Trends</h2><p>This is the full content for the fourth insight. It offers a global perspective on recent innovations and reforms in patent law. We analyze the impact of new technologies, such as AI and biotechnology, on patent eligibility and scope.</p><h2>Harmonization Efforts</h2><p>The article also discusses the harmonization efforts across different jurisdictions and the challenges of enforcing patents in an increasingly interconnected world. Case studies of landmark patent disputes and their outcomes are included to illustrate key legal principles.</p>',
  'Dr. Chen Wei',
  'draft',
  false,
  'patent-law-innovations-global',
  ARRAY['Patents', 'Global'],
  ARRAY['patent', 'global', 'innovation']
);