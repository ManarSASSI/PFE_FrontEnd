import { Contrat, EtatExecution } from './contrat.model';

export interface SuiviContrat {
  id: number;
  dateSuivi: Date; // ou Date si conversion
  action: string;
  commentaire: string;
  contrat?: Contrat;
  etatExecution: EtatExecution; // Optionnel selon le besoin
}