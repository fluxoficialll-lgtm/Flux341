
// CORREÇÃO: O caminho para o engine foi ajustado para a nova estrutura: ../cache/engine.ts
import { sqlite } from '../cache/engine';

/**
 * GestorBase (anteriormente BaseManager) refatorado para operar sobre o motor de cache JSON.
 */
export class GestorBase {
    protected queryAll<T>(table: string): T[] {
        const data = sqlite.getTableData(table);
        return data.map(item => {
            // Se for string (legado do SQLite), tenta parsear, senão retorna o objeto
            if (typeof item.data === 'string') {
                try { return JSON.parse(item.data); } catch { return item.data; }
            }
            return item;
        });
    }

    protected queryOne<T>(table: string, id: string | number): T | undefined {
        const items = this.queryAll<any>(table);
        const found = items.find(i => String(i.id) === String(id));
        return found as T | undefined;
    }

    protected upsert(table: string, id: string | number, data: any, extra?: { timestamp?: number }) {
        const items = this.queryAll<any>(table);
        const index = items.findIndex(i => String(i.id) === String(id));
        
        const newItem = { 
            ...data, 
            id: String(id), 
            timestamp: extra?.timestamp || data.timestamp || Date.now() 
        };

        if (index > -1) {
            items[index] = newItem;
        } else {
            items.push(newItem);
        }

        sqlite.saveTableData(table, items);
    }
}
