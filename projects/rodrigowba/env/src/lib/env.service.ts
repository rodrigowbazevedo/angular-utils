import { Injectable, Inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EnvService {
  private data: Map<string, unknown> = new Map<string, unknown>();

  constructor(@Inject(Object) data: Record<string, unknown> = {}) {
    this.data = new Map<string, unknown>(Object.entries(data));
  }

  get<T>(property: string, fallback: T = null) {
    return (this.data.get(property) as T) || fallback;
  }
}
