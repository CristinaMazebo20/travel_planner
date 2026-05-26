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

  // Adicione estas linhas dentro do objeto TRADUCOES no i18n.service.ts

  // ==================== PLANEJAR VIAGEM ====================
  
  'planejar.subtitulo': { pt: 'Preencha os dados para criar seu roteiro', en: 'Fill in the details to create your itinerary', fr: 'Remplissez les détails pour créer votre itinéraire' },
  'planejar.destino_placeholder': { pt: 'Digite o nome do destino...', en: 'Enter destination name...', fr: 'Entrez le nom de la destination...' },
  'planejar.titulo_viagem': { pt: 'Título da viagem', en: 'Trip title', fr: 'Titre du voyage' },
  'planejar.titulo_placeholder': { pt: 'Ex: Férias em Paris', en: 'Ex: Vacation in Paris', fr: 'Ex: Vacances à Paris' },
  'planejar.forma_pagamento': { pt: 'Forma de Pagamento', en: 'Payment Method', fr: 'Mode de paiement' },
  'planejar.pagar_agora': { pt: 'Pagar agora (100%)', en: 'Pay now (100%)', fr: 'Payer maintenant (100%)' },
  'planejar.sinal': { pt: 'Pagar sinal (30%) - Restante depois', en: 'Pay deposit (30%) - Remaining later', fr: 'Payer acompte (30%) - Reste plus tard' },
  'planejar.reservar': { pt: 'Reservar (pagar depois)', en: 'Reserve (pay later)', fr: 'Réserver (payer plus tard)' },
  'planejar.parcelar': { pt: 'Parcelar', en: 'Installments', fr: 'Échelonné' },
  'planejar.numero_parcelas': { pt: 'Número de parcelas', en: 'Number of installments', fr: 'Nombre de mensualités' },
  'planejar.sem_juros': { pt: 'sem juros', en: 'interest-free', fr: 'sans intérêts' },
  'planejar.com_juros_5': { pt: 'com juros (5%)', en: 'with interest (5%)', fr: 'avec intérêts (5%)' },
  'planejar.com_juros_8': { pt: 'com juros (8%)', en: 'with interest (8%)', fr: 'avec intérêts (8%)' },
  'planejar.valor_parcela': { pt: 'Valor por parcela', en: 'Installment amount', fr: 'Montant par mensualité' },
  'planejar.resumo_pagamento': { pt: 'Resumo do Pagamento', en: 'Payment Summary', fr: 'Résumé du paiement' },
  'planejar.valor_total': { pt: 'Valor total da viagem', en: 'Total trip value', fr: 'Valeur totale du voyage' },
  'planejar.sinal_valor': { pt: 'Sinal (30%)', en: 'Deposit (30%)', fr: 'Acompte (30%)' },
  'planejar.restante': { pt: 'Restante a pagar', en: 'Remaining to pay', fr: 'Reste à payer' },
  'planejar.total_pagar': { pt: 'Total a pagar agora', en: 'Total to pay now', fr: 'Total à payer maintenant' },
  'planejar.valor_reserva': { pt: 'Valor a pagar na reserva', en: 'Amount to pay on reservation', fr: 'Montant à payer à la réservation' },
  'planejar.reserva_obs': { pt: '(pague até 7 dias antes da viagem)', en: '(pay up to 7 days before the trip)', fr: '(payer jusqu\'à 7 jours avant le voyage)' },
  'planejar.pagamento_seguro': { pt: 'Pagamento Seguro', en: 'Secure Payment', fr: 'Paiement sécurisé' },
  'planejar.cartao_credito': { pt: 'Cartão de Crédito', en: 'Credit Card', fr: 'Carte de crédit' },
  'planejar.pix': { pt: 'PIX', en: 'PIX', fr: 'PIX' },
  'planejar.multicaixa': { pt: 'Multicaixa', en: 'Multicaixa', fr: 'Multicaixa' },
  'planejar.pagamento_simulado': { pt: 'Pagamento simulado com sucesso!', en: 'Payment simulated successfully!', fr: 'Paiement simulé avec succès!' },
  'planejar.valor': { pt: 'Valor', en: 'Amount', fr: 'Montant' },
  'planejar.forma': { pt: 'Forma', en: 'Method', fr: 'Méthode' },
  'planejar.confirmar_viagem': { pt: 'Confirmar e criar viagem', en: 'Confirm and create trip', fr: 'Confirmer et créer le voyage' },
  'planejar.btn_pagar_agora': { pt: '💳 Pagar agora e confirmar viagem', en: '💳 Pay now and confirm trip', fr: '💳 Payer maintenant et confirmer' },
  'planejar.btn_sinal': { pt: '📝 Pagar sinal e reservar', en: '📝 Pay deposit and reserve', fr: '📝 Payer acompte et réserver' },
  'planejar.btn_reservar': { pt: '📅 Reservar (pagar depois)', en: '📅 Reserve (pay later)', fr: '📅 Réserver (payer plus tard)' },
  'planejar.btn_parcelar': { pt: '📆 Parcelar', en: '📆 Installments', fr: '📆 Échelonné' },
  'planejar.btn_continuar': { pt: 'Continuar', en: 'Continue', fr: 'Continuer' },
  'planejar.erro_login': { pt: 'Faça login primeiro', en: 'Please login first', fr: 'Veuillez vous connecter d\'abord' },
  'planejar.erro_campos': { pt: 'Preencha todos os campos', en: 'Fill all fields', fr: 'Remplissez tous les champs' },
  'planejar.sucesso_viagem': { pt: 'Viagem planejada com sucesso!', en: 'Trip planned successfully!', fr: 'Voyage planifié avec succès!' },
  'planejar.erro_criar': { pt: 'Erro ao criar viagem', en: 'Error creating trip', fr: 'Erreur lors de la création du voyage' },
  'planejar.erro_conexao': { pt: 'Erro de conexão', en: 'Connection error', fr: 'Erreur de connexion' },
  'planejar.pagamento_vista': { pt: 'Pagamento à vista', en: 'Full payment', fr: 'Paiement comptant' },
  'planejar.sinal_texto': { pt: 'Sinal (30%)', en: 'Deposit (30%)', fr: 'Acompte (30%)' },
  'planejar.parcelado_texto': { pt: 'Parcelado em', en: 'Installments', fr: 'Échelonné en' },
  'planejar.reserva_texto': { pt: 'Reserva', en: 'Reservation', fr: 'Réservation' },

  // ==================== PAGAMENTO SUCESSO ====================
  'pagamento_sucesso.titulo': { pt: 'Pagamento Confirmado!', en: 'Payment Confirmed!', fr: 'Paiement Confirmé!' },
  'pagamento_sucesso.subtitulo': { pt: 'Sua viagem foi confirmada com sucesso.', en: 'Your trip has been successfully confirmed.', fr: 'Votre voyage a été confirmé avec succès.' },
  'pagamento_sucesso.detalhes': { pt: 'Detalhes da Viagem', en: 'Trip Details', fr: 'Détails du Voyage' },
  'pagamento_sucesso.destino': { pt: 'Destino', en: 'Destination', fr: 'Destination' },
  'pagamento_sucesso.data_inicio': { pt: 'Data de início', en: 'Start date', fr: 'Date de début' },
  'pagamento_sucesso.data_fim': { pt: 'Data de fim', en: 'End date', fr: 'Date de fin' },
  'pagamento_sucesso.forma_pagamento': { pt: 'Forma de pagamento', en: 'Payment method', fr: 'Mode de paiement' },
  'pagamento_sucesso.valor_pago': { pt: 'Valor pago', en: 'Amount paid', fr: 'Montant payé' },
  'pagamento_sucesso.ver_viagens': { pt: 'Ver minhas viagens', en: 'View my trips', fr: 'Voir mes voyages' },
  'pagamento_sucesso.explorar': { pt: 'Explorar mais destinos', en: 'Explore more destinations', fr: 'Explorer plus de destinations' },

  // ==================== MINHAS VIAGENS ====================
  'minhas_viagens.titulo': { pt: 'Minhas Viagens', en: 'My Trips', fr: 'Mes Voyages' },
  'minhas_viagens.subtitulo': { pt: 'Gerencie seus planos de viagem', en: 'Manage your travel plans', fr: 'Gérez vos plans de voyage' },
  'minhas_viagens.sem_viagens': { pt: 'Nenhuma viagem planejada', en: 'No trips planned', fr: 'Aucun voyage planifié' },
  'minhas_viagens.sem_viagens_texto': { pt: 'Comece a planejar sua próxima aventura!', en: 'Start planning your next adventure!', fr: 'Commencez à planifier votre prochaine aventure!' },
  'minhas_viagens.planejar': { pt: 'Planejar viagem', en: 'Plan trip', fr: 'Planifier voyage' },
  'minhas_viagens.pago': { pt: 'Pago', en: 'Paid', fr: 'Payé' },
  'minhas_viagens.ver_detalhes': { pt: 'Ver detalhes', en: 'View details', fr: 'Voir détails' },

  // ==================== DETALHE VIAGEM ====================
  'detalhe_viagem.voltar': { pt: 'Voltar para minhas viagens', en: 'Back to my trips', fr: 'Retour à mes voyages' },
  'detalhe_viagem.datas_viagem': { pt: 'Datas da Viagem', en: 'Trip Dates', fr: 'Dates du Voyage' },
  'detalhe_viagem.data_inicio': { pt: 'Data de início', en: 'Start date', fr: 'Date de début' },
  'detalhe_viagem.data_fim': { pt: 'Data de fim', en: 'End date', fr: 'Date de fin' },
  'detalhe_viagem.duracao': { pt: 'Duração', en: 'Duration', fr: 'Durée' },
  'detalhe_viagem.dias': { pt: 'dias', en: 'days', fr: 'jours' },
  'detalhe_viagem.editar_datas': { pt: 'Editar datas', en: 'Edit dates', fr: 'Modifier les dates' },
  'detalhe_viagem.destino': { pt: 'Destino', en: 'Destination', fr: 'Destination' },
  'detalhe_viagem.pais': { pt: 'País', en: 'Country', fr: 'Pays' },
  'detalhe_viagem.descricao': { pt: 'Descrição', en: 'Description', fr: 'Description' },
  'detalhe_viagem.financeiro': { pt: 'Financeiro', en: 'Financial', fr: 'Finances' },
  'detalhe_viagem.orcamento_total': { pt: 'Orçamento total', en: 'Total budget', fr: 'Budget total' },
  'detalhe_viagem.valor_pago': { pt: 'Valor pago', en: 'Amount paid', fr: 'Montant payé' },
  'detalhe_viagem.saldo_restante': { pt: 'Saldo restante', en: 'Remaining balance', fr: 'Solde restant' },
  'detalhe_viagem.forma_pagamento': { pt: 'Forma de pagamento', en: 'Payment method', fr: 'Mode de paiement' },
  'detalhe_viagem.status_viagem': { pt: 'Status da Viagem', en: 'Trip Status', fr: 'Statut du Voyage' },
  'detalhe_viagem.status_atual': { pt: 'Status atual', en: 'Current status', fr: 'Statut actuel' },
  'detalhe_viagem.data_planejamento': { pt: 'Data do planejamento', en: 'Planning date', fr: 'Date de planification' },
  'detalhe_viagem.editar_viagem': { pt: 'Editar viagem', en: 'Edit trip', fr: 'Modifier le voyage' },
  'detalhe_viagem.adicionar_pagamento': { pt: 'Adicionar pagamento', en: 'Add payment', fr: 'Ajouter un paiement' },
  'detalhe_viagem.concluir_pagamento': { pt: 'Concluir pagamento', en: 'Complete payment', fr: 'Compléter le paiement' },
  'detalhe_viagem.cancelar_viagem': { pt: 'Cancelar viagem', en: 'Cancel trip', fr: 'Annuler le voyage' },
  'detalhe_viagem.viagem_nao_encontrada': { pt: 'Viagem não encontrada', en: 'Trip not found', fr: 'Voyage non trouvé' },

  // ==================== MODAIS DETALHE VIAGEM ====================
  'modal.editar_viagem.titulo': { pt: 'Editar Viagem', en: 'Edit Trip', fr: 'Modifier le Voyage' },
  'modal.editar_viagem.titulo_viagem': { pt: 'Título da viagem', en: 'Trip title', fr: 'Titre du voyage' },
  'modal.editar_viagem.data_inicio': { pt: 'Data de início', en: 'Start date', fr: 'Date de début' },
  'modal.editar_viagem.data_fim': { pt: 'Data de fim', en: 'End date', fr: 'Date de fin' },
  'modal.editar_viagem.orcamento': { pt: 'Orçamento (Kz)', en: 'Budget (Kz)', fr: 'Budget (Kz)' },
  'modal.editar_viagem.salvar': { pt: 'Salvar alterações', en: 'Save changes', fr: 'Enregistrer les modifications' },

  'modal.pagamento.titulo': { pt: 'Adicionar Pagamento', en: 'Add Payment', fr: 'Ajouter un Paiement' },
  'modal.pagamento.valor': { pt: 'Valor a pagar (Kz)', en: 'Amount to pay (Kz)', fr: 'Montant à payer (Kz)' },
  'modal.pagamento.forma': { pt: 'Forma de pagamento', en: 'Payment method', fr: 'Mode de paiement' },
  'modal.pagamento.saldo_restante': { pt: 'Saldo restante', en: 'Remaining balance', fr: 'Solde restant' },
  'modal.pagamento.adicionar': { pt: 'Adicionar pagamento', en: 'Add payment', fr: 'Ajouter le paiement' },

  'modal.concluir_pagamento.titulo': { pt: 'Concluir Pagamento', en: 'Complete Payment', fr: 'Compléter le Paiement' },
  'modal.concluir_pagamento.mensagem': { pt: 'Deseja concluir o pagamento total da viagem?', en: 'Do you want to complete the full payment of the trip?', fr: 'Voulez-vous compléter le paiement total du voyage?' },
  'modal.concluir_pagamento.valor_restante': { pt: 'Valor restante', en: 'Remaining amount', fr: 'Montant restant' },
  'modal.concluir_pagamento.confirmar': { pt: 'Confirmar pagamento', en: 'Confirm payment', fr: 'Confirmer le paiement' },

  'modal.cancelar.titulo': { pt: 'Cancelar Viagem', en: 'Cancel Trip', fr: 'Annuler le Voyage' },
  'modal.cancelar.mensagem': { pt: 'Tem certeza que deseja cancelar esta viagem?', en: 'Are you sure you want to cancel this trip?', fr: 'Êtes-vous sûr de vouloir annuler ce voyage?' },
  'modal.cancelar.aviso_irreversivel': { pt: 'Esta ação não pode ser desfeita.', en: 'This action cannot be undone.', fr: 'Cette action ne peut pas être annulée.' },
  'modal.cancelar.reembolso': { pt: 'Você receberá reembolso de {{ valor }} Kz conforme política de cancelamento.', en: 'You will receive a refund of {{ valor }} Kz according to the cancellation policy.', fr: 'Vous recevrez un remboursement de {{ valor }} Kz selon la politique d\'annulation.' },
  'modal.cancelar.reembolso_zero': { pt: 'Nenhum valor foi pago, cancelamento gratuito.', en: 'No amount was paid, free cancellation.', fr: 'Aucun montant n\'a été payé, annulation gratuite.' },
  'modal.cancelar.confirmar': { pt: 'Sim, cancelar viagem', en: 'Yes, cancel trip', fr: 'Oui, annuler le voyage' },
  'modal.cancelar.voltar': { pt: 'Voltar', en: 'Back', fr: 'Retour' },

  // ==================== STATUS ====================
  'status.confirmada': { pt: 'Confirmada', en: 'Confirmed', fr: 'Confirmée' },
  'status.planejando': { pt: 'Planejando', en: 'Planning', fr: 'Planification' },
  'status.reservada': { pt: 'Reservada', en: 'Reserved', fr: 'Réservée' },
  'status.aguardando': { pt: 'Aguardando pagamento', en: 'Awaiting payment', fr: 'En attente de paiement' },
  'status.cancelada': { pt: 'Cancelada', en: 'Canceled', fr: 'Annulée' },
  // Adicione estas linhas ao TRADUCOES
  'detalhe_viagem.descricao_indisponivel': { pt: 'Informações não disponíveis', en: 'Information not available', fr: 'Informations non disponíveis' },
  // Adicione estas linhas ao TRADUCOES
  'modal.cancelar.reembolso_politica': { pt: 'Kz conforme política de cancelamento.', en: 'Kz according to the cancellation policy.', fr: 'Kz selon la politique d\'annulation.' },



  // ==================== PAGAMENTO ====================
  'pagamento.vista': { pt: 'Pagamento à vista', en: 'Full payment', fr: 'Paiement comptant' },
  'pagamento.sinal': { pt: 'Sinal (30%)', en: 'Deposit (30%)', fr: 'Acompte (30%)' },
  'pagamento.parcelado': { pt: 'Parcelado', en: 'Installments', fr: 'Échelonné' },
  'pagamento.reserva': { pt: 'Reserva', en: 'Reservation', fr: 'Réservation' },
  'pagamento.pix': { pt: 'PIX', en: 'PIX', fr: 'PIX' },
  'pagamento.cartao': { pt: 'Cartão de Crédito', en: 'Credit Card', fr: 'Carte de crédit' },
  'pagamento.dinheiro': { pt: 'Dinheiro', en: 'Cash', fr: 'Espèces' },
  'pagamento.transferencia': { pt: 'Transferência Bancária', en: 'Bank Transfer', fr: 'Virement bancaire' },
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
  'footer.badge_seguro': { pt: 'Pagamento Seguro', en: 'Secure Payment', fr: 'Paiement Sécurisé' },
  // Adicione estas linhas ao TRADUCOES
