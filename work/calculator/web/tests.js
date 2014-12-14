QUnit.test( "hello test", function( assert ) {
	assert.ok( 1 == "1", "Passed!" );
});

/*
computeRestructurisationScenario(product, 
	loanSum, 
	totalRealPaymentsForOd, 
	notPaidDebt, 
	minimalPayment, 
	newPercent, 
	delay, 
	fondPercent, 
	refinancingPercent, 
bank);
*/

function assertAll(testCases, assert, fun) {
	for (var i in testCases) {
		assert.ok( fun.apply(testCases[i]['params']) == testCases[i]['result'], "Passed!" );
	}
}

QUnit.test( "PMT test", function( assert ) {
	var testCases = [
		{
			'params': [1, 2, 3],
			'result': 15
		},
		{
			'params': [1, 2, 3],
			'result': 15
		},
	];

	assertAll(testCases, assert, PMT);
});

QUnit.test( "NPer test", function( assert ) {
	var testCases = [
		{
			'params': [1, 2, 3, 4, 5],
			'result': 15
		},
		{
			'params': [1, 2, 3, 4, 5],
			'result': 15
		},
	];

	assertAll(testCases, assert, NPer);
});


parseCsv(bank, input);

fromPercents(value);

toPercents(value);

correctRound(value, precision);

parseDate(dateString);