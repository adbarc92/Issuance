export interface ProjectPersonInput {
  projectId: string;
  personId: string;
}

export interface ProjectPerson {
  id: string;
  projectId: string;
  personId: string;
}

export interface ProjectPersonnel {
  [id: string]: string[];
}
