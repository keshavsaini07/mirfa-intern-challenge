const store = new Map();

export async function save(record: any) {
  store.set(record.id, record);
}

export async function findById(id: string) {
  return store.get(id);
}
