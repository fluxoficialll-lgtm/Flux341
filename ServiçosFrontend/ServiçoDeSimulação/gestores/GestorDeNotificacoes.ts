
import { GestorBase } from './GestorBase';
import { NotificationItem } from '../../../types';
import { sqlite } from '../cache/engine';

export class GestorDeNotificacoes extends GestorBase {
    private table = 'notifications';

    public getAll(): NotificationItem[] {
        return this.queryAll<NotificationItem>(this.table);
    }

    public add(item: NotificationItem): void {
        this.upsert(this.table, item.id, item, { timestamp: item.timestamp });
    }

    public delete(id: number): void {
        const items = this.queryAll<any>(this.table).filter(i => String(i.id) !== String(id));
        sqlite.saveTableData(this.table, items);
    }
}