'destinos.hero_title': { pt: 'Explore o mundo com', en: 'Explore the world with', fr: 'Explorez le monde avec' },
'destinos.hero_subtitle': { pt: 'Encontre os melhores destinos e planeje sua viagem perfeita', en: 'Find the best destinations and plan your perfect trip', fr: 'Trouvez les meilleures destinations et planifiez votre voyage parfait' },
'destinos.destino_label': { pt: 'Destino', en: 'Destination', fr: 'Destination' },
'destinos.destino_placeholder': { pt: 'Para onde você quer ir?', en: 'Where do you want to go?', fr: 'Où voulez-vous aller?' },
'destinos.data_ida': { pt: 'Data de ida', en: 'Departure date', fr: 'Date de départ' },
'destinos.data_volta': { pt: 'Data de volta', en: 'Return date', fr: 'Date de retour' },
'destinos.pesquisar': { pt: 'Pesquisar', en: 'Search', fr: 'Rechercher' },
'destinos.destaques': { pt: 'Destinos em destaque', en: 'Featured destinations', fr: 'Destinations en vedette' },
'destinos.destaques_sub': { pt: 'Os lugares mais desejados do momento', en: 'The most wanted places right now', fr: 'Les endroits les plus recherchés du moment' },
'destinos.a_partir_de': { pt: 'a partir de', en: 'from', fr: 'à partir de' },
'destinos.excelente': { pt: 'Excelente', en: 'Excellent', fr: 'Excellent' },
'destinos.nenhum_encontrado': { pt: 'Nenhum destino encontrado.', en: 'No destinations found.', fr: 'Aucune destination trouvée.' },
'destinos.erro_carregar': { pt: 'Erro ao carregar destinos.', en: 'Error loading destinations.', fr: 'Erreur lors du chargement des destinations.' },
'destinos.erro_conexao': { pt: 'Erro de conexão com o servidor.', en: 'Connection error with the server.', fr: 'Erreur de connexion avec le serveur.' },
'common.tentar_novamente': { pt: 'Tentar novamente', en: 'Try again', fr: 'Réessayer' },
// Adicione estas linhas ao TRADUCOES
'detalhe_destino.voltar': { pt: 'Voltar para destinos', en: 'Back to destinations', fr: 'Retour aux destinations' },
'detalhe_destino.sobre': { pt: 'Sobre o destino', en: 'About the destination', fr: 'À propos de la destination' },
'detalhe_destino.atracoes': { pt: 'Atrações principais', en: 'Main attractions', fr: 'Attractions principales' },
'detalhe_destino.melhor_epoca': { pt: 'Melhor época para visitar', en: 'Best time to visit', fr: 'Meilleure période pour visiter' },
'detalhe_destino.melhor_epoca_padrao': { pt: 'Durante todo o ano', en: 'All year round', fr: 'Toute l\'année' },
'detalhe_destino.preco_medio': { pt: 'Preço médio', en: 'Average price', fr: 'Prix moyen' },
'detalhe_destino.preco_descricao': { pt: 'por pessoa (ida e volta)', en: 'per person (round trip)', fr: 'par personne (aller-retour)' },
'detalhe_destino.planejar': { pt: 'Planejar viagem', en: 'Plan trip', fr: 'Planifier le voyage' },
'detalhe_destino.avaliacao': { pt: 'Avaliação', en: 'Rating', fr: 'Évaluation' },
'detalhe_destino.nao_encontrado': { pt: 'Destino não encontrado', en: 'Destination not found', fr: 'Destination non trouvée' },
'detalhe_destino.erro_identificar': { pt: 'Destino não identificado', en: 'Destination not identified', fr: 'Destination non identifiée' },
'detalhe_destino.erro_encontrar': { pt: 'Destino não encontrado', en: 'Destination not found', fr: 'Destination non trouvée' },
'detalhe_destino.erro_conexao': { pt: 'Erro de conexão', en: 'Connection error', fr: 'Erreur de connexion' },
// Adicione ao TRADUCOES
'meses.janeiro': { pt: 'janeiro', en: 'January', fr: 'janvier' },
'meses.fevereiro': { pt: 'fevereiro', en: 'February', fr: 'février' },
'meses.marco': { pt: 'março', en: 'March', fr: 'mars' },
'meses.abril': { pt: 'abril', en: 'April', fr: 'avril' },
'meses.maio': { pt: 'maio', en: 'May', fr: 'mai' },
'meses.junho': { pt: 'junho', en: 'June', fr: 'juin' },
'meses.julho': { pt: 'julho', en: 'July', fr: 'juillet' },
'meses.agosto': { pt: 'agosto', en: 'August', fr: 'août' },
'meses.setembro': { pt: 'setembro', en: 'September', fr: 'septembre' },
'meses.outubro': { pt: 'outubro', en: 'October', fr: 'octobre' },
'meses.novembro': { pt: 'novembro', en: 'November', fr: 'novembre' },
'meses.dezembro': { pt: 'dezembro', en: 'December', fr: 'décembre' },

