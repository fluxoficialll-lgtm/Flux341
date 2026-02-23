
import { GestorBase } from './GestorBase';
import { User } from '../../../types'; // O caminho para os tipos precisa de ser ajustado

export class GestorDeUtilizadores extends GestorBase {
    private table = 'users';

    public getAll(): Record<string, User> {
        return this.queryAll<User>(this.table).reduce((acc, u) => { 
            acc[u.id] = u; 
            return acc; 
        }, {} as Record<string, User>);
    }

    public get(id: string): User | undefined {
        return this.queryOne<User>(this.table, id);
    }

    public set(user: User): void {
        this.upsert(this.table, user.id, user);
    }
}
