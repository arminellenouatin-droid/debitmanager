# GUIDE DE DÉPLOIEMENT - DebitManager

## ÉTAPES À SUIVRE

### 1. CONFIGURATION DU FICHIER `.env` (Local)

Ouvrez le fichier `.env` à la racine du projet et remplacez les valeurs suivantes:

#### OBTENIR LE JWT SECRET:
```bash
# Dans votre terminal, exécutez:
openssl rand -base64 32
```
Copiez le résultat et collez-le à la place de `votre_jwt_secret_ici` dans la ligne:
```
JWT_SECRET=votre_jwt_secret_ici
```

#### SUPABASE (Déjà configuré):
Les informations Supabase sont déjà pré-remplies avec vos données:
- DB_HOST: db.qgmigjuqnqxkkstjxmlp.supabase.co ✓
- DB_PASSWORD: 3r+j9XtJuSRxUbh ✓

#### REDIS (Optionnel):
Si vous n'utilisez pas Redis, laissez ces champs vides.
Pour utiliser Redis, vous pouvez créer un compte gratuit sur [Upstash](https://upstash.com/)

#### PAYMENT GATEWAYS (Optionnel):
Pour l'instant, laissez ces champs vides. Vous pourrez les configurer plus tard avec Stripe ou PayPal.

---

### 2. CONFIGURATION VERCEL

#### ÉTAPE 1: Ajouter les variables d'environnement dans Vercel
1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet DebitManager
3. Cliquez sur **Settings** > **Environment Variables**
4. Ajoutez les variables suivantes avec les mêmes valeurs que dans `.env`:

| Nom | Valeur (depuis .env) |
|-----|---------------------|
| DB_HOST | db.qgmigjuqnqxkkstjxmlp.supabase.co |
| DB_PORT | 5432 |
| DB_USERNAME | postgres |
| DB_PASSWORD | 3r+j9XtJuSRxUbh |
| DB_DATABASE | postgres |
| DB_SYNCHRONIZE | false |
| DB_LOGGING | true |
| JWT_SECRET | [votre_jwt_secret_généré] |
| JWT_EXPIRATION | 7d |
| NODE_ENV | production |
| PORT | 3000 |
| PLATFORM_COMMISSION_RATE | 1 |

#### ÉTAPE 2: Configurer le Root Directory
1. Dans Vercel Dashboard > Settings > General
2. **Root Directory**: Laissez vide ou mettez `.` (racine du projet)
3. **Build Command**: `cd backend && npm run build`
4. **Output Directory**: `backend/dist`

---

### 3. CONFIGURATION GITHUB

#### ÉTAPE 1: Initialiser Git (si pas déjà fait)
```bash
git init
git add .
git commit -m "Initial commit"
```

#### ÉTAPE 2: Créer le repository sur GitHub
1. Allez sur [GitHub](https://github.com/new)
2. Créez un nouveau repository nommé `DebitManager`
3. Ne cochez PAS "Initialize with README"
4. Copiez l'URL du repository (ex: https://github.com/votre-username/DebitManager.git)

#### ÉTAPE 3: Connecter le repository local
```bash
git remote add origin https://github.com/votre-username/DebitManager.git
git branch -M main
git push -u origin main
```

#### ÉTAPE 4: Connecter GitHub à Vercel
1. Dans Vercel Dashboard, cliquez sur **Add New Project**
2. Sélectionnez **Import Git Repository**
3. Sélectionnez votre repository `DebitManager`
4. Cliquez sur **Import**

---

### 4. TESTER LOCALEMENT AVANT DÉPLOIEMENT

#### Démarrer le backend avec Supabase:
```bash
cd backend
npm run start:dev
```

Si la connexion à Supabase fonctionne, vous verrez:
```
[Nest] xxxx - Application successfully started
```

---

### 5. DÉPLOIEMENT SUR VERCEL

Une fois GitHub connecté à Vercel:

1. **Pusher les changements sur GitHub:**
```bash
git add .
git commit -m "Configuration déploiement"
git push
```

2. **Vercel déploiera automatiquement** après chaque push

3. **Vérifier le déploiement:**
   - Allez sur Vercel Dashboard
   - Cliquez sur votre projet
   - Vérifiez l'onglet **Deployments**

---

### 6. VÉRIFICATION POST-DÉPLOIEMENT

Après le déploiement:

1. **Tester l'API:**
   - Vercel vous donnera une URL comme: `https://debitmanager.vercel.app`
   - Testez: `https://debitmanager.vercel.app/health`

2. **Vérifier les logs:**
   - Dans Vercel Dashboard > Deployments > View Logs

---

## RÉSUMÉ DES FICHIERS CRÉÉS

- ✅ `.env` - Variables d'environnement locales
- ✅ `vercel.json` - Configuration Vercel
- ✅ `.gitignore` - Fichiers à ignorer dans Git
- ✅ `DEPLOIEMENT.md` - Ce guide

## PROCHAINES ÉTAPES

1. Générez votre JWT_SECRET avec `openssl rand -base64 32`
2. Mettez à jour le fichier `.env` avec votre JWT_SECRET
3. Ajoutez les variables d'environnement dans Vercel Dashboard
4. Initialisez Git et pushz sur GitHub
5. Vercel déploiera automatiquement
