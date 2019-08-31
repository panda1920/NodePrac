function ret2() {
    return 2;
}

test('shouldReturn2', () => {
     expect(ret2()).toBe(2);
});

const fahrenheitToCelsius = (temp) => {
    return (temp - 32) / 1.8
}

const celsiusToFahrenheit = (temp) => {
    return (temp * 1.8) + 32
}

//
// Goal: Test temperature conversion functions
//
// 1. Export both functions and load them into test suite
// 2. Create "Should convert 32 F to 0 C"
// 3. Create "Should convert 0 C to 32 F"
// 4. Run the Jest to test your work!

test('Convert 32 Fahrenheit To 0 Celsius', () => {
    expect(fahrenheitToCelsius(32)).toBe(0);
});
test('Convert 0 Celsius to 32 Fahrenheit', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
});

test('sample', (done) => { // add argument to callback to tell jest it is async code.
    setTimeout(() => {
        expect(2).toBe(2);
        done(); // call the argument to notify jest that async code is done running
    }, 2000);
});