import { Injectable, signal } from '@angular/core';

export type Language = 'pt' | 'en' | 'fr';

export const TRADUCOES: Record<string, Record<Language, string>> = {
  // Navbar
  'nav.destinos': { pt: 'Destinos', en: 'Destinations', fr: 'Destinations' },
  'nav.minhas_viagens': { pt: 'Minhas Viagens', en: 'My Trips', fr: 'Mes Voyages' },
  'nav.planejar': { pt: 'Planejar Viagem', en: 'Plan Trip', fr: 'Planifier Voyage' },
  'nav.admin': { pt: 'Admin', en: 'Admin', fr: 'Admin' },
  'nav.login': { pt: 'Entrar', en: 'Login', fr: 'Connexion' },
  'nav.registar': { pt: 'Registar', en: 'Sign Up', fr: "S'inscrire" },
  'nav.sair': { pt: 'Sair', en: 'Logout', fr: 'Déconnexion' },
   
  
  // Hero
  'hero.title': { pt: 'Travel Planner', en: 'Travel Planner', fr: 'Travel Planner' },
  'hero.subtitle': { pt: 'Planeje suas viagens de forma simples e organizada', en: 'Plan your trips simply and organized', fr: 'Planifiez vos voyages simplement et organisé' },
  'hero.button': { pt: 'Explorar Destinos', en: 'Explore Destinations', fr: 'Explorer Destinations' },

  // Destinos
  'destinos.titulo': { pt: 'Destinos Populares', en: 'Popular Destinations', fr: 'Destinations Populaires' },
  'destinos.ver_detalhes': { pt: 'Ver Detalhes', en: 'View Details', fr: 'Voir Détails' },
  'destinos.adicionar_favorito': { pt: 'Adicionar aos Favoritos', en: 'Add to Favorites', fr: 'Ajouter aux Favoris' },

  // Viagens
  'viagens.titulo': { pt: 'Minhas Viagens', en: 'My Trips', fr: 'Mes Voyages' },
  'viagens.nova': { pt: 'Nova Viagem', en: 'New Trip', fr: 'Nouveau Voyage' },
  'viagens.planejando': { pt: 'Planejando', en: 'Planning', fr: 'Planification' },
  'viagens.confirmada': { pt: 'Confirmada', en: 'Confirmed', fr: 'Confirmé' },
  'viagens.concluida': { pt: 'Concluída', en: 'Completed', fr: 'Terminé' },
  'viagens.cancelada': { pt: 'Cancelada', en: 'Canceled', fr: 'Annulé' },

  // Checkout/Planejamento
  'planejar.titulo': { pt: 'Planejar Viagem', en: 'Plan Trip', fr: 'Planifier Voyage' },
  'planejar.destino': { pt: 'Destino', en: 'Destination', fr: 'Destination' },
  'planejar.data_inicio': { pt: 'Data de Início', en: 'Start Date', fr: 'Date de Début' },
  'planejar.data_fim': { pt: 'Data de Fim', en: 'End Date', fr: 'Date de Fin' },
  'planejar.orcamento': { pt: 'Orçamento (Kz)', en: 'Budget (Kz)', fr: 'Budget (Kz)' },

  // Comuns
  'common.carregando': { pt: 'Carregando...', en: 'Loading...', fr: 'Chargement...' },
  'common.salvar': { pt: 'Salvar', en: 'Save', fr: 'Enregistrer' },
  'common.cancelar': { pt: 'Cancelar', en: 'Cancel', fr: 'Annuler' },
  'common.voltar': { pt: 'Voltar', en: 'Back', fr: 'Retour' },
  'common.erro': { pt: 'Erro', en: 'Error', fr: 'Erreur' },
  'common.sucesso': { pt: 'Sucesso!', en: 'Success!', fr: 'Succès!' }
};

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private langSignal = signal<Language>('pt');
  public currentLang = this.langSignal.asReadonly();

  constructor() {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang === 'pt' || savedLang === 'en' || savedLang === 'fr') {
      this.langSignal.set(savedLang);
    }
  }

  t(key: string): string {
    const traducao = TRADUCOES[key];
    if (!traducao) return key;
    return traducao[this.langSignal()];
  }

  setLanguage(lang: Language): void {
    this.langSignal.set(lang);
    localStorage.setItem('language', lang);
  }

  toggleLanguage(): void {
    const languages: Language[] = ['pt', 'en', 'fr'];
    const currentIndex = languages.indexOf(this.langSignal());
    const nextIndex = (currentIndex + 1) % languages.length;
    this.setLanguage(languages[nextIndex]);
  }

  getLanguageLabel(): string {
    const labels = { pt: '🇵🇹 PT', en: '🇬🇧 EN', fr: '🇫🇷 FR' };
    return labels[this.langSignal()];
  }
}