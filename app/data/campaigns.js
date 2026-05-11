export const CAMPAIGN_TYPES = [
    { id: 'seo', label: 'SEO' },
    { id: 'paid-ads', label: 'Paid Ads' },
    { id: 'content', label: 'Content Marketing' },
    { id: 'social', label: 'Social Media' },
];

export const CAMPAIGN_STATUSES = [
    { id: 'draft', label: 'Draft' },
    { id: 'active', label: 'Active' },
    { id: 'paused', label: 'Paused' },
    { id: 'completed', label: 'Completed' },
];

export const INITIAL_CAMPAIGNS = [
    {
        id: 'camp1',
        name: 'Q1 SEO Push',
        clientId: 'c1',
        clientName: 'TechFlow Systems',
        type: 'seo',
        status: 'active',
        startDate: '2026-01-01',
        endDate: '2026-03-31',
        budget: '₹15,000',
    },
    {
        id: 'camp2',
        name: 'Product Launch Ads',
        clientId: 'c2',
        clientName: 'GreenEarth Organics',
        type: 'paid-ads',
        status: 'draft',
        startDate: '2026-02-01',
        endDate: '2026-02-28',
        budget: '₹8,000',
    },
    {
        id: 'camp3',
        name: 'Thought Leadership Blog',
        clientId: 'c3',
        clientName: 'Apex Consulting',
        type: 'content',
        status: 'active',
        startDate: '2026-01-15',
        endDate: '2026-06-30',
        budget: '₹12,000',
    },
    {
        id: 'camp4',
        name: 'LinkedIn Campaign',
        clientId: 'c1',
        clientName: 'TechFlow Systems',
        type: 'social',
        status: 'completed',
        startDate: '2025-10-01',
        endDate: '2025-12-31',
        budget: '₹5,000',
    },
];
