import { Model } from "objection";

class SongUrl extends Model {
    public static tableName = "song_urls";

    // tslint:disable:variable-name
    public id: number;
    public song_id: number;
    public url: string;
    public name: string;
    // tslint:enable:variable-name
}

export default SongUrl;
