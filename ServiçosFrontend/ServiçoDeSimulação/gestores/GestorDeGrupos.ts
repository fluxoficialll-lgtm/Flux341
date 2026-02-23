
import { GestorBase } from './GestorBase';
import { Group } from '../../../types';
import { sqlite } from '../cache/engine';

export class GestorDeGrupos extends GestorBase {
    private table = 'groups';

    public getAll(): Group[] {
        return this.queryAll<Group>(this.table);
    }

    public saveAll(data: Group[]): void {
        data.forEach(g => this.add(g));
    }

    public add(group: Group): void {
        this.upsert(this.table, group.id, group);
    }

    public update(group: Group): void {
        this.add(group);
    }

    public delete(id: string): void {
        const items = this.queryAll<any>(this.table).filter(i => String(i.id) !== String(id));
        sqlite.saveTableData(this.table, items);
    }

    public findById(id: string): Group | undefined {
        return this.queryOne<Group>(this.table, id);
    }
}
