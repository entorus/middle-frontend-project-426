import type { Knex } from 'knex'

export async function seed(db: Knex): Promise<void> {
  const entries = [
    {
      sku: 'CPU-001',
      title: 'Начните с сильной основы',
      text: 'Собираете компьютер для игр и повседневных задач? Присмотритесь к шестиядерному Ryzen 5 7600.',
      position: 1,
    },
    {
      sku: 'GPU-001',
      title: 'Больше деталей в любимых играх',
      text: 'GeForce RTX 4060 с 8 ГБ памяти — вариант для игровой сборки и работы с графикой.',
      position: 2,
    },
  ]
  for (const { sku, ...promotion } of entries) {
    const product = await db('products').where({ sku, available: true }).first('id')
    // Do not restore availability or overwrite editorial changes on repeated starts.
    if (product)
      await db('promotions')
        .insert({ ...promotion, product_id: product.id })
        .onConflict('product_id')
        .ignore()
  }
}
