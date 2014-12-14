generateIndividualSchedule = function (bank, debtLeft, notPaidDebt, notPaidPercents, APWithIg, APWithoutIg, newPercent, delay, product, refinancingPercent) {
	var data = [];
	var sumFullyPaid = 0;
	var sumReserve = 0;

	var monthlyPayment = 0;
	var minimalPayment = APWithIg;
	var paymentSchedule = [];
	var monthsLeftIg = 0;
	data[0] = {};
	data[0]['debtLeft'] = debtLeft;
	data[0]['debtPaid'] = 0;
	data[0]['notPaidPercents'] = notPaidPercents;
	data[0]['notPaidDebtLeft'] = notPaidDebt;

	var i = 1;
	do {
		data[i] = {};
		data[i]['loanNewSum'] = data[i-1]['notPaidDebtLeft'] + data[i-1]['debtLeft'];
		data[i]['loanLeftBeforePayment'] = data[i]['loanNewSum'];

		var currentPercents = (data[i-1]['debtLeft'] + data[i-1]['notPaidDebtLeft']) * newPercent / 12;
		data[i]['monthlyPayment'] = 0;

		if (data[i-1]['notPaidPercents'] > minimalPayment) {
			data[i]['monthlyPayment'] = minimalPayment;
			data[i]['notPaidPercents'] = data[i-1]['notPaidPercents'] - data[i]['monthlyPayment'];
		} else if (data[i-1]['notPaidPercents'] > 0){
			data[i]['monthlyPayment'] = data[i-1]['notPaidPercents'];
			data[i]['notPaidPercents'] = 0;
		} else {
			data[i]['notPaidPercents'] = data[i-1]['notPaidPercents'];
		}

		if (data[i]['monthlyPayment'] < minimalPayment) {
			if (minimalPayment - data[i]['monthlyPayment'] <= data[i-1]['notPaidDebtLeft']) {
				data[i]['notPaidDebtLeft'] = data[i-1]['notPaidDebtLeft'] - (minimalPayment - data[i]['monthlyPayment']);
				data[i]['monthlyPayment'] = minimalPayment;
			} else if (data[i-1]['notPaidDebtLeft'] > 0){
				data[i]['monthlyPayment'] += data[i-1]['notPaidDebtLeft'];
				data[i]['notPaidDebtLeft'] = 0;
			} else {
				data[i]['notPaidDebtLeft'] = data[i-1]['notPaidDebtLeft'];
			}
		} else {
			data[i]['notPaidDebtLeft'] = data[i-1]['notPaidDebtLeft'];
		}

		data[i]['percentPayments'] = 0;
		if (data[i]['monthlyPayment'] < minimalPayment) {
			if (currentPercents > minimalPayment - data[i]['monthlyPayment']) {
				data[i]['percentPayments'] = minimalPayment - data[i]['monthlyPayment'];
				data[i]['monthlyPayment'] = minimalPayment;
			} else {
				data[i]['percentPayments'] = currentPercents;
				data[i]['monthlyPayment'] += data[i]['percentPayments'];
			}
		}
		data[i]['fullPercentPayments'] = (data[i-1]['notPaidPercents'] - data[i]['notPaidPercents']) + (data[i]['percentPayments']);

		data[i]['notPaidPercents'] = data[i]['notPaidPercents'] + (currentPercents - data[i]['percentPayments']);

		data[i]['debtLeft'] = data[i-1]['debtLeft'];
		if (data[i]['monthlyPayment'] < minimalPayment) {
			if (data[i-1]['debtLeft'] > minimalPayment - data[i]['monthlyPayment']) {
				data[i]['debtLeft'] = data[i-1]['debtLeft'] - (minimalPayment - data[i]['monthlyPayment']);
				data[i]['monthlyPayment'] = minimalPayment;
			} else if (data[i-1]['debtLeft'] > 0){
				data[i]['monthlyPayment'] += data[i]['debtLeft'];
				data[i]['debtLeft'] = 0;
			} else {
				data[i]['debtLeft'] = data[i-1]['debtLeft'];
			}
			data[i]['debtPayment'] = (data[i-1]['debtLeft'] - data[i]['debtLeft']) + (data[i-1]['notPaidDebtLeft'] - data[i]['notPaidDebtLeft']);
			data[i]['debtPaid'] = data[i-1]['debtPaid'] + data[i]['debtPayment'];
		} else {
			data[i]['debtPayment'] = (data[i-1]['debtLeft'] - data[i]['debtLeft']) + (data[i-1]['notPaidDebtLeft'] - data[i]['notPaidDebtLeft']);
			data[i]['debtPaid'] = data[i-1]['debtPaid'] + data[i]['debtPayment'];
			data[i]['notPaidDebtLeft'] += (APWithoutIg - (data[i-1]['debtLeft'] - data[i]['debtLeft'])) > 0?(APWithoutIg - data[i]['debtPayment']):0;
			data[i]['debtLeft'] -= (APWithoutIg - (data[i-1]['debtLeft'] - data[i]['debtLeft'])) > 0?(APWithoutIg - data[i]['debtPayment']):0;
		}

		if (data[i]['notPaidDebtLeft'] == 0) {
			minimalPayment = APWithoutIg;
		} else {
			monthsLeftIg++;
		}

		data[i]['loanNewSum'] = data[i]['notPaidDebtLeft'] + data[i]['debtLeft'];
		data[i]['loanLeftAfterPayment'] = data[i]['loanNewSum'];
		sumFullyPaid += data[i]['fullPercentPayments'] + data[i]['debtPayment'];

		i++;
	} while (data[i-1]['debtLeft'] > 0.01); 
	data[i-1]['debtLeft'] = 0; //Временный фикс на этап перехода к числам с фиксированной запятой

	var restructurisationMonths = i;

	for (var i in data) {
		if (i==0) {
			continue;
		}
		if (delay == 0) {
			PZ = 0;
			vl = 1;
		} else if (delay <= 30) {
			PZ = 1;
			vl = 2;
		} else if (delay <= 60) {
			PZ = 31;
			vl = 3;
		} else if (delay <= 90) {
			PZ = 61;
			vl = 4;
		} else if (delay <= 120) {
			PZ = 91;
			vl = 5;
		} else if (delay <= 180) {
			PZ = 121;
			vl = 6;
		} else if (delay <= 360) {
			PZ = 181;
			vl = 7;
		} else if (delay <= 719) {
			PZ = 361;
			vl = 8;
		} else {
			PZ = 720;
			vl = 9;
		}

		if (i == 1) {
			reservePercent = VLOOKUP(bank, 'stavkireservirovania.csv', 2, 1, 54, product + PZ, 3);
		} else if (restructurisationMonths > 6) {
			if (i <= 6) {
				reservePercent = VLOOKUP(bank, 'stavkireservirovania.csv', 2, 1, 54,  product  + PZ, 3);
			} else if (i <= 7 + restructurisationMonths - 8) {
				if (delay == 0) {
					reservePercent = reservePercent; //Оставляем старый
				} else if (delay > 360) {
					reservePercent = 1; //100%
				} else {
					reservePercent = VLOOKUP(bank, 'stavkireservirovania.csv', 6, 1, 54, product + PZ + (vl-1), 7);
				}
			} else {
				if (delay == 0) {
					reservePercent = reservePercent; //Оставляем старый
				} else if (delay > 360) {
					reservePercent = 1; //100%
				} else {
					reservePercent = VLOOKUP(bank, 'stavkireservirovania.csv', 6, 1, 54, product + PZ + (vl-1), 7);
				}
			}
		} else {
			if (i < restructurisationMonths) {
//				reservePercent = VLOOKUP(data['product'] + PZ);
				reservePercent = VLOOKUP(bank, 'stavkireservirovania.csv', 2, 1, 54, product + PZ, 3);
			} else {
//				reservePercent = VLOOKUP(data['product'] + PZ);
				reservePercent = VLOOKUP(bank, 'stavkireservirovania.csv', 2, 1, 54, product + PZ, 3);
			}
		}

		var reserve = data[i]['loanNewSum'] * reservePercent * refinancingPercent / 365 * 30;
	 	sumReserve += reserve; //Рассчет резерва непонятный, проценты умножаются что многократно снижает цифры

	 	data[i]['reservePercent'] = reservePercent;
 		data[i]['reserve'] = reserve;

		paymentSchedule.push({
			'currentMonth': i,
			'loanLeftBeforePayment': data[i]['loanLeftBeforePayment'],
			'monthlyPayment':  data[i]['monthlyPayment'],
			'percentPayment': data[i]['fullPercentPayments'],
			'debtPayment': data[i]['debtPayment'],
			'debtPaid': data[i]['debtPaid'],
			'loanLeftAfterPayment': data[i]['loanLeftAfterPayment'],
		});
	}

	summaryPayment = 0;
	for (var j = 1; j <= i; j++) {
		summaryPayment += data[j]['monthlyPayment'];
	}
	sumFullyPaid += 0;

	return {
		'data': data,
		'summaryPayment': summaryPayment,
		'sumReserve': sumReserve,
		'monthsLeft': restructurisationMonths,
		'monthsLeftIg': restructurisationMonths,
		'sumFullyPaid': sumFullyPaid,
		'sumFullyPaid': sumFullyPaid,
		'AP': APWithoutIg,
		'APWithIG': APWithIg,
		'paymentSchedule': paymentSchedule
	};
}
