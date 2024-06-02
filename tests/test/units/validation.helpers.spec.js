const { isDateInFuture } = require("../../../helpers/validation.helpers.js");
const { expect } = require("../../config.js");
const { gracefulQuit, getCurrentDate, addOffsetToDateString } = require("../../helpers/helpers.js");

describe("validation helpers", async () => {
  after(() => {
    gracefulQuit();
  });
  // 2024-06-02T11:01:41+02:00
  describe("isDateInFuture", async () => {
    [
      ["2020-12-12T12:12:12Z", false],
      [new Date().toISOString(), false],
      [getCurrentDate(), false],
      ["2040-12-12T12:12:12Z", true],
      [getCurrentDate(0, 0, 12), true],
      [getCurrentDate(1, 0, 0), true],
      [addOffsetToDateString(new Date().toISOString(), "-11:00"), true],
      [addOffsetToDateString(new Date().toISOString(), "-04:00"), true],
      [addOffsetToDateString(new Date().toISOString(), "-02:00"), true],
      [addOffsetToDateString(new Date().toISOString(), "+02:00"), false],
      [addOffsetToDateString(new Date().toISOString(), "+04:00"), false],
      [addOffsetToDateString(new Date().toISOString(), "+11:00"), false],
      [addOffsetToDateString(getCurrentDate(1, 0, 0), "-02:00"), true],
    ].forEach((inputDateStringPairs) => {
      it(`check date - ${inputDateStringPairs[0]} - in future - ${inputDateStringPairs[1]}`, async () => {
        // Arrange:
        const inputDateString = inputDateStringPairs[0];

        // Act:
        const result = isDateInFuture(inputDateString);

        // Assert:
        expect(result.isDateInFuture, JSON.stringify(result, null, 2)).to.eql(inputDateStringPairs[1]);
      });
    });
  });
});
