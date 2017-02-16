import { Model } from "objection";

class Release extends Model {
    public static tableName = "releases";

    public get releasedOn(): Date {
        return this.released_on;
    }

    public get catalogNumber(): string | undefined {
        return this.catalog_number;
    }

    // tslint:disable:variable-name
    public id: number;
    public released_on: Date;
    public country?: string;
    public catalog_number?: string;
    public disambiguation?: string;
    // tslint:enable:variable-name
}

export default Release;