'estacoes.primavera': { pt: 'primavera', en: 'spring', fr: 'printemps' },
'estacoes.verao': { pt: 'verão', en: 'summer', fr: 'été' },
'estacoes.outono': { pt: 'outono', en: 'autumn', fr: 'automne' },
'estacoes.inverno': { pt: 'inverno', en: 'winter', fr: 'hiver' },

'periodo.to': { pt: 'a', en: 'to', fr: 'à' },
'periodo.and': { pt: 'e', en: 'and', fr: 'et' },
// Adicione ao TRADUCOES
'destinos_admin.destino': { pt: 'Destino', en: 'Destination', fr: 'Destination' },
'destinos_admin.descricao_placeholder': { pt: 'Descrição do destino...', en: 'Destination description...', fr: 'Description de la destination...' },
'destinos_admin.avaliacao': { pt: 'Avaliação', en: 'Rating', fr: 'Évaluation' },
'destinos_admin.nenhum_encontrado': { pt: 'Nenhum destino cadastrado', en: 'No destinations registered', fr: 'Aucune destination enregistrée' },

'common.acoes': { pt: 'Ações', en: 'Actions', fr: 'Actions' },
'common.novo': { pt: 'Novo', en: 'New', fr: 'Nouveau' },

'common.erro_conexao': { pt: 'Erro ao conectar com o servidor', en: 'Connection error with the server', fr: 'Erreur de connexion avec le serveur' },
'common.erro_campos': { pt: 'Preencha todos os campos obrigatórios (*)', en: 'Please fill all required fields (*)', fr: 'Veuillez remplir tous les champs obligatoires (*)' },
'common.sucesso_atualizar': { pt: 'Destino atualizado com sucesso!', en: 'Destination updated successfully!', fr: 'Destination mise à jour avec succès!' },
'common.sucesso_criar': { pt: 'Destino criado com sucesso!', en: 'Destination created successfully!', fr: 'Destination créée avec succès!' },
'common.sucesso_excluir': { pt: 'Destino excluído com sucesso!', en: 'Destination deleted successfully!', fr: 'Destination supprimée avec succès!' },
'common.erro_atualizar': { pt: 'Erro ao atualizar destino', en: 'Error updating destination', fr: 'Erreur lors de la mise à jour' },
'common.erro_criar': { pt: 'Erro ao criar destino', en: 'Error creating destination', fr: 'Erreur lors de la création' },
'common.erro_excluir': { pt: 'Erro ao excluir destino', en: 'Error deleting destination', fr: 'Erreur lors de la suppression' },
'common.confirmar_excluir': { pt: 'Tem certeza que deseja excluir este destino?', en: 'Are you sure you want to delete this destination?', fr: 'Êtes-vous sûr de vouloir supprimer cette destination ?' },
// Adicione ao TRADUCOES

