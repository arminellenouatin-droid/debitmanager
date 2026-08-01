# DebitManager (Bar Maquis Master)

Plateforme SaaS mobile & web de gestion de bars, maquis, restaurants, boîtes de nuit et lounges en Afrique de l'Ouest.

## Deployment Status
Deployed on Vercel

## Architecture Technique

- **Mobile**: Flutter (iOS/Android, offline-first)
- **Web Dashboard**: React + TypeScript
- **Backend API**: Node.js (NestJS)
- **Base de données**: PostgreSQL + Redis
- **Stockage**: S3-compatible
- **Notifications**: FCM/APNs + fallback SMS
- **Paiements**: Kkiapay, Moneroo, Cinetpay

## Structure du Projet

```
DebitManager/
├── backend/          # API NestJS
├── web-dashboard/     # React + TypeScript
├── mobile-app/        # Flutter
├── database/          # Migrations et schéma
└── docs/             # Documentation
```

## Installation

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurez les variables d'environnement
npm run start:dev
```

### Web Dashboard
```bash
cd web-dashboard
npm install
npm run dev
```

### Mobile App
```bash
cd mobile-app
flutter pub get
flutter run
```

## Progression du Projet

### Phase 0 - Cadrage technique ✓
- Structure du projet initialisée
- Entités de base de données créées
- Design system implémenté

### Phase 1 (MVP) - Sprint 1 ✓
#### Backend API
- **Auth Module** ✓
  - Inscription avec validation OTP
  - Login JWT
  - Refresh tokens
  - Logout
- **Companies Module** ✓
  - Création de boutique
  - Gestion des codes de parrainage
  - Génération de code unique
- **Subscriptions Module** ✓
  - Création d'abonnement
  - Changement de plan
  - Période d'essai
  - Calcul de prorata
- **Payments Module** ✓
  - Création de paiement
  - Webhooks (Kkiapay, Moneroo, Cinetpay)
  - Réconciliation
  - Commission plateforme (1%)

#### Frontend Web
- **Pages d'authentification** ✓
  - Login avec redirection selon statut
  - Inscription avec validation OTP
  - Création de boutique
  - Sélection de plan d'abonnement
- **Navigation** ✓
  - Routes configurées
  - Layout avec sidebar

### Phase 1 (MVP) - Sprint 2 ✓
#### Backend API
- **Products Module** ✓
  - CRUD produits
  - Gestion catégories, types, unités
  - Suivi des stocks et alertes
  - Historique des prix
- **Orders Module** ✓
  - Création de commandes
  - Ajout d'articles
  - Annulation de commandes
  - Mise à jour des stocks

#### Frontend Web
- **Products Page** ✓
  - Liste des produits avec stock
  - Création de produits
  - Alertes de stock bas
- **Orders Page** ✓
  - Liste des commandes
  - Création de commandes
  - Sélection de produits

#### Mobile App
- **Products Feature** ✓
  - Repository et modèles
  - BLoC pour gestion d'état
  - Page produits avec cartes
- **Orders Feature** ✓
  - Repository et modèles
  - BLoC pour gestion d'état
  - Page commandes avec statuts
- **Dashboard** ✓
  - Navigation avec bottom bar
  - Résumé des KPIs

### Phase 2 - Opérations avancées ✓
#### Backend API
- **Tables Module** ✓
  - CRUD tables
  - Gestion des statuts (AVAILABLE, OCCUPIED, RESERVED)
  - Capacité et emplacement
- **Employees Module** ✓
  - CRUD employés
  - Rôles (SERVER, BARTENDER, COOK, etc.)
  - Statuts actifs/inactifs
- **Attendance Module** ✓
  - Badgeage CHECK_IN/CHECK_OUT
  - Géolocalisation
  - Rapports journaliers

#### Frontend Web
- **Tables Page** ✓
  - Liste des tables avec statuts
  - Création de tables
  - Changement de statut
- **Employees Page** ✓
  - Liste du personnel
  - Création d'employés
  - Gestion des rôles

### Phase 3 - Gestion & Finance ✓
#### Backend API
- **Payroll Module** ✓
  - Calcul de paie (heures, heures supp, primes, déductions)
  - Approbation et paiement
  - Résumés mensuels
- **Treasury Module** ✓
  - Transactions (entrées, sorties, transferts)
  - Solde en temps réel
  - Résumés journaliers et mensuels

#### Frontend Web
- **Payroll Page** ✓
  - Liste des fiches de paie
  - Approbation et paiement
  - Résumé des paiements
- **Treasury Page** ✓
  - Liste des transactions
  - Solde et statistiques
  - Création de transactions

### Phase 4 - Pilotage & croissance ✓
#### Backend API
- **Reports Module** ✓
  - KPIs journaliers, hebdomadaires, mensuels
  - Performance produits
  - Performance employés
- **Affiliates Module** ✓
  - Programme de parrainage
  - Génération de codes de parrainage
  - Commissions (10%)
  - Retrait de commissions
- **Admin Module** ✓
  - Dashboard Super-Admin
  - Gestion des entreprises
  - Statistiques globales
  - Suspension/activation

#### Frontend Web
- **Reports Page** ✓
  - KPIs journaliers et hebdomadaires
  - Statuts des commandes
  - Revenus et flux de trésorerie

### Phase 5 - Finitions ✓
#### Backend API
- **QR Code Module** ✓
  - Génération QR pour commandes
  - Génération QR pour tables
  - Génération QR pour entreprises

#### Frontend Web
- **QR Code Page** ✓
  - Génération de QR codes
  - Téléchargement
  - Support tables, commandes, entreprises

## Documentation

- Voir le dossier `instructions/` pour les spécifications complètes
- PRD, Cahier des charges, API endpoints, Modèle de données, etc.
