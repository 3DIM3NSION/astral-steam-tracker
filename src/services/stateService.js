import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

export class StateService {
  constructor(filePath) {
    this.filePath = filePath;
    this.state = {};
    this.loaded = false;
  }

  async load() {
    try {
      const raw = await readFile(this.filePath, 'utf8');
      this.state = JSON.parse(raw);
      if (typeof this.state !== 'object' || Array.isArray(this.state) || this.state === null) {
        this.state = {};
      }
    } catch (err) {
      if (err?.code === 'ENOENT') {
        this.state = {};
      } else {
        throw err;
      }
    }
    this.loaded = true;
    return this.state;
  }

  get(key) {
    return this.state[key] ?? null;
  }

  set(key, value) {
    this.state[key] = value;
  }

  async save() {
    await mkdir(path.dirname(this.filePath), { recursive: true });
    const tmp = `${this.filePath}.tmp`;
    await writeFile(tmp, JSON.stringify(this.state, null, 2), 'utf8');
    await rename(tmp, this.filePath);
  }
}
