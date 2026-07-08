# Guide développeur — Chiropratique St-Roch

> Référence rapide pour naviguer le code, faire des changements de pages, et comprendre les conventions du projet.

---

## Table des matières

1. [Architecture en un coup d'œil](#1-architecture-en-un-coup-doeil)
2. [Routes et leurs composants](#2-routes-et-leurs-composants)
3. [Comment modifier une page](#3-comment-modifier-une-page)
4. [Le CMS Payload — collections et globals](#4-le-cms-payload--collections-et-globals)
5. [Données globales (Header, Footer, SiteSettings)](#5-données-globales-header-footer-sitesettings)
6. [Images et médias](#6-images-et-médias)
7. [CSS et styles](#7-css-et-styles)
8. [Utilitaires importants](#8-utilitaires-importants)
9. [Duplications connues — attention si tu modifies](#9-duplications-connues--attention-si-tu-modifies)
10. [Conventions du projet](#10-conventions-du-projet)

---

## 1. Architecture en un coup d'œil

```
src/
├── app/
│   ├── (frontend)/        ← Toutes les pages publiques du site
│   └── (payload)/         ← Interface admin Payload + API REST/GraphQL
├── collections/           ← Définitions des collections Payload (schémas BDD)
├── globals/               ← Global SiteSettings (infos clinique, heures, etc.)
├── Header/                ← Composants du header (serveur + client)
├── Footer/                ← Composant du footer
├── components/            ← Tous les composants React
│   ├── home/              ← Page d'accueil
│   ├── services/          ← Pages services
│   ├── conditions/        ← Pages conditions traitées
│   ├── professionals/     ← Pages professionnels
│   ├── blogue/            ← Pages blogue
│   ├── contact/           ← Page contact
│   ├── privacy/           ← Page politique de confidentialité
│   └── ui/                ← Composants UI réutilisables (ScrollReveal, PageHero, etc.)
├── utilities/             ← Fonctions utilitaires pures
├── plugins/               ← Config plugins Payload (incl. génération SEO via Claude AI)
└── blocks/                ← Blocs de contenu Payload (rendu + config)
```

**Flux de données** : `page.tsx` (route mince) → `ComponentPage.tsx` (composant serveur qui fait le fetch) → UI.

---

## 2. Routes et leurs composants

| URL | Fichier route | Composant principal |
|---|---|---|
| `/` | `app/(frontend)/page.tsx` | `components/home/ClinicHomePage.tsx` |
| `/:slug` (pages CMS) | `app/(frontend)/[slug]/page.tsx` | Blocs Payload dynamiques |
| `/services` | `app/(frontend)/services/page.tsx` | `components/services/ServicesPage.tsx` |
| `/services/:slug` | `app/(frontend)/services/[slug]/page.tsx` | `components/services/ServiceDetailPage.tsx` |
| `/conditions-traitees` | `app/(frontend)/conditions-traitees/page.tsx` | `components/conditions/ConditionsPage.tsx` |
| `/conditions-traitees/:slug` | `app/(frontend)/conditions-traitees/[slug]/page.tsx` | `components/conditions/ConditionCategoryPage.tsx` |
| `/professionnels` | `app/(frontend)/professionnels/page.tsx` | `components/professionals/ProfessionalsPage.tsx` |
| `/professionnels/:slug` | `app/(frontend)/professionnels/[slug]/page.tsx` | `components/professionals/ProfessionalDetailPage.tsx` |
| `/blogue` | `app/(frontend)/blogue/page.tsx` | `components/blogue/BloguePage.tsx` |
| `/blogue/:slug` | `app/(frontend)/blogue/[slug]/page.tsx` | Rendu Lexical richtext + blocs |
| `/blogue/categorie/:slug` | `app/(frontend)/blogue/categorie/[slug]/page.tsx` | Blog filtré par catégorie |
| `/contact` | `app/(frontend)/contact/page.tsx` | `components/contact/ContactPage.tsx` |
| `/politique-de-confidentialite` | `app/(frontend)/politique-de-confidentialite/page.tsx` | `components/privacy/PolitiqueConfidentialitePage.tsx` |

---

## 3. Comment modifier une page

### 3a. Modifier le contenu d'une page statique (ex. : page contact)
→ Éditer directement le composant dans `src/components/{section}/`.  
Le fichier `page.tsx` dans `app/` est volontairement vide — il appelle juste le composant.

### 3b. Modifier une page dont le contenu vient du CMS
1. Aller dans l'admin Payload (`/admin`)
2. Trouver la collection concernée (Services, Professionnels, Articles, etc.)
3. Modifier le document

Pour changer la **structure** de la page (mise en page, sections) → éditer le composant dans `src/components/`.  
Pour changer le **contenu** (texte, images) → utiliser l'admin Payload.

### 3c. Modifier les métadonnées SEO d'une page dynamique
Chaque fichier `[slug]/page.tsx` exporte une fonction `generateMetadata`. C'est là que se construisent `title`, `description`, `openGraph`, etc.

**Pour les pages de professionnels** : `src/app/(frontend)/professionnels/[slug]/page.tsx`  
**Pour les catégories de conditions** : `src/app/(frontend)/conditions-traitees/[slug]/page.tsx`

> **Note** : Les titres de catégories de conditions utilisent `{ absolute: titleStr }` pour éviter que le template du layout (`| Chiropratique St-Roch`) s'ajoute en double.

### 3d. Modifier le titre global affiché dans l'onglet
→ `src/app/(frontend)/layout.tsx`, dans l'export `metadata` :
```ts
title: {
  default: 'Chiropratique St-Roch | Clinique à Québec',
  template: '%s | Chiropratique St-Roch',
},
```

### 3e. Ajouter une nouvelle page CMS simple
1. Créer un document dans la collection **Pages** de l'admin Payload avec le bon slug
2. Ajouter hero + blocs de contenu dans l'éditeur
3. La route `app/(frontend)/[slug]/page.tsx` la rendra automatiquement

### 3f. Ajouter une nouvelle page custom (hors CMS)
1. Créer le dossier et `page.tsx` dans `app/(frontend)/`
2. Créer le composant dans `src/components/`
3. Ajouter le lien dans le footer (admin → Footer → navItems) et/ou le header

---

## 4. Le CMS Payload — collections et globals

### Collections (contenu éditable)

| Collection | Slug admin | Champs clés | Notes |
|---|---|---|---|
| Services | `services` | title, slug, shortDescription, description, featuredImage, isFeatured, order | `isFeatured` = visible sur l'accueil. `order` = tri. |
| Conditions | `conditions` | title, slug, shortDescription, categorie, isFeatured, order | `categorie` est un select fixe (5 régions corporelles) |
| Catégories de conditions | `condition-categories` | title, slug, conditionsList, relatedServices, heroImage | Pages `/conditions-traitees/:slug`. Aussi utilisé comme catégorie de blogue. |
| Professionnels | `professionals` | name, slug, title, shortBio, bio, photo, isActive, isFeatured, order | `isActive` = visible sur le site |
| Articles | `posts` | title, slug, content, heroImage, publishedAt, categories, relatedPosts | Drafts + autosave activés. Schedule publish disponible. |
| Pages | `pages` | title, slug, hero, layout (blocs) | Pages génériques via le système de blocs |
| Médias | `media` | alt, caption | Stocké sur Cloudflare R2. Auto-converti WebP en 7 tailles. |

### Globals (données de site)

| Global | Où l'éditer | Ce qu'il contrôle |
|---|---|---|
| Header | Admin → Header | Liens de navigation du header |
| Footer | Admin → Footer | Liens de navigation du footer |
| SiteSettings | Admin → Réglages du site | Nom clinique, URL Jane (rendez-vous), téléphone, courriel, adresse, heures, réseaux sociaux, images des pages héros |

---

## 5. Données globales (Header, Footer, SiteSettings)

**SiteSettings est la source de vérité** pour toutes les infos de la clinique. Il est lu par :
- `Header/Component.tsx` (téléphone, heures, adresse pour la barre info)
- `Footer/Component.tsx` (heures, coordonnées, réseaux sociaux)
- `components/home/ClinicHomePage.tsx` (URL Jane pour les CTA)
- `components/contact/ContactPage.tsx` (toutes les coordonnées)
- `components/seo/LocalBusinessJsonLd.tsx` (données Schema.org)

**Pour changer le numéro de téléphone, l'adresse, les heures, l'URL Jane** :  
→ Admin Payload → Réglages du site. Pas besoin de toucher au code.

**Cache** : Header et Footer sont mis en cache avec `unstable_cache`. Ils se revalident automatiquement après une modification dans l'admin. SiteSettings est lu sans cache (requête directe à chaque rendu serveur).

---

## 6. Images et médias

### Deux types d'images dans le projet

**1. Médias Payload (contenu uploadé)** — stockés sur Cloudflare R2  
- Référencés via `professional.photo.url`, `service.featuredImage.url`, etc.
- Auto-générés en 7 tailles WebP par Payload : thumbnail (300px), square (500×500), small (600px), medium (900px), large (1400px), xlarge (1920px), og (1200×630px)
- Toujours servir la bonne taille : préférer `photo.sizes?.medium?.url` à `photo.url` pour les vignettes
- Ces images passent par l'API Payload (`/api/media/file/...`), **pas** par l'optimisation Next.js Image

**2. Assets statiques** (`public/assets/`) — illustrations PNG du site  
- Watercolors de la clinique, silhouettes pour les catégories de conditions, icônes de services
- Référencés avec un chemin `/assets/nom-du-fichier.png`
- Ces images **bénéficient** de l'optimisation Next.js `<Image>` (WebP automatique, lazy loading)
- L'image hero de l'accueil est `public/assets/salle-chiro-ville-fused-watercolor.png`

### Utiliser les images correctement

```tsx
// ✅ Asset statique → toujours via next/image
import Image from 'next/image'
<Image src="/assets/mon-image.png" alt="..." width={800} height={600} />

// ✅ Image hero above the fold → ajouter priority
<Image src="/assets/hero.png" alt="..." fill sizes="100vw" priority />

// ✅ Image Payload → utiliser l'URL directement (pas d'optimisation Next.js)
<img src={professional.photo.url} alt={professional.name} />
// ou pour les vignettes, préférer la taille appropriée :
<img src={professional.photo.sizes?.medium?.url ?? professional.photo.url} alt={...} />
```

---

## 7. CSS et styles

Le projet utilise **Tailwind CSS v4** avec des classes utilitaires directement dans le JSX. Pas de fichier de config Tailwind avec des couleurs custom — toutes les couleurs sont des classes Tailwind standard.

### Polices
- **DM Sans** (`var(--font-dm-sans)`) — corps de texte, paragraphes
- **Barlow Condensed** (`var(--font-barlow-condensed)`) — titres, labels, navigation, CTA
- **Geist Mono** (`var(--font-geist-mono)`) — code (hérité du template Payload)

Chargées via `next/font/google` dans `app/(frontend)/layout.tsx`. Auto-hébergées, pas de requête externe Google Fonts.

### Palette de couleurs utilisée

| Rôle | Classe Tailwind | Où |
|---|---|---|
| Accent / rouge clinique | `red-700` | Textes sur fond clair/crème |
| Accent rouge sur fond sombre | `red-500` | Footer (headings h2 sur zinc-950) |
| Fond sombre | `zinc-950` | Footer, drawer mobile |
| Fond crème | `bg-[#f6f1e8]` | Certaines sections de l'accueil |
| Texte principal | `zinc-950` | Corps de texte |
| Texte secondaire | `zinc-600` | Dates, métadonnées sur fond blanc |

> **Règle contraste WCAG AA** : sur fond crème `#f6f1e8`, utiliser `red-700` (pas `red-600`). Sur fond sombre (`zinc-950`), utiliser `red-500` ou `zinc-300`.

### Animations scroll
Le composant `<ScrollReveal>` (dans `ui/ScrollReveal.tsx`) utilise `IntersectionObserver` pour déclencher des animations d'apparition. Il ajoute les classes CSS `sr-hidden` → `sr-visible`. Les styles sont dans `globals.css`.

---

## 8. Utilitaires importants

| Fichier | Fonction | Usage |
|---|---|---|
| `utilities/seo.ts` | `getDefaultOpenGraphImages()` / `getOpenGraphImages()` | Toutes les métadonnées OG des pages |
| `utilities/getGlobals.ts` | `getCachedGlobal('header' \| 'footer', depth)` | Lire Header ou Footer avec cache |
| `utilities/getURL.ts` | `getServerSideURL()` | URL du site (env-aware) |
| `utilities/typography.ts` | `noOrphanColon(text)` | Typographie française : ` : ` → ` : ` avec espace insécable |
| `utilities/ui.ts` | `cn(...classes)` | Merge de classes Tailwind (clsx + tailwind-merge) |
| `utilities/slugify.ts` | `slugify(text)` | Génère un slug URL-safe à partir d'un texte français |

---

## 9. Duplications connues — attention si tu modifies

Ces éléments existent en plusieurs endroits. Si tu en modifies un, pense à vérifier les autres.

### URL Jane (`FALLBACK_JANE_URL`)
La valeur `'https://chiropratiquestroch.janeapp.com'` est codée en dur dans :
- `src/Header/Component.tsx`
- `src/Footer/Component.tsx`
- `src/components/home/ClinicHomePage.tsx`
- `src/components/seo/LocalBusinessJsonLd.tsx`
- `src/components/services/ServicesPage.tsx` (comme `JANE_URL`)
- `src/components/professionals/ProfessionalsPage.tsx` (comme `JANE_URL`)

**La bonne source de vérité est SiteSettings → `mainJaneUrl`**, mais ces composants ne la lisent pas tous. Si l'URL Jane change, mettre à jour SiteSettings **ET** ces 6 fichiers.

### Map `JANE_SERVICE_URLS` (liens directs par service)
Définie identiquement dans :
- `src/components/services/ServicesPage.tsx`
- `src/components/services/ServiceDetailPage.tsx`

### Section hero des pages (ServicesPage, ProfessionalsPage)
Les deux implémentent la même structure hero inline au lieu d'utiliser le composant `<PageHero>` de `ui/PageHero.tsx`.

### Extraction d'URL photo de professionnel
Ce pattern est copié dans 3 composants différents :
```ts
const photoUrl = professional.photo && typeof professional.photo === 'object' && 'url' in professional.photo
  ? professional.photo.url
  : null
```
Présent dans : `ClinicHomePage.tsx`, `ProfessionalsPage.tsx`, `ServiceDetailPage.tsx`.

### Rotation d'articles (ClinicHomePage + BloguePage)
La logique de rotation par date (`dayIndex = Date.now() / 86400000`) est dupliquée dans les deux composants.

---

## 10. Conventions du projet

### Structure des fichiers
- **`page.tsx` est toujours mince** : il exporte uniquement `generateMetadata`, `generateStaticParams`, et la fonction `Page` qui délègue à un composant.
- **Composants client** : suffixés `.client.tsx` (ex. `Component.client.tsx`, `page.client.tsx`).
- **Composants serveur** : aucun suffixe. Peuvent appeler `getPayload()` directement.

### Naming
- Dossiers de routes : `kebab-case` (`conditions-traitees/`, `[slug]/`)
- Fichiers de composants : `PascalCase` (`ServicesPage.tsx`)
- Fichiers utilitaires : `camelCase` (`getGlobals.ts`)
- Identifiants de code : anglais. Labels admin Payload : français.

### Slugs
Générés automatiquement par le hook `beforeValidate` via `utilities/slugify.ts`. Les accents sont normalisés (`é` → `e`, `ô` → `o`, etc.). Ne jamais saisir un slug avec des majuscules ou des espaces.

### Métadonnées SEO
- `siteName` : toujours `'Chiropratique St-Roch'`
- `locale` : toujours `'fr_CA'`
- Pour contourner le template de titre du layout : utiliser `title: { absolute: '...' }`
- Les images OG passent toutes par `getDefaultOpenGraphImages()` ou `getOpenGraphImages()`

### Payload et TypeScript
Les globals SiteSettings sont typés `any` partout dans le code (faiblesse connue). La collection `condition-categories` est également passée comme `'condition-categories' as any` dans `payload.find()` parce qu'elle est custom et pas dans les types générés par défaut.

### Génération SEO automatique (Claude AI)
Quand tu sauvegardes un document dans l'admin, le plugin dans `src/plugins/index.ts` appelle l'API Anthropic (modèle Haiku) pour générer un titre SEO et une méta-description. Ça fonctionne pour : posts, services, condition-categories, professionals. Nécessite `ANTHROPIC_API_KEY` dans `.env`.

### Revalidation du cache
- Header et Footer : revalidés automatiquement par leur hook `afterChange` Payload
- Pages et Posts : hooks `revalidatePage` et `revalidatePost` dans leurs collections
- Accueil et blogue : `export const revalidate = 3600` (re-rendu toutes les heures)
