type ReferenceSection = {
  kicker: string
  title: string
  description: string
  items: string[]
}

export const templateHighlights = [
  'Aliases FSD ya configurados.',
  'Routing inicial con home y 404.',
  'Layout reutilizable para futuras landings.',
  'Shared UI listo para crecer sin duplicacion.',
] as const

export const referenceSections: ReferenceSection[] = [
  {
    kicker: 'app',
    title: 'Bootstrap y composicion global',
    description:
      'Centraliza providers, rutas, estilos y configuracion transversal del proyecto.',
    items: ['Providers', 'Router', 'Estilos globales'],
  },
  {
    kicker: 'pages + widgets',
    title: 'Experiencias visibles por pantalla',
    description:
      'Las paginas representan rutas completas y los widgets encapsulan bloques grandes reutilizables.',
    items: ['HomePage', 'NotFoundPage', 'AppLayout'],
  },
  {
    kicker: 'shared',
    title: 'Piezas comunes y contratos',
    description:
      'Aqui viven componentes de UI, config, helpers y recursos que no pertenecen al dominio.',
    items: ['Button', 'Container', 'Config del template'],
  },
]

export const quickStartSteps = [
  'Actualiza siteConfig con la marca y copies del nuevo proyecto.',
  'Crea nuevas pages y conectalas desde app/routes.',
  'Anade widgets y features segun las necesidades de la web.',
  'Mueve recursos compartidos a shared y el dominio a entities.',
] as const
