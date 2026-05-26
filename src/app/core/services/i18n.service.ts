// core/services/i18n.service.ts
import { Injectable, signal } from '@angular/core';

export type Language = 'pt' | 'en' | 'fr';

export const TRADUCOES: Record<string, Record<Language, string>> = {
  // Navbar
  'nav.destinos': { pt: 'Destinos', en: 'Destinations', fr: 'Destinations' },
  'nav.minhas_viagens': { pt: 'Minhas Viagens', en: 'My Trips', fr: 'Mes Voyages' },
  'nav.planejar': { pt: 'Planejar Viagem', en: 'Plan Trip', fr: 'Planifier Voyage' },
  'nav.admin': { pt: 'Painel Admin', en: 'Admin Panel', fr: 'Panneau Admin' },
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

  // Login
  'login.titulo': { pt: 'Bem-vindo de volta', en: 'Welcome back', fr: 'Bon retour' },
  'login.subtitulo': { pt: 'Entre para continuar sua jornada', en: 'Login to continue your journey', fr: 'Connectez-vous pour continuer' },
  'login.email': { pt: 'Email', en: 'Email', fr: 'Email' },
  'login.senha': { pt: 'Senha', en: 'Password', fr: 'Mot de passe' },
  'login.entrar': { pt: 'Entrar', en: 'Login', fr: 'Connexion' },
  'login.carregando': { pt: 'Entrando...', en: 'Logging in...', fr: 'Connexion...' },
  'login.criar_conta': { pt: 'Criar nova conta', en: 'Create new account', fr: 'Créer un compte' },
  'login.esqueceu_senha': { pt: 'Esqueceu a senha?', en: 'Forgot password?', fr: 'Mot de passe oublié?' },
  'login.erro_campos': { pt: 'Preencha todos os campos', en: 'Please fill all fields', fr: 'Remplissez tous les champs' },
  'login.erro_credenciais': { pt: 'Email ou senha inválidos', en: 'Invalid email or password', fr: 'Email ou mot de passe invalide' },
  'login.erro_conexao': { pt: 'Erro de conexão', en: 'Connection error', fr: 'Erreur de connexion' },
  'login.sucesso': { pt: 'Login realizado com sucesso!', en: 'Login successful!', fr: 'Connexion réussie!' },

  // Recuperar Senha
  'recuperar.titulo': { pt: 'Recuperar senha', en: 'Reset password', fr: 'Réinitialiser' },
  'recuperar.subtitulo': { pt: 'Digite seu email para receber instruções', en: 'Enter your email to receive instructions', fr: 'Entrez votre email pour recevoir les instructions' },
  'recuperar.email': { pt: 'Email', en: 'Email', fr: 'Email' },
  'recuperar.enviar': { pt: 'Enviar instruções', en: 'Send instructions', fr: 'Envoyer' },
  'recuperar.enviando': { pt: 'Enviando...', en: 'Sending...', fr: 'Envoi...' },
  'recuperar.voltar': { pt: 'Voltar para o login', en: 'Back to login', fr: 'Retour' },
  'recuperar.enviado_titulo': { pt: 'Email enviado!', en: 'Email sent!', fr: 'Email envoyé!' },
  'recuperar.mensagem_enviado': { pt: 'Enviamos instruções de recuperação para', en: 'We sent reset instructions to', fr: 'Instructions envoyées à' },
  'recuperar.ir_login': { pt: 'Ir para o login', en: 'Go to login', fr: 'Aller à la connexion' },
  'recuperar.erro_email': { pt: 'Digite seu email', en: 'Enter your email', fr: 'Entrez votre email' },

  // Redefinir Senha
  'redefinir.titulo': { pt: 'Redefinir senha', en: 'Reset password', fr: 'Nouveau mot de passe' },
  'redefinir.subtitulo': { pt: 'Digite sua nova senha', en: 'Enter your new password', fr: 'Entrez votre nouveau mot de passe' },
  'redefinir.nova_senha': { pt: 'Nova senha', en: 'New password', fr: 'Nouveau mot de passe' },
  'redefinir.confirmar_senha': { pt: 'Confirmar senha', en: 'Confirm password', fr: 'Confirmer' },
  'redefinir.salvar': { pt: 'Salvar nova senha', en: 'Save new password', fr: 'Enregistrer' },
  'redefinir.salvando': { pt: 'Salvando...', en: 'Saving...', fr: 'Enregistrement...' },
  'redefinir.token_invalido': { pt: 'Token inválido ou expirado', en: 'Invalid or expired token', fr: 'Token invalide' },
  'redefinir.token_mensagem': { pt: 'Solicite uma nova recuperação de senha.', en: 'Request a new password reset.', fr: 'Demandez une nouvelle réinitialisation.' },
  'redefinir.solicitar_novo': { pt: 'Solicitar novo link', en: 'Request new link', fr: 'Nouveau lien' },
  'redefinir.sucesso_titulo': { pt: 'Senha redefinida!', en: 'Password reset!', fr: 'Mot de passe modifié!' },
  'redefinir.sucesso_mensagem': { pt: 'Sua senha foi alterada com sucesso.', en: 'Your password has been changed successfully.', fr: 'Votre mot de passe a été changé.' },
  'redefinir.ir_login': { pt: 'Ir para o login', en: 'Go to login', fr: 'Connexion' },
  'redefinir.erro_campos': { pt: 'Preencha todos os campos', en: 'Please fill all fields', fr: 'Remplissez tous les champs' },
  'redefinir.erro_senhas_diferentes': { pt: 'As senhas não coincidem', en: 'Passwords do not match', fr: 'Les mots de passe ne correspondent pas' },
  'redefinir.erro_senha_curta': { pt: 'A senha deve ter pelo menos 6 caracteres', en: 'Password must be at least 6 characters', fr: 'Minimum 6 caractères' },

  // Registo
  'registo.titulo': { pt: 'Criar Conta', en: 'Create Account', fr: 'Créer un compte' },
  'registo.subtitulo': { pt: 'Junte-se a nós e comece a planear as suas viagens', en: 'Join us and start planning your trips', fr: 'Rejoignez-nous' },
  'registo.nome': { pt: 'Nome Completo', en: 'Full Name', fr: 'Nom complet' },
  'registo.nome_placeholder': { pt: 'Digite seu nome completo', en: 'Enter your full name', fr: 'Votre nom' },
  'registo.email': { pt: 'E-mail', en: 'Email', fr: 'Email' },
  'registo.senha': { pt: 'Senha', en: 'Password', fr: 'Mot de passe' },
  'registo.senha_placeholder': { pt: 'Mínimo 6 caracteres', en: 'Minimum 6 characters', fr: 'Minimum 6 caractères' },
  'registo.confirmar_senha': { pt: 'Confirmar Senha', en: 'Confirm Password', fr: 'Confirmer' },
  'registo.confirmar_placeholder': { pt: 'Digite a senha novamente', en: 'Enter password again', fr: 'Répétez le mot de passe' },
  'registo.criar': { pt: 'Criar Conta', en: 'Create Account', fr: 'Créer' },
  'registo.criando': { pt: 'Criando conta...', en: 'Creating account...', fr: 'Création...' },
  'registo.ja_conta': { pt: 'Já tem uma conta?', en: 'Already have an account?', fr: 'Déjà un compte?' },
  'registo.fazer_login': { pt: 'Faça login', en: 'Login', fr: 'Connexion' },
  'registo.erro_campos': { pt: 'Preencha todos os campos', en: 'Please fill all fields', fr: 'Remplissez tous les champs' },
  'registo.erro_senhas': { pt: 'As senhas não coincidem', en: 'Passwords do not match', fr: 'Mots de passe différents' },
  'registo.erro_senha_curta': { pt: 'A senha deve ter pelo menos 6 caracteres', en: 'Password must be at least 6 characters', fr: 'Minimum 6 caractères' },
  'registo.erro_email_invalido': { pt: 'Digite um e-mail válido', en: 'Enter a valid email', fr: 'Email invalide' },
  'registo.sucesso': { pt: 'Conta criada com sucesso! Redirecionando...', en: 'Account created! Redirecting...', fr: 'Compte créé! Redirection...' },
  'registo.sucesso_notificacao': { pt: 'Conta criada com sucesso!', en: 'Account created successfully!', fr: 'Compte créé!' },
  'registo.erro_criar': { pt: 'Erro ao criar conta', en: 'Error creating account', fr: 'Erreur' },
  'registo.erro_conexao': { pt: 'Erro de conexão', en: 'Connection error', fr: 'Erreur' },
  'registo.erro_email_existe': { pt: 'Este e-mail já está registado', en: 'This email is already registered', fr: 'Email déjà utilisé' },
  'registo.erro_dados': { pt: 'Dados inválidos. Verifique as informações', en: 'Invalid data. Check your information', fr: 'Données invalides' },

  // Dashboard Admin
  'dashboard.title': { pt: 'Painel Administrativo', en: 'Administrative Panel', fr: 'Panneau Administratif' },
  'dashboard.subtitle': { pt: 'Gerencie destinos, usuários e viagens', en: 'Manage destinations, users and trips', fr: 'Gérez les destinations, utilisateurs et voyages' },
  'dashboard.destinos': { pt: 'Destinos', en: 'Destinations', fr: 'Destinations' },
  'dashboard.destinos_desc': { pt: 'Adicionar, editar ou remover destinos', en: 'Add, edit or remove destinations', fr: 'Ajouter, modifier ou supprimer des destinations' },
  'dashboard.usuarios': { pt: 'Utilizadores', en: 'Users', fr: 'Utilisateurs' },
  'dashboard.usuarios_desc': { pt: 'Gerenciar usuários do sistema', en: 'Manage system users', fr: 'Gérer les utilisateurs du système' },
  'dashboard.viagens': { pt: 'Viagens', en: 'Trips', fr: 'Voyages' },
  'dashboard.viagens_desc': { pt: 'Visualizar todas as viagens e pagamentos', en: 'View all trips and payments', fr: 'Voir tous les voyages et paiements' },
  'dashboard.relatorios': { pt: 'Relatórios', en: 'Reports', fr: 'Rapports' },
  'dashboard.relatorios_desc': { pt: 'Exportar dados e estatísticas', en: 'Export data and statistics', fr: 'Exporter les données et statistiques' },
  'dashboard.voltar': { pt: 'Voltar ao Site', en: 'Back to Site', fr: 'Retour au Site' },

  // Gestão de Viagens
  'gestao_viagens.titulo': { pt: 'Gestão de Viagens', en: 'Trip Management', fr: 'Gestion des Voyages' },
  'gestao_viagens.subtitulo': { pt: 'Visualize e gerencie todas as viagens do sistema', en: 'View and manage all system trips', fr: 'Visualisez et gérez tous les voyages du système' },
  'gestao_viagens.total': { pt: 'Total de Viagens', en: 'Total Trips', fr: 'Total des Voyages' },
  'gestao_viagens.cliente': { pt: 'Cliente', en: 'Client', fr: 'Client' },
  'gestao_viagens.destino': { pt: 'Destino', en: 'Destination', fr: 'Destination' },
  'gestao_viagens.periodo': { pt: 'Período', en: 'Period', fr: 'Période' },
  'gestao_viagens.status': { pt: 'Status', en: 'Status', fr: 'Statut' },
  'gestao_viagens.valor_total': { pt: 'Valor Total', en: 'Total Amount', fr: 'Montant Total' },
  'gestao_viagens.pagamento': { pt: 'Pagamento', en: 'Payment', fr: 'Paiement' },
  'gestao_viagens.acoes': { pt: 'Ações', en: 'Actions', fr: 'Actions' },
  'gestao_viagens.filtrar_status': { pt: 'Filtrar por Status', en: 'Filter by Status', fr: 'Filtrer par Statut' },
  'gestao_viagens.todos_status': { pt: 'Todos os status', en: 'All status', fr: 'Tous les statuts' },
  'gestao_viagens.confirmadas': { pt: 'Confirmadas', en: 'Confirmed', fr: 'Confirmés' },
  'gestao_viagens.planejando': { pt: 'Planejando', en: 'Planning', fr: 'Planification' },
  'gestao_viagens.reservadas': { pt: 'Reservadas', en: 'Booked', fr: 'Réservés' },
  'gestao_viagens.aguardando': { pt: 'Aguardando Pagamento', en: 'Awaiting Payment', fr: 'En Attente de Paiement' },
  'gestao_viagens.filtrar_pagamento': { pt: 'Filtrar por Pagamento', en: 'Filter by Payment', fr: 'Filtrer par Paiement' },
  'gestao_viagens.todos_pagamentos': { pt: 'Todos', en: 'All', fr: 'Tous' },
  'gestao_viagens.totalmente_pago': { pt: 'Totalmente Pago', en: 'Fully Paid', fr: 'Entièrement Payé' },
  'gestao_viagens.parcialmente_pago': { pt: 'Parcialmente Pago', en: 'Partially Paid', fr: 'Partiellement Payé' },
  'gestao_viagens.nao_pago': { pt: 'Não Pago', en: 'Not Paid', fr: 'Non Payé' },
  'gestao_viagens.falta': { pt: 'Falta', en: 'Remaining', fr: 'Reste' },
  'gestao_viagens.totalmente_pago_texto': { pt: 'Totalmente Pago', en: 'Fully Paid', fr: 'Entièrement Payé' },
  'gestao_viagens.registrar_pagamento': { pt: 'Registrar Pagamento', en: 'Register Payment', fr: 'Enregistrer le Paiement' },
  'gestao_viagens.valor_pagar': { pt: 'Valor a Pagar', en: 'Amount to Pay', fr: 'Montant à Payer' },
  'gestao_viagens.forma_pagamento': { pt: 'Forma de Pagamento', en: 'Payment Method', fr: 'Mode de Paiement' },
  'gestao_viagens.pagamento_vista': { pt: 'Pagamento à vista', en: 'Full Payment', fr: 'Paiement comptant' },
  'gestao_viagens.sinal': { pt: 'Sinal (30%)', en: 'Down Payment (30%)', fr: 'Acompte (30%)' },
  'gestao_viagens.parcelado': { pt: 'Parcelado', en: 'Installments', fr: 'Échelonné' },
  'gestao_viagens.transferencia': { pt: 'Transferência Bancária', en: 'Bank Transfer', fr: 'Virement Bancaire' },
  'gestao_viagens.multicaixa': { pt: 'Multicaixa Express', en: 'Multicaixa Express', fr: 'Multicaixa Express' },

  // Relatórios
  'relatorios.titulo': { pt: 'Relatórios e Estatísticas', en: 'Reports and Statistics', fr: 'Rapports et Statistiques' },
  'relatorios.exportar_pdf': { pt: 'Exportar PDF', en: 'Export PDF', fr: 'Exporter PDF' },
  'relatorios.exportar_excel': { pt: 'Exportar Excel', en: 'Export Excel', fr: 'Exporter Excel' },
  'relatorios.imprimir': { pt: 'Imprimir', en: 'Print', fr: 'Imprimer' },
  'relatorios.destinos': { pt: 'Destinos', en: 'Destinations', fr: 'Destinations' },
  'relatorios.usuarios': { pt: 'Usuários', en: 'Users', fr: 'Utilisateurs' },
  'relatorios.viagens': { pt: 'Viagens', en: 'Trips', fr: 'Voyages' },
  'relatorios.faturamento': { pt: 'Faturamento', en: 'Revenue', fr: 'Chiffre d\'affaires' },
  'relatorios.media': { pt: 'Média', en: 'Average', fr: 'Moyenne' },
  'relatorios.destinos_populares': { pt: 'Destinos Mais Populares', en: 'Most Popular Destinations', fr: 'Destinations les Plus Populaires' },
  'relatorios.ultimas_viagens': { pt: 'Últimas Viagens', en: 'Latest Trips', fr: 'Derniers Voyages' },
  'relatorios.status_viagens': { pt: 'Status das Viagens', en: 'Trip Status', fr: 'Statut des Voyages' },

  // Destinos (Admin)
  'destinos_admin.titulo': { pt: 'Gestão de Destinos', en: 'Destination Management', fr: 'Gestion des Destinations' },
  'destinos_admin.novo': { pt: 'Novo Destino', en: 'New Destination', fr: 'Nouvelle Destination' },
  'destinos_admin.nome': { pt: 'Nome', en: 'Name', fr: 'Nom' },
  'destinos_admin.pais': { pt: 'País', en: 'Country', fr: 'Pays' },
  'destinos_admin.cidade': { pt: 'Cidade', en: 'City', fr: 'Ville' },
  'destinos_admin.preco': { pt: 'Preço', en: 'Price', fr: 'Prix' },
  'destinos_admin.imagem': { pt: 'URL da Imagem', en: 'Image URL', fr: 'URL de l\'Image' },
  'destinos_admin.descricao': { pt: 'Descrição', en: 'Description', fr: 'Description' },

  // Usuários (Admin)
  'usuarios_admin.titulo': { pt: 'Gestão de Usuários', en: 'User Management', fr: 'Gestion des Utilisateurs' },
  'usuarios_admin.nome': { pt: 'Nome', en: 'Name', fr: 'Nom' },
  'usuarios_admin.email': { pt: 'Email', en: 'Email', fr: 'Email' },
  'usuarios_admin.tipo': { pt: 'Tipo', en: 'Type', fr: 'Type' },
  'usuarios_admin.telefone': { pt: 'Telefone', en: 'Phone', fr: 'Téléphone' },
  'usuarios_admin.data_cadastro': { pt: 'Data Cadastro', en: 'Registration Date', fr: 'Date d\'inscription' },
  'usuarios_admin.admin': { pt: 'Admin', en: 'Admin', fr: 'Admin' },
  'usuarios_admin.cliente': { pt: 'Cliente', en: 'Client', fr: 'Client' },

  // Comuns
  'common.carregando': { pt: 'Carregando...', en: 'Loading...', fr: 'Chargement...' },
  'common.salvar': { pt: 'Salvar', en: 'Save', fr: 'Enregistrer' },
  'common.cancelar': { pt: 'Cancelar', en: 'Cancel', fr: 'Annuler' },
  'common.voltar': { pt: 'Voltar', en: 'Back', fr: 'Retour' },
  'common.erro': { pt: 'Erro', en: 'Error', fr: 'Erreur' },
  'common.sucesso': { pt: 'Sucesso!', en: 'Success!', fr: 'Succès!' },
  'common.buscar': { pt: 'Buscar', en: 'Search', fr: 'Rechercher' },
  'common.atualizar': { pt: 'Atualizar', en: 'Refresh', fr: 'Actualiser' },
  'common.excluir': { pt: 'Excluir', en: 'Delete', fr: 'Supprimer' },
  'common.editar': { pt: 'Editar', en: 'Edit', fr: 'Modifier' },
  'common.ver': { pt: 'Ver', en: 'View', fr: 'Voir' },
  // Adicione estas linhas no objeto TRADUCOES do i18n.service.ts

  // Footer
  'footer.descricao': { 
    pt: 'Descubra o mundo com estilo e conforto. Planeje suas viagens de forma inteligente.', 
    en: 'Discover the world with style and comfort. Plan your trips intelligently.', 
    fr: 'Découvrez le monde avec style et confort. Planifiez vos voyages intelligemment.' 
  },
  'footer.destinos': { pt: 'Destinos', en: 'Destinations', fr: 'Destinations' },
  'footer.europa': { pt: 'Europa', en: 'Europe', fr: 'Europe' },
  'footer.america_sul': { pt: 'América do Sul', en: 'South America', fr: 'Amérique du Sud' },
  'footer.asia': { pt: 'Ásia', en: 'Asia', fr: 'Asie' },
  'footer.africa': { pt: 'África', en: 'Africa', fr: 'Afrique' },
  'footer.suporte': { pt: 'Suporte', en: 'Support', fr: 'Support' },
  'footer.central_ajuda': { pt: 'Central de Ajuda', en: 'Help Center', fr: "Centre d'aide" },
  'footer.termos_uso': { pt: 'Termos de Uso', en: 'Terms of Use', fr: "Conditions d'utilisation" },
  'footer.politica_privacidade': { pt: 'Política de Privacidade', en: 'Privacy Policy', fr: 'Politique de confidentialité' },
  'footer.contato': { pt: 'Contato', en: 'Contact', fr: 'Contact' },
  'footer.newsletter': { pt: 'Newsletter', en: 'Newsletter', fr: 'Newsletter' },
  'footer.newsletter_texto': { pt: 'Receba ofertas exclusivas', en: 'Receive exclusive offers', fr: 'Recevez des offres exclusives' },
  'footer.email_placeholder': { pt: 'Seu melhor email', en: 'Your best email', fr: 'Votre meilleur email' },
  'footer.copyright': { pt: '© 2026 Travelly - Todos os direitos reservados', en: '© 2026 Travelly - All rights reserved', fr: '© 2026 Travelly - Tous droits réservés' },
  'footer.badge_destinos': { pt: '50+ Destinos', en: '50+ Destinations', fr: '50+ Destinations' },
  'footer.badge_avaliacao': { pt: '4.8 Avaliação', en: '4.8 Rating', fr: '4.8 Note' },
  'footer.badge_seguro': { pt: 'Pagamento Seguro', en: 'Secure Payment', fr: 'Paiement Sécurisé' }
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

  getCurrentLang(): Language {
    return this.langSignal();
  }

  getLanguageLabel(): string {
    const labels = { pt: '🇵🇹 PT', en: '🇬🇧 EN', fr: '🇫🇷 FR' };
    return labels[this.langSignal()];
  }
}