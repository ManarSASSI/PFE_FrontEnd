import { Contrat } from './contrat.model';

export interface Document {
  id: number;
  nom: string;
  type: string;
  cheminStockage: string;
  dateUpload: string; // ou Date
  contrat?: Contrat; // Optionnel
}