'usuarios_admin.nenhum_encontrado': { pt: 'Nenhum usuário cadastrado', en: 'No users registered', fr: 'Aucun utilisateur enregistré' },
'usuarios_admin.nao_excluir_proprio': { pt: 'Não é possível excluir o próprio administrador!', en: 'Cannot delete your own admin account!', fr: 'Impossible de supprimer votre propre compte administrateur!' },
'usuarios_admin.nao_alterar_proprio': { pt: 'Não pode alterar seu próprio tipo!', en: 'Cannot change your own type!', fr: 'Impossible de modifier votre propre type!' },
'usuarios_admin.tipo_atualizado': { pt: 'Tipo de usuário atualizado!', en: 'User type updated!', fr: 'Type d\'utilisateur mis à jour!' },
'usuarios_admin.confirmar_excluir': { pt: 'Tem certeza que deseja excluir este usuário?', en: 'Are you sure you want to delete this user?', fr: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?' },
'usuarios_admin.sucesso_excluir': { pt: 'Usuário excluído com sucesso!', en: 'User deleted successfully!', fr: 'Utilisateur supprimé avec succès!' },

'common.erro_atualizar_tipo': { pt: 'Erro ao atualizar tipo', en: 'Error updating type', fr: 'Erreur lors de la mise à jour du type' },
'common.erro_excluir_usuario': { pt: 'Erro ao excluir usuário', en: 'Error deleting user', fr: 'Erreur lors de la suppression de l\'utilisateur' },
// Adicione ao TRADUCOES
'modal.confirmar_exclusao.titulo': { pt: 'Confirmar Exclusão', en: 'Confirm Deletion', fr: 'Confirmer la Suppression' },
'modal.confirmar_exclusao.mensagem': { pt: 'Tem certeza que deseja excluir este usuário?', en: 'Are you sure you want to delete this user?', fr: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?' },
'modal.confirmar_exclusao.aviso': { pt: 'Esta ação não pode ser desfeita.', en: 'This action cannot be undone.', fr: 'Cette action ne peut pas être annulée.' },

'common.excluindo': { pt: 'Excluindo...', en: 'Deleting...', fr: 'Suppression...' },
// Adicione ao TRADUCOES
'gestao_viagens.carregadas': { pt: 'Carregadas', en: 'Loaded', fr: 'Chargées' },
'gestao_viagens.viagens': { pt: 'viagens', en: 'trips', fr: 'voyages' },
'gestao_viagens.buscar_placeholder': { pt: 'Cliente, destino ou título...', en: 'Client, destination or title...', fr: 'Client, destination ou titre...' },
'gestao_viagens.valor_pago': { pt: 'Valor Pago', en: 'Amount Paid', fr: 'Montant Payé' },
'gestao_viagens.saldo': { pt: 'Saldo', en: 'Balance', fr: 'Solde' },
'gestao_viagens.nenhuma_encontrada': { pt: 'Nenhuma viagem encontrada', en: 'No trips found', fr: 'Aucun voyage trouvé' },
'gestao_viagens.ajuste_filtros': { pt: 'Tente ajustar os filtros de busca', en: 'Try adjusting your search filters', fr: 'Essayez d\'ajuster vos filtres de recherche' },
'gestao_viagens.erro_valor_invalido': { pt: 'Valor de pagamento inválido', en: 'Invalid payment amount', fr: 'Montant de paiement invalide' },
'gestao_viagens.pagamento_sucesso': { pt: 'Pagamento registrado com sucesso!', en: 'Payment registered successfully!', fr: 'Paiement enregistré avec succès!' },
'gestao_viagens.confirmar_excluir': { pt: 'Tem certeza que deseja excluir esta viagem?', en: 'Are you sure you want to delete this trip?', fr: 'Êtes-vous sûr de vouloir supprimer ce voyage ?' },
'gestao_viagens.sucesso_excluir': { pt: 'Viagem excluída com sucesso!', en: 'Trip deleted successfully!', fr: 'Voyage supprimé avec succès!' },
// Adicione ao TRADUCOES
'relatorios.clientes': { pt: 'Clientes', en: 'Clients', fr: 'Clients' },
'relatorios.confirmadas': { pt: 'Confirmadas', en: 'Confirmed', fr: 'Confirmées' },
'relatorios.planejadas': { pt: 'Planejadas', en: 'Planned', fr: 'Planifiées' },
'gestao_viagens.data': { pt: 'Data', en: 'Date', fr: 'Date' },
'gestao_viagens.valor': { pt: 'Valor', en: 'Amount', fr: 'Montant' },
// Adicione ao TRADUCOES
'destinos.resultados_para': { pt: 'Resultados para', en: 'Results for', fr: 'Résultats pour' },
'destinos.resultados_encontrados': { pt: 'resultados encontrados', en: 'results found', fr: 'résultats trouvés' },
'destinos.limpar_filtro': { pt: 'Limpar filtro', en: 'Clear filter', fr: 'Effacer le filtre' },
'destinos.nenhum_resultado': { pt: 'Nenhum destino encontrado para esta busca.', en: 'No destinations found for this search.', fr: 'Aucune destination trouvée pour cette recherche.' },
// Adicione ao TRADUCOES
'dashboard.welcome_back': { pt: 'Bem-vindo de volta!', en: 'Welcome back!', fr: 'Bon retour!' },
'dashboard.stats_destinos': { pt: 'Destinos Ativos', en: 'Active Destinations', fr: 'Destinations Actives' },
'dashboard.stats_usuarios': { pt: 'Usuários', en: 'Users', fr: 'Utilisateurs' },
'dashboard.stats_viagens': { pt: 'Viagens', en: 'Trips', fr: 'Voyages' },
'dashboard.stats_faturamento': { pt: 'Faturamento (K)', en: 'Revenue (K)', fr: 'Chiffre (K)' },
'dashboard.gerenciar': { pt: 'Gerenciar', en: 'Manage', fr: 'Gérer' },
'dashboard.visualizar': { pt: 'Visualizar', en: 'View', fr: 'Voir' },
'dashboard.atividade_recente': { pt: 'Atividade Recente', en: 'Recent Activity', fr: 'Activité Récente' },
'dashboard.ver_todas': { pt: 'Ver todas', en: 'View all', fr: 'Voir tout' },
'dashboard.nova_viagem': { pt: 'Nova viagem', en: 'New trip', fr: 'Nouveau voyage' },
'dashboard.para': { pt: 'para', en: 'to', fr: 'vers' },
'dashboard.ha_2_horas': { pt: 'Há 2 horas', en: '2 hours ago', fr: 'Il y a 2 heures' },
'dashboard.novo_usuario': { pt: 'Novo usuário', en: 'New user', fr: 'Nouvel utilisateur' },
'dashboard.registrado': { pt: 'registrado', en: 'registered', fr: 'enregistré' },
'dashboard.ha_5_horas': { pt: 'Há 5 horas', en: '5 hours ago', fr: 'Il y a 5 heures' },
'dashboard.pagamento_recebido': { pt: 'Pagamento recebido', en: 'Payment received', fr: 'Paiement reçu' },
'dashboard.de': { pt: 'de', en: 'of', fr: 'de' },
'dashboard.ha_1_dia': { pt: 'Há 1 dia', en: '1 day ago', fr: 'Il y a 1 jour' }

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