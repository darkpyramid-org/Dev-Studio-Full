import type {
  JobStatus,
  OfferStatus,
  ServiceStatus,
  JobPlatform,
  OfferPlatform,
  ServicePlatform,
  JobCategory,
  OfferCategory,
  FreelanceServiceCategory,
} from "@shared/enums";

import {
  JOB_STATUSES,
  OFFER_STATUSES,
  SERVICE_STATUSES,
  JOB_PLATFORMS,
  OFFER_PLATFORMS,
  SERVICE_PLATFORMS,
  JOB_CATEGORIES,
  OFFER_CATEGORIES,
  FREELANCE_SERVICE_CATEGORIES,
} from "@shared/enums";

export type {
  JobStatus,
  OfferStatus,
  ServiceStatus,
  JobPlatform,
  OfferPlatform,
  ServicePlatform,
  JobCategory,
  OfferCategory,
  FreelanceServiceCategory,
};

export {
  JOB_STATUSES,
  OFFER_STATUSES,
  SERVICE_STATUSES,
  JOB_PLATFORMS,
  OFFER_PLATFORMS,
  SERVICE_PLATFORMS,
  JOB_CATEGORIES,
  OFFER_CATEGORIES,
  FREELANCE_SERVICE_CATEGORIES,
};

export interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  platform: JobPlatform | string;
  status: JobStatus;
  salary: string;
  remote: boolean;
  category: string;
  tags: string[];
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface FreelanceOffer {
  id: string;
  title: string;
  client: string;
  platform: OfferPlatform | string;
  budget: string;
  currency: string;
  status: OfferStatus;
  description: string;
  url: string;
  deadline: string;
  category: string;
  tags: string[];
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface MyService {
  id: string;
  title: string;
  platform: ServicePlatform | string;
  url: string;
  category: string;
  price: string;
  currency: string;
  status: ServiceStatus;
  description: string;
  deliveryDays: number;
  tags: string[];
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface RemoteJob {
  id: string;
  url: string;
  title: string;
  company: string;
  company_logo?: string;
  location: string;
  tags: string[];
  salary_min?: number;
  salary_max?: number;
  date: string;
  description?: string;
}

export interface ScrapedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  source: string;
  postedAt: string;
  tags?: string[];
  salary?: string;
  logo?: string;
}
