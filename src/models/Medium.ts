import { Model } from "objection";

enum MediumKind {
    CD,
    DVD,
    BluRay,
    Digital,
    Vinyl,
}

class Medium extends Model {
    public static tableName = "media";

    // tslint:disable:variable-name
    public id: number;
    public release_id: number;
    public kind: MediumKind;
    public position: number;
    public name?: string;
    // tslint:enable:variable-name
}

export default Medium;
