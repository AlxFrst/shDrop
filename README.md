# shDrop

> Upload. Fetch. Done.

Un outil minimaliste pour transférer des fichiers via le terminal. Upload depuis ton navigateur, télécharge avec `wget` ou `curl`.

![shDrop Interface](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4+-38bdf8?style=flat-square&logo=tailwindcss)

## ✨ Fonctionnalités

- 📤 **Upload simple** : Glisse-dépose ou sélectionne un fichier depuis ton navigateur
- 🚀 **Téléchargement rapide** : Obtiens instantanément des commandes `wget` et `curl` prêtes à l'emploi
- 🎨 **Interface terminal** : Design minimaliste inspiré des terminaux avec animations fluides
- 🔒 **Pas de compte requis** : Aucune inscription, aucune publicité
- ⚡ **Performances optimales** : Fichiers jusqu'à 100MB supportés
- 🎭 **Animations élégantes** : Interface animée avec Framer Motion
- ⏰ **Expiration automatique** : TTL configurable pour les fichiers (par défaut 24h)
- 📱 **QR Code** : Génération de QR code pour partager facilement les liens
- 📊 **Statistiques** : Suivi des uploads, downloads et utilisation
- 🔧 **Support curl -T** : Upload de fichiers via PUT pour les power users

## 🛠️ Stack Technique

- **Framework** : Next.js 14+ (App Router)
- **Langage** : TypeScript
- **Styling** : TailwindCSS 4
- **Animations** : Framer Motion
- **Stockage** : Système de fichiers local
- **Backend** : API Routes Next.js

## 🚀 Installation

### Prérequis

- Node.js 18+
- npm, yarn, ou pnpm

### Installation rapide

```bash
# Cloner le repository
git clone https://github.com/votre-username/shdrop.git
cd shdrop

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

## ⚙️ Configuration

### Variables d'environnement

Copie le fichier `.env.example` vers `.env.local` :

```bash
cp .env.example .env.local
```

Variables disponibles :

```env
# URL de base (automatiquement détectée en développement)
NEXT_PUBLIC_BASE_URL=https://ton-domaine.com

# Durée de vie des fichiers en heures (défaut: 24h)
FILE_TTL_HOURS=24
```

## 📁 Structure du Projet

```
shdrop/
├── app/
│   ├── api/
│   │   ├── upload/          # Endpoint pour uploader les fichiers
│   │   └── files/[id]/      # Endpoint pour télécharger les fichiers
│   ├── about/               # Page "À propos"
│   ├── globals.css          # Styles globaux et thème terminal
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Page d'accueil
├── components/
│   ├── Terminal.tsx         # Wrapper du thème terminal
│   ├── UploadZone.tsx       # Zone de drag & drop
│   ├── ProgressBar.tsx      # Barre de progression ASCII
│   ├── ResultBlock.tsx      # Affichage des commandes wget/curl
│   └── Toast.tsx            # Notifications
├── public/
│   └── uploads/             # Stockage des fichiers uploadés
└── package.json
```

## 🎯 Utilisation

### Uploader un fichier

1. Ouvre l'application dans ton navigateur
2. Glisse un fichier dans la zone de drop ou clique pour sélectionner
3. Attends que l'upload se termine
4. Copie la commande `wget` ou `curl` générée

### Uploader via terminal (curl -T)

Pour les power users, vous pouvez uploader directement depuis le terminal :

```bash
# Upload via curl -T
curl -T fichier.txt https://ton-domaine.com/api/upload/fichier.txt

# Ou simplement
curl -T fichier.txt https://ton-domaine.com/api/upload
```

### Télécharger un fichier

Utilise une des commandes générées :

```bash
# Avec wget
wget "https://ton-domaine.com/api/files/abc123" -O fichier.txt

