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

En développement, l'URL de base est automatiquement détectée. En production, définis :

```env
NEXT_PUBLIC_BASE_URL=https://ton-domaine.com
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

### Télécharger un fichier

Utilise une des commandes générées :

```bash
# Avec wget
wget "https://ton-domaine.com/api/files/abc123" -O fichier.txt

# Avec curl
curl -o fichier.txt "https://ton-domaine.com/api/files/abc123"
```

## 🔧 API

### POST `/api/upload`

Upload un fichier.

**Body** : `multipart/form-data` avec un champ `file`

**Réponse** :
```json
{
  "success": true,
  "file_id": "uuid",
  "filename": "exemple.txt",
  "size": 1234,
  "download_url": "https://ton-domaine.com/api/files/uuid",
  "wget": "wget \"https://...\" -O \"exemple.txt\"",
  "curl": "curl -o \"exemple.txt\" \"https://...\""
}
```

### GET `/api/files/[id]`

Télécharge un fichier par son ID.

**Réponse** : Le fichier avec `Content-Disposition: attachment`

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

### Nettoyage des fichiers

Pour supprimer les fichiers anciens, tu peux créer un script cron ou utiliser :

```bash
# Supprimer les fichiers de plus de 24h
find public/uploads -type f -mtime +1 -delete
```

## 📝 TODO

- [ ] Expiration automatique des fichiers (TTL configurable)
- [ ] Support de l'upload via `curl -T`
- [ ] QR Code pour les liens de téléchargement
- [ ] Statistiques d'usage
- [ ] Configuration Docker
- [ ] Tests unitaires et E2E

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésite pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT

## 🙏 Inspiré par

- [transfer.sh](https://transfer.sh) - Service de transfert de fichiers via terminal
- Design inspiré des terminaux Unix/Linux classiques

---

**Upload. Fetch. Done.**
