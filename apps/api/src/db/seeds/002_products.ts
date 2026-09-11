import type { Knex } from 'knex'

export async function seed(db: Knex): Promise<void> {
  const categories = await db('categories').select('id', 'slug')
  const categoryId = (slug: string): number => {
    const category = categories.find((item) => item.slug === slug)
    if (!category) throw new Error(`Не найдена категория ${slug}`)
    return category.id
  }
  await db('products')
    .insert([
      {
        sku: 'CPU-001',
        name: 'AMD Ryzen 5 7600',
        description: '6 ядер, 12 потоков. Для современной игровой и рабочей сборки.',
        price_kopecks: 1999000,
        category_id: categoryId('processors'),
      },
      {
        sku: 'CPU-002',
        name: 'Intel Core i5-13400F',
        description: '10 ядер, 16 потоков. Универсальная основа настольного компьютера.',
        price_kopecks: 1799000,
        category_id: categoryId('processors'),
      },
      {
        sku: 'CPU-003',
        name: 'AMD Ryzen 7 7700',
        description: '8 ядер, 16 потоков. Для многозадачности и творческих проектов.',
        price_kopecks: 2899000,
        category_id: categoryId('processors'),
      },
      {
        sku: 'GPU-001',
        name: 'GeForce RTX 4060',
        description: '8 ГБ видеопамяти. Для игр в Full HD и работы с графикой.',
        price_kopecks: 3299000,
        category_id: categoryId('graphics-cards'),
      },
      {
        sku: 'GPU-002',
        name: 'Radeon RX 7600',
        description: '8 ГБ видеопамяти. Графический ускоритель для повседневных игр.',
        price_kopecks: 2799000,
        category_id: categoryId('graphics-cards'),
      },
      {
        sku: 'GPU-003',
        name: 'GeForce RTX 4070',
        description: '12 ГБ видеопамяти. Для детализированных игровых миров.',
        price_kopecks: 5999000,
        category_id: categoryId('graphics-cards'),
      },
    ])
    .onConflict('sku')
    .ignore()
}
