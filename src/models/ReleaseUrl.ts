import { Model } from "objection";

class ReleaseUrl extends Model {
    public static tableName = "release_urls";

    // tslint:disable:variable-name
    public id: number;
    public release_id: number;
    public url: string;
    public name: string;
    // tslint:enable:variable-name
}

export default ReleaseUrl;
