export function parsePort(value: string | undefined): number {
  if (!value || !/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 65535) {
    throw new Error('Задайте PORT целым числом от 1 до 65535')
  }
  return Number(value)
}
