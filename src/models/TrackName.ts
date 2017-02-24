import { Model } from "objection";

class TrackName extends Model {
    public static tableName = "track_names";

    public get isDefault(): boolean {
        return this.is_default;
    }

    public get isOriginal(): boolean {
        return this.is_original;
    }

    // tslint:disable:variable-name
    public id: number;
    public track_id: number;
    public name: string;
    public locale: string;
    public is_default: boolean;
    public is_original: boolean;
    // tslint:enable:variable-name
}

export default TrackName;
