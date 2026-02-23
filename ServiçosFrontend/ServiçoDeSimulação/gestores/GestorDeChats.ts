
import { GestorBase } from './GestorBase';
import { ChatData } from '../../../types';
import { sqlite } from '../cache/engine';

export class GestorDeChats extends GestorBase {
    private table = 'chats';

    public getAll(): Record<string, ChatData> {
        return this.queryAll<ChatData>(this.table).reduce((acc, c) => { 
            acc[c.id] = c; 
            return acc; 
        }, {} as Record<string, ChatData>);
    }

    public get(id: string): ChatData | undefined {
        return this.queryOne<ChatData>(this.table, id);
    }

    public set(chat: ChatData): void {
        this.upsert(this.table, chat.id, chat);
    }

    public delete(id: string): void {
        const items = this.queryAll<any>(this.table).filter(i => String(i.id) !== String(id));
        sqlite.saveTableData(this.table, items);
    }

    public async hardDelete(id: string): Promise<boolean> {
        this.delete(id);
        return true;
    }
}