# Avec curl
curl -o fichier.txt "https://ton-domaine.com/api/files/abc123"
```

### Consulter les statistiques

Visite `/stats` pour voir les statistiques d'utilisation en temps réel :
- Uploads et downloads du jour
- Total des uploads et downloads
- Volume de données transférées
- Dernière activité

## 🔧 API

### POST `/api/upload`

Upload un fichier via formulaire.

**Body** : `multipart/form-data` avec un champ `file`

**Réponse** :
```json
{
  "success": true,
  "file_id": "uuid",
  "filename": "exemple.txt",
  "size": 1234,
  "download_url": "https://ton-domaine.com/api/files/uuid",
  "expires_at": 1234567890,
  "expires_in_hours": 24,
  "wget": "wget \"https://...\" -O \"exemple.txt\"",
  "curl": "curl -o \"exemple.txt\" \"https://...\"",
  "curl_upload": "curl -T \"exemple.txt\" \"https://...\""
}
```

### PUT `/api/upload` ou `/api/upload/[filename]`

Upload un fichier via PUT (curl -T).

**Body** : Corps binaire du fichier

**Réponse** : Identique à POST `/api/upload`

### GET `/api/files/[id]`

Télécharge un fichier par son ID.

**Réponse** : Le fichier avec `Content-Disposition: attachment`

**Headers de réponse** :
- `X-File-Downloads`: Nombre de téléchargements
- `X-File-Expires`: Date d'expiration ISO

**Codes d'erreur** :
- `404`: Fichier non trouvé
- `410`: Fichier expiré (automatiquement supprimé)

### GET `/api/stats`

Récupère les statistiques d'utilisation.

**Réponse** :
```json
{
  "success": true,
  "stats": {
    "totalUploads": 42,
    "totalDownloads": 128,
    "totalBytesUploaded": 1234567890,
    "totalBytesDownloaded": 9876543210,
    "uploadsToday": 5,
    "downloadsToday": 12
  }
}
```

## 🎨 Personnalisation

### Thème

Le thème terminal est défini dans `app/globals.css` :

```css
:root {
  --background: #0d0d0d;    /* Fond noir */
  --foreground: #00ff99;    /* Texte vert néon */
  --accent: #33ccff;        /* Accent bleu clair */
  --muted: #666666;         /* Texte atténué */
}
```

### Limite de taille de fichier

Modifie `MAX_FILE_SIZE` dans `app/api/upload/route.ts` :

```typescript
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
```

## 🚢 Déploiement

### Vercel (Recommandé)

```bash
npm run build
vercel deploy
```

### Docker (À venir)

Une configuration Docker sera ajoutée prochainement.

## 🧹 Maintenance

### Nettoyage automatique des fichiers

Les fichiers sont automatiquement nettoyés lors de chaque upload. Les fichiers expirés (TTL dépassé) sont supprimés automatiquement.

Le TTL par défaut est de **24 heures** et peut être configuré via la variable d'environnement `FILE_TTL_HOURS`.

### Nettoyage manuel

Pour nettoyer manuellement les fichiers expirés, le système vérifie automatiquement l'expiration à chaque téléchargement. Tu peux également créer un script cron si nécessaire.

### Statistiques

Les statistiques sont stockées dans `/public/uploads/.metadata/stats.json` et sont automatiquement mises à jour à chaque upload et download.

## 📝 TODO

- [x] Expiration automatique des fichiers (TTL configurable)
- [x] Support de l'upload via `curl -T`
- [x] QR Code pour les liens de téléchargement
- [x] Statistiques d'usage
- [ ] Configuration Docker
- [ ] Tests unitaires et E2E
- [ ] Support multi-fichiers (upload de plusieurs fichiers en une fois)
- [ ] Compression automatique des fichiers volumineux
- [ ] Notification par email/webhook lors d'un download

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésite pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT

## 🙏 Inspiré par

- [transfer.sh](https://transfer.sh) - Service de transfert de fichiers via terminal
- Design inspiré des terminaux Unix/Linux classiques

---

**Upload. Fetch. Done.**
