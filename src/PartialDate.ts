const parseNumber = (s: string): number | undefined => {
    const i = parseInt(s, 10);
    return (isNaN(i)) ? undefined : i;
};

const zeroPad = (n: number): string => (n < 10) ? `0${n}` : `${n}`;

class PartialDate {
    public static parse(s?: string): PartialDate {
        if (!s) {
            return new PartialDate();
        }

        const pieces = s.split("-");

        const year = parseNumber(pieces[0]);
        const month = parseNumber(pieces[1]);
        const day = parseNumber(pieces[2]);

        return new PartialDate(year, month, day);
    }

    public year?: number;
    public month?: number;
    public day?: number;

    public constructor(year?: number, month?: number, day?: number) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    public toString(): string {
        if (this.year && !this.month) {
            return `${this.year}`;
        } else if (this.year && this.month && !this.day) {
            return `${this.year}-${zeroPad(this.month)}`;
        } else if (this.year && this.month && this.day) {
            return `${this.year}-${zeroPad(this.month)}-${zeroPad(this.day)}`;
        } else {
            return "";
        }
    }
}

export default PartialDate;
