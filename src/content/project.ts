export type VerificationStatus = "published-claim" | "to-be-confirmed";

export type ProjectFact = {
  label: string;
  value: string;
  source: string;
  verificationStatus: VerificationStatus;
  publicDisplay: boolean;
};

export type MallUnit = {
  id: string;
  slug: string;
  title: string;
  unitType: "Commercial" | "Administrative";
  offerType: "Sale" | "Lease";
  areaSqm: number;
  intendedUses: string[];
  image: string;
  imageAlt: string;
  description: string;
  isSampleData: true;
};

export const projectFacts: ProjectFact[] = [
  { label: "Advertised area — measurement to be confirmed", value: "1,250 m²", source: "Published social-media marketing material", verificationStatus: "to-be-confirmed", publicDisplay: true },
  { label: "Published location", value: "New Assiut City", source: "Published social-media marketing material", verificationStatus: "published-claim", publicDisplay: true },
  { label: "As depicted in project posts", value: "3 FLOORS + ROOFTOP", source: "Published renders and posts", verificationStatus: "to-be-confirmed", publicDisplay: true },
  { label: "Opportunity paths", value: "SALE + LEASING", source: "Published social-media marketing material", verificationStatus: "to-be-confirmed", publicDisplay: true },
];

export const units: MallUnit[] = [
  { id: "sample-c01", slug: "sample-retail-frontage", title: "Sample retail frontage", unitType: "Commercial", offerType: "Sale", areaSqm: 92, intendedUses: ["Retail", "Services"], image: "/assets/01-exterior-3d-visualization.png", imageAlt: "Trinity Mall exterior architectural visualization", description: "Illustrative sample for a retail-focused ownership enquiry.", isSampleData: true },
  { id: "sample-c02", slug: "sample-food-beverage-space", title: "Sample food & beverage space", unitType: "Commercial", offerType: "Lease", areaSqm: 140, intendedUses: ["Café", "Restaurant"], image: "/assets/03-rooftop-cafe-visualization.png", imageAlt: "Rooftop café seating visualization", description: "Illustrative sample for a food and beverage leasing enquiry.", isSampleData: true },
  { id: "sample-a01", slug: "sample-administrative-suite", title: "Sample administrative suite", unitType: "Administrative", offerType: "Sale", areaSqm: 125, intendedUses: ["Office", "Professional services"], image: "/assets/05-interior-reference-photo.png", imageAlt: "Interior reference photo supplied by the project", description: "Illustrative sample for an administrative ownership enquiry.", isSampleData: true },
  { id: "sample-a02", slug: "sample-corporate-office", title: "Sample corporate office", unitType: "Administrative", offerType: "Lease", areaSqm: 260, intendedUses: ["Corporate office", "Operations"], image: "/assets/02-building-progress-photo.png", imageAlt: "Building progress photo supplied by the project", description: "Illustrative sample for a corporate leasing enquiry.", isSampleData: true },
];

export const unverifiedContact = { verified: false, channels: ["01119027005", "01141909995", "01222373445"] };

export const publishedLocation = "New Assiut City, opposite the New Assiut Traffic Department";
