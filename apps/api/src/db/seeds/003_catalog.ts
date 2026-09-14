import type { Knex } from 'knex'

export async function seed(db: Knex): Promise<void> {
  await db('categories')
    .insert({ slug: 'memory', name: 'Оперативная память' })
    .onConflict('slug')
    .ignore()
  const categories = await db('categories').select('id', 'slug')
  const groups = [
    { slug: 'processors', name: 'Процессор PS Compute', base: 9000, step: 2100 },
    { slug: 'graphics-cards', name: 'Видеокарта PS Graphics', base: 20000, step: 4500 },
    { slug: 'memory', name: 'Память PS DDR5', base: 1500, step: 500 },
  ]
  const products = groups.flatMap((group) =>
    Array.from({ length: 18 }, (_, index) => ({
      sku: `DEMO-${group.slug}-${index + 1}`,
      name: `${group.name} ${index + 1}`,
      description: `Демонстрационный компонент серии ${index + 1} для домашнего или рабочего компьютера.`,
      price_kopecks: (group.base + index * group.step) * 100,
      category_id: categories.find((category) => category.slug === group.slug).id,
      image_url: index % 5 === 0 ? null : '/images/component.svg',
      available: index % 4 !== 0,
    })),
  )
  await db('products').insert(products).onConflict('sku').ignore()
}
