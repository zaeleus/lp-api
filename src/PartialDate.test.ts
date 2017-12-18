import PartialDate from "./PartialDate";

describe("PartialDate", () => {
    describe(".parse", () => {
        test("parses a (partial) YYYY-MM-DD string to a PartialDate", () => {
            let d;

            d = PartialDate.parse(undefined);
            expect(d.year).toBe(undefined);
            expect(d.month).toBe(undefined);
            expect(d.day).toBe(undefined);

            d = PartialDate.parse("");
            expect(d.year).toBe(undefined);
            expect(d.month).toBe(undefined);
            expect(d.day).toBe(undefined);

            d = PartialDate.parse("2017");
            expect(d.year).toBe(2017);
            expect(d.month).toBe(undefined);
            expect(d.day).toBe(undefined);

            d = PartialDate.parse("2017-11");
            expect(d.year).toBe(2017);
            expect(d.month).toBe(11);
            expect(d.day).toBe(undefined);

            d = PartialDate.parse("2017-11-13");
            expect(d.year).toBe(2017);
            expect(d.month).toBe(11);
            expect(d.day).toBe(13);
        });
    });

    describe(".toString", () => {
        describe("all pieces are undefined", () => {
            test("returns an empty string", () => {
                expect(new PartialDate().toString()).toBe("");
            });
        });

        describe("with only a year", () => {
            test("returns the year as a string", () => {
                expect(new PartialDate(2017).toString()).toBe("2017");
            });
        });

        describe("with a year and month", () => {
            test("returns the year and formatted month", () => {
                expect(new PartialDate(2016, 2).toString()).toBe("2016-02");
                expect(new PartialDate(2017, 11).toString()).toBe("2017-11");
            });
        });

        describe("with a year, month, and day", () => {
            test("returns the formatted date", () => {
                expect(new PartialDate(2016, 2, 4).toString()).toBe("2016-02-04");
                expect(new PartialDate(2017, 9, 14).toString()).toBe("2017-09-14");
                expect(new PartialDate(2017, 11, 21).toString()).toBe("2017-11-21");
            });
        });
    });
});
