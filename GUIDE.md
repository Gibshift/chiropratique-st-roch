# Guide développeur — Chiropratique St-Roch

> Tu arrives sur ce projet pour la première fois ? Ce guide te permet de t'orienter sans avoir besoin de fouiller partout. Lis les sections qui te concernent.

---

## Table des matières

1. [Démarrer le projet en local](#1-démarrer-le-projet-en-local)
2. [Architecture en un coup d'œil](#2-architecture-en-un-coup-dœil)
3. [Routes et leurs composants](#3-routes-et-leurs-composants)
4. [Comment modifier une page](#4-comment-modifier-une-page)
5. [Le CMS Payload — collections et globals](#5-le-cms-payload--collections-et-globals)
6. [Données globales (Header, Footer, SiteSettings)](#6-données-globales-header-footer-sitesettings)
7. [Images et médias](#7-images-et-médias)
8. [CSS et styles](#8-css-et-styles)
9. [Utilitaires importants](#9-utilitaires-importants)
10. [Duplications connues — attention si tu modifies](#10-duplications-connues--attention-si-tu-modifies)
11. [Conventions du projet](#11-conventions-du-projet)
12. [Glossaire pour débutants](#12-glossaire-pour-débutants)

---

## 1. Démarrer le projet en local

### Pré-requis
- Node.js 18+ installé
- `pnpm` installé (`npm install -g pnpm`)

### Étapes

**1. Cloner et installer les dépendances**
```bash
git clone <url-du-repo>
cd chiropratique-st-roch
pnpm install
```

**2. Créer le fichier `.env`**  
Copie `.env.example` en `.env` et remplis les variables :

```env
# Base de données PostgreSQL (Neon)
DATABASE_URL=postgresql://...

# Payload CMS — clé secrète (génère n'importe quelle longue chaîne aléatoire)
PAYLOAD_SECRET=une-longue-chaine-aleatoire

# Stockage médias (Cloudflare R2)
R2_BUCKET=...
R2_ENDPOINT=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...

# URL du site en développement
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Optionnel — génération SEO automatique via Claude AI
ANTHROPIC_API_KEY=...
```

> **Pourquoi tant de variables ?** Ce projet connecte plusieurs services externes : la base de données est hébergée sur Neon (PostgreSQL cloud), les images sur Cloudflare R2, et le SEO est généré par l'API Claude.

**3. Lancer le serveur de développement**
```bash
pnpm dev
```

Le site est maintenant disponible à `http://localhost:3000`.  
L'admin Payload est à `http://localhost:3000/admin`.

> **Première fois ?** Au premier démarrage, Payload crée automatiquement toutes les tables en base de données. Tu verras des messages de migration dans le terminal — c'est normal.

**4. Créer un compte admin**  
Va sur `http://localhost:3000/admin` et crée ton compte. La première fois, n'importe qui peut créer un compte (ensuite, seul un admin peut en créer d'autres).

---

## 2. Architecture en un coup d'œil

```
src/
├── app/
│   ├── (frontend)/        ← Pages publiques du site (ce que les visiteurs voient)
│   └── (payload)/         ← Interface admin + API (ce que les éditeurs voient)
├── collections/           ← Schémas des données (Services, Posts, Professionals...)
├── globals/               ← Données de site globales (SiteSettings)
├── Header/                ← Header du site (navigation, barre d'infos)
├── Footer/                ← Footer du site
├── components/            ← Tous les composants visuels React
│   ├── home/              ← Page d'accueil
│   ├── services/          ← Pages services
│   ├── conditions/        ← Pages conditions traitées
│   ├── professionals/     ← Pages professionnels
│   ├── blogue/            ← Pages blogue
│   ├── contact/           ← Page contact
│   └── ui/                ← Petits composants réutilisables
├── utilities/             ← Fonctions utilitaires (slugify, Jane URLs, etc.)
├── plugins/               ← Configuration des plugins Payload
└── blocks/                ← Blocs de contenu CMS (Archive, CTA, Media...)
```

### Comment les données circulent

```
Visiteur accède à /services
    ↓
app/(frontend)/services/page.tsx    ← fichier route Next.js (très mince)
    ↓
components/services/ServicesPage.tsx ← composant serveur qui lit la BDD
    ↓
Affiche la page avec les données
```

> **Pourquoi cette séparation ?** Le fichier `page.tsx` est volontairement vide pour ne faire que deux choses : configurer les métadonnées SEO et appeler le composant. Toute la logique est dans `components/`.

---

## 3. Routes et leurs composants

| URL | Composant principal |
|---|---|
| `/` | `components/home/ClinicHomePage.tsx` |
| `/services` | `components/services/ServicesPage.tsx` |
| `/services/:slug` | `components/services/ServiceDetailPage.tsx` |
| `/conditions-traitees` | `components/conditions/ConditionsPage.tsx` |
| `/conditions-traitees/:slug` | `components/conditions/ConditionCategoryPage.tsx` |
| `/professionnels` | `components/professionals/ProfessionalsPage.tsx` |
| `/professionnels/:slug` | `components/professionals/ProfessionalDetailPage.tsx` |
| `/blogue` | `components/blogue/BloguePage.tsx` |
| `/blogue/:slug` | Rendu automatique du richtext Lexical |
| `/contact` | `components/contact/ContactPage.tsx` |
| `/:slug` | Pages génériques via blocs Payload (ex. `/a-propos`) |

---

## 4. Comment modifier une page

### Modifier du texte ou une image sur une page statique (ex. : contact, accueil)

→ Édite directement le fichier dans `src/components/{section}/`.  
Exemple : pour changer le texte de la page contact → `src/components/contact/ContactPage.tsx`.

### Modifier le contenu d'un service, d'un professionnel, d'un article

→ Utilise l'**admin Payload** (`/admin`). Pas besoin de toucher au code.  
Les pages se mettent à jour automatiquement après la sauvegarde.

> **Règle générale** : contenu (texte, images, données) → admin Payload. Mise en page et design → code.

### Modifier le titre affiché dans l'onglet du navigateur

→ `src/app/(frontend)/layout.tsx`, dans l'export `metadata` :
```ts
title: {
  default: 'Chiropratique St-Roch | Clinique à Québec',
  template: '%s | Chiropratique St-Roch',
},
```

### Ajouter une nouvelle page via le CMS

1. Dans l'admin Payload → **Pages** → Créer un nouveau document
2. Donner un slug (ex. `a-propos`)
3. Ajouter un hero et des blocs de contenu
4. La page sera automatiquement disponible à `/{slug}` — aucun code à écrire

### Ajouter une nouvelle page custom (avec du code React)

1. Créer un dossier dans `app/(frontend)/ma-page/`
2. Créer `page.tsx` dans ce dossier (copie un `page.tsx` existant comme modèle)
3. Créer le composant dans `src/components/ma-section/MaPage.tsx`
4. Ajouter le lien dans le header/footer via l'admin Payload

### Modifier les métadonnées SEO d'une page

Chaque `[slug]/page.tsx` a une fonction `generateMetadata`. C'est là que se construisent le titre, la description, et les images Open Graph (réseaux sociaux).

> **Note** : certaines pages utilisent `title: { absolute: '...' }` pour éviter que le template du layout (`| Chiropratique St-Roch`) s'ajoute en double.

---

## 5. Le CMS Payload — collections et globals

Payload CMS est l'interface d'administration du site. Il gère le contenu et la base de données.

### Collections (éléments de contenu)

| Collection | Ce que c'est | Champs importants |
|---|---|---|
| **Services** | Les 5 disciplines de la clinique | `title`, `slug`, `shortDescription`, `isFeatured` (visible accueil), `order` (ordre d'affichage) |
| **Conditions** | Les conditions traitées (ex. mal de dos) | `title`, `categorie` (région du corps), `isFeatured`, `order` |
| **Catégories de conditions** | Regroupements de conditions (ex. "Colonne vertébrale") | `title`, `slug`, `conditionsList`, `relatedServices` |
| **Professionnels** | Membres de l'équipe | `name`, `title`, `shortBio`, `photo`, `isActive` (masquer sans supprimer) |
| **Articles (Posts)** | Articles de blogue | `title`, `content`, `heroImage`, `publishedAt`, `categories` |
| **Pages** | Pages génériques avec blocs | `title`, `slug`, `hero`, `layout` |
| **Médias** | Images et fichiers uploadés | `alt`, stockés sur Cloudflare R2 |

### Globals (données qui s'appliquent à tout le site)

| Global | Ce qu'il contrôle |
|---|---|
| **Header** | Liens de navigation du menu |
| **Footer** | Liens de navigation du pied de page |
| **Réglages du site** (SiteSettings) | Téléphone, adresse, heures d'ouverture, URL de prise de rendez-vous, réseaux sociaux |

> **Important** : pour changer le numéro de téléphone, l'adresse, les heures ou l'URL de rendez-vous → admin Payload → **Réglages du site**. Pas besoin de code.

---

## 6. Données globales (Header, Footer, SiteSettings)

**SiteSettings est la source de vérité** pour toutes les infos de la clinique. Il est lu par :
- Le header (téléphone, adresse, heures)
- Le footer (coordonnées, réseaux sociaux)
- La page contact
- Les données Schema.org (SEO local)

**Pour les liens de prise de rendez-vous Jane App** → le fallback est dans `src/utilities/jane.ts` :
```ts
export const JANE_BASE_URL = 'https://chiropratiquestroch.janeapp.com'
export const JANE_SERVICE_URLS = { ... }   // liens directs par discipline
```
C'est le **seul endroit** à modifier si l'URL Jane change et que SiteSettings ne suffit pas.

**Cache** : Header et Footer utilisent un cache qui se revalide automatiquement après chaque modification dans l'admin. SiteSettings est lu sans cache.

---

## 7. Images et médias

Il y a deux types d'images dans le projet — ne pas les mélanger.

### Type 1 : Images uploadées via l'admin (médias Payload)

Stockées sur Cloudflare R2. Automatiquement converties en WebP et redimensionnées en 7 formats.

```tsx
// Récupérées depuis la BDD, servies directement via leur URL
<img src={professional.photo?.url} alt={professional.name} />

// Pour les vignettes, utiliser une taille appropriée
<img
  src={professional.photo?.sizes?.medium?.url ?? professional.photo?.url}
  alt={professional.name}
/>
```

Les 7 tailles disponibles : `thumbnail` (300px), `square` (500×500), `small` (600px), `medium` (900px), `large` (1400px), `xlarge` (1920px), `og` (1200×630 pour les réseaux sociaux).

> Ces images ne passent **pas** par l'optimisation Next.js `<Image>` — elles sont déjà optimisées par Payload.

### Type 2 : Assets statiques du site (`public/assets/`)

Illustrations PNG, silhouettes, icônes. Référencés avec un chemin absolu.

```tsx
// Toujours via next/image pour les assets statiques → WebP automatique + lazy loading
import Image from 'next/image'
<Image src="/assets/salle-chiro.png" alt="Salle de la clinique" width={800} height={600} />

// Image hero visible immédiatement → ajouter priority pour éviter le LCP lent
<Image src="/assets/hero.png" alt="..." fill sizes="100vw" priority />
```

---

## 8. CSS et styles

Le projet utilise **Tailwind CSS v4** — les styles sont des classes directement dans le JSX.

### Polices

| Variable | Police | Utilisée pour |
|---|---|---|
| `var(--font-dm-sans)` | DM Sans | Corps de texte, paragraphes |
| `var(--font-barlow-condensed)` | Barlow Condensed | Titres, labels, navigation, boutons |
| `var(--font-geist-mono)` | Geist Mono | Code (hérité du template) |

Les polices sont auto-hébergées (via `next/font/google` dans `layout.tsx`) — aucune requête externe vers Google Fonts.

### Palette de couleurs

| Rôle | Classe Tailwind | Contexte |
|---|---|---|
| Rouge de la clinique | `text-red-700` | Sur fond blanc ou crème |
| Rouge sur fond sombre | `text-red-500` | Footer, sections sombres |
| Fond sombre | `bg-zinc-950` | Footer, drawer mobile |
| Fond crème | `bg-[#f6f1e8]` | Certaines sections de l'accueil |
| Texte principal | `text-zinc-950` | Corps de texte |
| Texte secondaire | `text-zinc-600` | Dates, métadonnées |

> **Règle WCAG AA** : sur fond crème `#f6f1e8`, utiliser `red-700` (pas `red-600`). Sur fond sombre (`zinc-950`), utiliser `red-500` ou `zinc-300`.

### Animations au scroll

Le composant `<ScrollReveal>` (dans `ui/ScrollReveal.tsx`) utilise `IntersectionObserver` pour déclencher des animations d'apparition quand les éléments entrent dans le viewport. Il fait passer les éléments de la classe `sr-hidden` à `sr-visible`. Les styles sont dans `globals.css`.

---

## 9. Utilitaires importants

| Fichier | Ce qu'il fait |
|---|---|
| `utilities/jane.ts` | URL de base Jane App et liens directs par service — **modifier ici si l'URL change** |
| `utilities/seo.ts` | `getOpenGraphImages()` — images OG pour les métadonnées des pages |
| `utilities/getGlobals.ts` | `getCachedGlobal('header' \| 'footer')` — lecture avec cache |
| `utilities/getURL.ts` | `getServerSideURL()` — URL du site selon l'environnement |
| `utilities/typography.ts` | `noOrphanColon(text)` — espace insécable avant `:` en français |
| `utilities/ui.ts` | `cn(...classes)` — fusion de classes Tailwind sans conflits |
| `utilities/slugify.ts` | `slugify(text)` — génère un slug URL-safe à partir du français |

---

## 10. Duplications connues — attention si tu modifies

Ces éléments existent en plusieurs endroits dans le code. Si tu modifies l'un, vérifie les autres.

### Pattern d'extraction de photo de professionnel

Ce bloc est copié dans 3 composants :
```ts
const photoUrl =
  professional.photo &&
  typeof professional.photo === 'object' &&
  'url' in professional.photo
    ? professional.photo.url
    : null
```
Présent dans : `ClinicHomePage.tsx`, `ProfessionalsPage.tsx`, `ServiceDetailPage.tsx`.

### Section hero des pages (Services et Professionnels)

`ServicesPage.tsx` et `ProfessionalsPage.tsx` implémentent chacun leur propre hero inline au lieu d'utiliser `<PageHero>`. C'est intentionnel — les designs sont trop différents pour être mutualisés (fond crème vs fond blanc, dimensions différentes).

### Logique de rotation d'articles par date

La logique `dayIndex = Math.floor(Date.now() / 86400000)` (changer l'article affiché chaque jour) est dupliquée dans `ClinicHomePage.tsx` et `BloguePage.tsx`.

---

## 11. Conventions du projet

### Structure des fichiers
- **`page.tsx` est toujours mince** : il exporte `generateMetadata` et une fonction `Page` qui appelle le composant — rien d'autre.
- **Composants clients** (avec état React, événements) : suffixés `.client.tsx`
- **Composants serveurs** (lecture BDD directe) : pas de suffixe

### Nommage
- Dossiers de routes : `kebab-case` (`conditions-traitees/`, `[slug]/`)
- Fichiers de composants : `PascalCase` (`ServicesPage.tsx`)
- Fichiers utilitaires : `camelCase` (`getGlobals.ts`)
- Code source : anglais. Labels admin Payload : français.

### Slugs
Générés automatiquement par `utilities/slugify.ts` via un hook Payload `beforeValidate`. Les accents sont normalisés (`é` → `e`, `ô` → `o`). Ne jamais saisir un slug avec des majuscules ou des espaces.

### Métadonnées SEO
- `siteName` : toujours `'Chiropratique St-Roch'`
- `locale` : toujours `'fr_CA'`
- Pour éviter que le template de titre s'ajoute en double : utiliser `title: { absolute: '...' }`
- Toutes les images OG passent par `getDefaultOpenGraphImages()` ou `getOpenGraphImages()`

### Génération SEO automatique (Claude AI)

À chaque sauvegarde dans l'admin, le plugin `src/plugins/index.ts` appelle l'API Anthropic (modèle Haiku) pour générer un titre SEO et une méta-description. Fonctionne pour : posts, services, condition-categories, professionals. Nécessite `ANTHROPIC_API_KEY` dans `.env`. Si la clé est absente, le champ SEO reste vide — aucune erreur.

### Revalidation du cache Next.js

| Quoi | Comment ça se revalide |
|---|---|
| Header et Footer | Automatiquement via leur hook `afterChange` Payload |
| Pages et Posts | Hooks `revalidatePage` / `revalidatePost` dans leurs collections |
| Page d'accueil et blogue | `export const revalidate = 3600` (re-rendu toutes les heures) |

### Payload et TypeScript

Quelques `as any` dans le code sont intentionnels :
- `collection: 'condition-categories' as any` dans les `payload.find()` — ce slug custom n'est pas dans les types générés par défaut
- `doc as { id: ...; title: string }` dans `beforeSync.ts` — le `select` partiel rend le type incomplet

---

## 12. Glossaire pour débutants

**Payload CMS**  
Le système qui gère le contenu du site (articles, services, professionnels). C'est ce qu'on appelle un « headless CMS » : il stocke les données dans une base de données PostgreSQL et les expose via une API, mais n'impose pas de design.

**Next.js App Router**  
Le framework React qui fait tourner le site. L'App Router (depuis Next.js 13) organise les pages dans des dossiers avec des fichiers `page.tsx`. Les parenthèses `(frontend)` et `(payload)` dans les noms de dossiers sont des « route groups » — elles organisent le code sans affecter les URLs.

**Composant serveur vs composant client**  
- **Serveur** : s'exécute uniquement côté serveur, peut lire la base de données directement, pas d'interactivité. Fichiers sans `'use client'`.  
- **Client** : s'exécute dans le navigateur, peut utiliser `useState`, `useEffect`, événements. Fichiers avec `'use client'` en première ligne.

**Drizzle ORM**  
La bibliothèque que Payload utilise en interne pour parler à PostgreSQL. Tu n'interagis pas directement avec Drizzle — Payload s'en charge. Le `push: true` dans `payload.config.ts` fait que Payload synchronise automatiquement le schéma de la base de données au démarrage.

**Lexical**  
L'éditeur de texte riche utilisé par Payload pour le contenu des articles. Il stocke le contenu en JSON (pas en HTML). Le composant `RichText` dans `blocks/` le convertit en HTML pour l'affichage.

**Cloudflare R2**  
Le service de stockage d'images (similaire à Amazon S3). Quand tu uploades une image dans Payload, elle est envoyée sur R2 — pas stockée sur le serveur Next.js.

**ISR (Incremental Static Regeneration)**  
La technique Next.js qui permet de pré-générer les pages statiquement mais de les rafraîchir périodiquement (via `revalidate`) ou à la demande (via `revalidatePath`). La page d'accueil se rafraîchit toutes les heures.

**OG (Open Graph)**  
Les balises HTML qui contrôlent comment une page apparaît quand on la partage sur Facebook, LinkedIn, iMessage, etc. — titre, description, image de prévisualisation.

**Slug**  
La partie d'une URL qui identifie une page spécifique. Pour `/services/chiropratique`, le slug est `chiropratique`. Toujours en minuscules, sans accents, sans espaces.

**Schema.org / JSON-LD**  
Données structurées lisibles par Google pour améliorer l'apparence dans les résultats de recherche (heures d'ouverture, adresse, coordonnées). Géré par `components/seo/LocalBusinessJsonLd.tsx`.
