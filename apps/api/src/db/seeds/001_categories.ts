import type { Knex } from 'knex';

export async function seed(db: Knex): Promise<void> {
  await db('categories')
    .insert([
      { slug: 'processors', name: 'Процессоры' },
      { slug: 'graphics-cards', name: 'Видеокарты' },
    ])
    .onConflict('slug')
    .ignore();
}