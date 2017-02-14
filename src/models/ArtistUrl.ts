import { Model } from "objection";

class ArtistUrl extends Model {
    public static tableName = "artist_urls";

    // tslint:disable:variable-name
    public id: number;
    public artist_id: number;
    public url: string;
    public name: string;
    // tslint:enable:variable-name
}

export default ArtistUrl;
