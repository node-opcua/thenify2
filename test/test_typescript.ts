import should from "should";
class TestClass {
    public testMethod(callback: (err?: Error | null, value?: number) => void): void;
    public async testMethod(): Promise<number>
    public testMethod(callback?: (err?: Error | null, value?: number) => void): Promise<number> | void {
        should(callback !== undefined);
        return callback!(undefined, 42);
    }
}


import { withCallback } from "..";
TestClass.prototype.testMethod = withCallback(TestClass.prototype.testMethod);

describe("Test thenify with typescript", () => {

    it("should thenify a prototype function", async () => {

        const testClass = new TestClass();
        const result = await testClass.testMethod();
        result.should.equal(42);
    });

});
