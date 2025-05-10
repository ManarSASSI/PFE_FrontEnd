// src/app/models/contrat.model.ts
import { User } from './user.model';
import { SuiviContrat } from './suivi-contrat.model';
import { Document } from './document.model';

export interface Contrat {
  id: number;
  typeContrat: TypeContrat;
  objetContrat: string;
  montant: number | null;
  partner: User;
  dateDebut: string; // ou Date si vous faites la conversion
  dateFin: string;   // ou Date si vous faites la conversion
  status: StatusContrat;
  commentaire: string | null;
  departement: Departement;
  heureDebutSemaine: string | null; // ou LocalTime si vous créez un type
  heureFinSemaine: string | null;   // ou LocalTime si vous créez un type
  etatExecution: EtatExecution;
  suivis: SuiviContrat[];
  documents: Document[];
  penaliteParJour: number | null;
  joursRetard: number | null;
  montantPenalite: number | null;
  alerteExpirationEnvoyee: boolean;
}

// Enums correspondants
export enum TypeContrat {
  SERVICE = 'SERVICE',
  TRAVAUX = 'TRAVAUX',
  CONTINU = 'CONTINU'
}

export enum StatusContrat {
  NOUVEAU = 'NOUVEAU',
  RENOUVELLEMENT = 'RENOUVELLEMENT'
}

export enum Departement {
  ADMIN_FINANCE = 'ADMIN_FINANCE',
  PPE_CC = 'PPE_CC',
  SUPPLY_CHAIN = 'SUPPLY_CHAIN',
  QUALITE = 'QUALITE'
}

export enum EtatExecution {
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  EN_RETARD = 'EN_RETARD'
}