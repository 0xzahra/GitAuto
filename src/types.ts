// Types for GitAuto

export interface ProjectIdentity {
  name: string;
  tagline: string;
  website: string;
  description: string;
}

export interface TechnicalInputs {
  repos: string;
  openapi: string;
  stack: string;
  dependencies: string;
}

export interface BrandMedia {
  mediaKit: string;
  colorHex: string;
  logoUrl: string;
  tone: 'formal' | 'conversational' | 'developer-focused' | 'neutral';
}

export interface GitBookConnection {
  token: string;
  orgId: string;
  githubRepo: string;
}

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
  status: 'idle' | 'generating' | 'done' | 'error';
}

export interface AppState {
  identity: ProjectIdentity;
  technical: TechnicalInputs;
  brand: BrandMedia;
  gitbook: GitBookConnection;
  sections: DocumentSection[];
}
