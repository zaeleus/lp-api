import { formatPartialDate } from "./util";

describe("formatPartialDate", () => {
    describe("all arguments are undefined", () => {
        test("returns an empty string", () => {
            expect(formatPartialDate()).toBe("");
        });
    });

    describe("given only a year", () => {
        test("returns the year as a string", () => {
            expect(formatPartialDate(2017)).toBe("2017");
        });
    });

    describe("given a year and month", () => {
        test("returns the year and formatted month", () => {
            expect(formatPartialDate(2016, 2)).toBe("2016-02");
            expect(formatPartialDate(2017, 11)).toBe("2017-11");
        });
    });

    describe("given a year, month, and day", () => {
        test("returns the formatted date", () => {
            expect(formatPartialDate(2016, 2, 4)).toBe("2016-02-04");
            expect(formatPartialDate(2017, 9, 14)).toBe("2017-09-14");
            expect(formatPartialDate(2017, 11, 21)).toBe("2017-11-21");
        });
    });
});
