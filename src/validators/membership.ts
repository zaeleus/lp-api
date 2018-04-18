import { INormalizedMembershipAttributes } from "../normalizers/membership";

const artistId = (id: string): boolean => {
    if (id.length === 0) {
        throw new Error("'artistId' cannot be blank");
    }

    return true;
};

export const rules: any = {
    artistId,
};

const validate = (
    attributes: Partial<INormalizedMembershipAttributes>,
): boolean => {
    if (attributes.artistId) {
        artistId(attributes.artistId);
    }

    return true;
};

export default validate;
