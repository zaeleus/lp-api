import PartialDate from "../util/PartialDate";

interface IMembershipAttributes {
    artistId: string;
    endedOn: string;
    id: string;
    startedOn: string;
}

interface INormalizedMembershipAttributes {
    artistId: string;
    endedOn: PartialDate;
    id: string;
    startedOn: PartialDate;
}

const artistId = (i?: string): string => i ? i.trim() : "";

const endedOn = (s?: string): PartialDate => {
    if (s) {
        return PartialDate.parse(s);
    } else {
        return new PartialDate();
    }
};

const id = (i?: string): string => i ? i.trim() : "";

const startedOn = (s?: string): PartialDate => {
    if (s) {
        return PartialDate.parse(s);
    } else {
        return new PartialDate();
    }
};

export const rules = {
    artistId,
    endedOn,
    id,
    startedOn,
};

const normalize = (
    attributes: Partial<IMembershipAttributes>,
): INormalizedMembershipAttributes => ({
    artistId: artistId(attributes.artistId),
    endedOn: endedOn(attributes.endedOn),
    id: id(attributes.id),
    startedOn: startedOn(attributes.startedOn),
});

export default normalize;
