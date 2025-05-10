import { Contrat } from './contrat.model';

export interface SuiviContrat {
  id: number;
  dateSuivi: string; // ou Date si conversion
  action: string;
  commentaire: string;
  contrat?: Contrat; // Optionnel selon le besoin
}