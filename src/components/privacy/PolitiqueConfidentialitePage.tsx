import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { GeometricShapes } from '@/components/ui/GeometricShapes'

export function PolitiqueConfidentialitePage() {
  return (
    <main className="bg-white text-zinc-950">
      <section className="relative min-h-[40vh] bg-white pb-24 pt-32 lg:pt-48">
        <GeometricShapes />
        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">

            <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="font-[var(--font-barlow-condensed)] text-[clamp(2rem,7vw,4.5rem)] font-medium uppercase leading-[1.05] text-zinc-950">
                  Politique de<br />confidentialité.
                </h1>
              </div>

              <div className="hidden lg:block h-24 w-[1px] flex-shrink-0 self-center bg-red-600" />

              <div className="lg:max-w-[38%]">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-red-600">Loi 25</p>
                <p className="mt-3 text-[1rem] leading-7 text-zinc-800">
                  Chiropratique St-Roch est soucieuse de la protection de votre vie privée et des renseignements personnels qu&apos;elle recueille sur son site Web ou tout autre moyen technologique.
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-[780px] space-y-12">

              <p className="leading-7 text-zinc-700">
                La présente Politique de confidentialité fait état de la manière dont Chiropratique St-Roch protège les renseignements personnels qu&apos;elle détient, et ce, afin de tenir compte des exigences des lois applicables en matière de protection des renseignements personnels, incluant la Loi 25, ainsi que toutes autres lois et règlements applicables en ce domaine.
              </p>
              <p className="leading-7 text-zinc-700">
                La présente Politique ne s&apos;applique pas aux renseignements qui ont un caractère public en vertu de ces législations.
              </p>

              <div className="border border-zinc-200 bg-zinc-50 p-8">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-red-600">
                  À noter
                </p>
                <p className="mt-3 leading-7 text-zinc-700">
                  Le site Web de Chiropratique St-Roch <strong className="text-zinc-950">ne recueille aucune donnée personnelle directement</strong>. Toute collecte, utilisation et conservation de renseignements personnels s&apos;effectue exclusivement par l&apos;entremise de <strong className="text-zinc-950">Jane App</strong>, notre outil de gestion clinique, qui est conforme aux lois, normes et règlements applicables en matière de protection des renseignements personnels au Québec et au Canada.
                </p>
              </div>

              <div className="border-t border-zinc-200 pt-10">
                <h2 className="font-[var(--font-barlow-condensed)] text-[1.4rem] font-medium uppercase tracking-[0.04em] text-zinc-950">
                  Responsabilité
                </h2>
                <p className="mt-4 leading-7 text-zinc-700">
                  Chiropratique St-Roch est responsable de la protection des renseignements personnels qu&apos;elle détient ou qu&apos;elle confie, le cas échéant, à un tiers.
                </p>
                <p className="mt-3 leading-7 text-zinc-700">
                  L&apos;équipe de Chiropratique St-Roch s&apos;assure que ses employés protègent la confidentialité des renseignements personnels auxquels ils ont accès, peu importe le support ou la forme.
                </p>
              </div>

              <div className="border-t border-zinc-200 pt-10">
                <h2 className="font-[var(--font-barlow-condensed)] text-[1.4rem] font-medium uppercase tracking-[0.04em] text-zinc-950">
                  Renseignements personnels que nous recueillons
                </h2>
                <ul className="mt-4 space-y-2 text-zinc-700">
                  {['Nom', 'Prénom', 'Adresse postale', 'Adresse courriel', 'Numéro de téléphone', 'Date de naissance'].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2.5 block h-1 w-1 flex-shrink-0 rounded-full bg-red-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-zinc-200 pt-10">
                <h2 className="font-[var(--font-barlow-condensed)] text-[1.4rem] font-medium uppercase tracking-[0.04em] text-zinc-950">
                  Moyens par lesquels nous recueillons des renseignements personnels
                </h2>
                <p className="mt-4 leading-7 text-zinc-700">
                  Les renseignements personnels sont recueillis pour l&apos;identification du patient dans un contexte de soins de santé. Ils sont transmis :
                </p>
                <ul className="mt-4 space-y-2 text-zinc-700">
                  {[
                    'Lors de la prise de rendez-vous (en ligne ou par téléphone)',
                    'Lors du remplissage du formulaire d\'ouverture de dossier en clinique',
                    'Et ensuite intégrés dans notre système de dossiers informatisés sécurisés',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2.5 block h-1 w-1 flex-shrink-0 rounded-full bg-red-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-zinc-200 pt-10">
                <h2 className="font-[var(--font-barlow-condensed)] text-[1.4rem] font-medium uppercase tracking-[0.04em] text-zinc-950">
                  Consentement — collecte, utilisation et communication
                </h2>
                <p className="mt-4 leading-7 text-zinc-700">
                  Chiropratique St-Roch obtient votre consentement avant d&apos;utiliser ou de communiquer à des tiers vos renseignements personnels, sauf dans les cas prévus par la loi.
                </p>
                <p className="mt-3 leading-7 text-zinc-700">
                  En utilisant nos services, vous consentez à la collecte, l&apos;utilisation et la conservation de vos renseignements conformément à cette politique. Si vous n&apos;acceptez pas ces conditions, veuillez vous abstenir d&apos;utiliser nos services.
                </p>
                <p className="mt-3 leading-7 text-zinc-700">
                  Aucun renseignement personnel n&apos;est communiqué sans votre consentement, sauf dans les cas prévus par la loi.
                </p>
              </div>

              <div className="border-t border-zinc-200 pt-10">
                <h2 className="font-[var(--font-barlow-condensed)] text-[1.4rem] font-medium uppercase tracking-[0.04em] text-zinc-950">
                  Durée de conservation
                </h2>
                <p className="mt-4 leading-7 text-zinc-700">
                  Les renseignements sont conservés pendant une durée de sept (7) ans suivant leur dernière utilisation, sauf si une autre durée est prévue par la loi.
                </p>
              </div>

              <div className="border-t border-zinc-200 pt-10">
                <h2 className="font-[var(--font-barlow-condensed)] text-[1.4rem] font-medium uppercase tracking-[0.04em] text-zinc-950">
                  Mesures de sécurité
                </h2>
                <p className="mt-4 leading-7 text-zinc-700">
                  Nous protégeons vos renseignements personnels par des mesures de sécurité physiques, techniques et administratives appropriées à la nature des données, pour éviter tout accès non autorisé, perte ou usage abusif.
                </p>
              </div>

              <div className="border-t border-zinc-200 pt-10">
                <h2 className="font-[var(--font-barlow-condensed)] text-[1.4rem] font-medium uppercase tracking-[0.04em] text-zinc-950">
                  Accès, rectification et droits sur vos renseignements
                </h2>
                <p className="mt-4 leading-7 text-zinc-700">
                  Vous pouvez à tout moment nous faire une demande pour :
                </p>
                <ul className="mt-4 space-y-2 text-zinc-700">
                  {[
                    'Accéder à vos renseignements personnels',
                    'Corriger ou mettre à jour vos renseignements',
                    'Retirer votre consentement',
                    'Cesser la diffusion ou demander la désindexation de certains renseignements',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2.5 block h-1 w-1 flex-shrink-0 rounded-full bg-red-600" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 border border-zinc-200 p-8">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-red-600">
                    Responsable de la protection des renseignements personnels
                  </p>
                  <p className="mt-3 font-[var(--font-barlow-condensed)] text-[1.1rem] font-medium uppercase tracking-[0.02em] text-zinc-950">
                    Alexandre Théorêt
                  </p>
                  <div className="mt-4 space-y-2 text-zinc-700">
                    <p>
                      <a href="mailto:info@chiropratiquestroch.com" className="hover:text-red-600">
                        info@chiropratiquestroch.com
                      </a>
                    </p>
                    <p>
                      <a href="tel:5817423808" className="hover:text-red-600">
                        581-742-3808
                      </a>
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
