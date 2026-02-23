
import { GestorBase } from './GestorBase';
import { Relationship } from '../../../types';
import { sqlite } from '../cache/engine';

export class GestorDeRelacionamentos extends GestorBase {
    private table = 'relationships';

    public getAll(): Relationship[] {
        return this.queryAll<Relationship>(this.table);
    }

    public add(rel: Relationship): void {
        this.upsert(this.table, `${rel.followerId}_${rel.followingId}`, rel);
    }

    public remove(f1: string, f2: string): void {
        const id = `${f1}_${f2}`;
        const items = this.queryAll<any>(this.table).filter(i => String(i.id) !== id);
        sqlite.saveTableData(this.table, items);
    }
}
