//Сценарий реструктуризации

/*
Cells(i, 11) = "=IF(R16C10=720,VLOOKUP(CONCATENATE(Ðàñ÷åò!R4C4,R16C10),'Ñòàâêè ðåçåðâèðîâàíèÿ'!R1C3:R54C4,2,0),VLOOKUP(CONCATENATE(Ðàñ÷åò!R4C4,R16C10),'Ñòàâêè ðåçåðâèðîâàíèÿ'!R1C3:R54C4,2,0))"
Ставка резервирования

Cells(i, 12) = "=RC[-4]*RC[-1]*Ðàñ÷åò!R75C4/365*30"
(сумма кредита - (сумма всех (аннуинитетный ежемесячный платеж - сумма кредита * ежемесячная ставка))) * ставка резерва * ставка рефинансирования / 365 * 30
*/
function computeRestructurisationScenario(product, loanSum, totalRealPaymentsForOd, notPaidDebt, minimalPayment, newPercent, delay, fondPercent, refinancingPercent, bank)
{
	var loanNewSum = loanSum - totalRealPaymentsForOd - notPaidDebt;
	//var restructurisationMonths = Math.ceil(-NPer(newPercent/12, minimalPayment, loanNewSum));
	var restructurisationMonths = Math.ceil(NPer(newPercent/12, minimalPayment, -loanNewSum)); //Хак
	var annuinetetMonthlyPayment = PMT(newPercent/12, restructurisationMonths, loanNewSum);
	var monthlyPayment = annuinetetMonthlyPayment;

	var percentPayments = 0;
	var debtPayment = 0;
	var sumPaid = 0;
	var paymentsLeft = loanNewSum;
	var sumFullyPaid = 0;

	var PZ = 0;
	var fond = 0;
	var vl = 0;
	var sumReserve = 0;
	var data = [];
	var newData = [];
	var reserve = 0;
	var sumFonds = 0;
	var sumReserve = 0;

	var paymentSchedule = [];

	for (var currentMonth = 1; currentMonth <= restructurisationMonths; currentMonth ++) { 
		percentPayments = loanNewSum * newPercent / 12;

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

		if (currentMonth == 1) {
			monthlyPayment = annuinetetMonthlyPayment;
			reservePercent = VLOOKUP(bank, 'stavkireservirovania.csv', 2, 1, 54, product + PZ, 3);
		} else if (restructurisationMonths > 6) {
			if (currentMonth <= 6) {
				monthlyPayment = annuinetetMonthlyPayment;
				reservePercent = VLOOKUP(bank, 'stavkireservirovania.csv', 2, 1, 54,  product  + PZ, 3);
			} else if (currentMonth <= 7 + restructurisationMonths - 8) {
				monthlyPayment = annuinetetMonthlyPayment;
				if (delay == 0) {
					reservePercent = reservePercent; //Оставляем старый
				} else if (delay > 360) {
					reservePercent = 1; //100%
				} else {
					reservePercent = VLOOKUP(bank, 'stavkireservirovania.csv', 6, 1, 54, product + PZ + (vl-1), 7);
				}
			} else {
				monthlyPayment = loanNewSum + loanNewSum * newPercent / 12;
				if (delay == 0) {
					reservePercent = reservePercent; //Оставляем старый
				} else if (delay > 360) {
					reservePercent = 1; //100%
				} else {
					reservePercent = VLOOKUP(bank, 'stavkireservirovania.csv', 6, 1, 54, product + PZ + (vl-1), 7);
				}
			}
		} else {
			if (currentMonth < restructurisationMonths) {
				monthlyPayment = annuinetetMonthlyPayment;
//				reservePercent = VLOOKUP(data['product'] + PZ);
				reservePercent = VLOOKUP(bank, 'stavkireservirovania.csv', 2, 1, 54, product + PZ, 3);
			} else {
				monthlyPayment = paymentsLeft + paymentsLeft * newPercent / 12;
//				reservePercent = VLOOKUP(data['product'] + PZ);
				reservePercent = VLOOKUP(bank, 'stavkireservirovania.csv', 2, 1, 54, product + PZ, 3);
			}
		}

		debtPayment = monthlyPayment - percentPayments;
		sumPaid += debtPayment;
		paymentsLeft -= debtPayment;
		sumFullyPaid += monthlyPayment;

		fond = paymentsLeft * fondPercent / 365 * 30;

		if (currentMonth == 1) {
			reserve = fond * reservePercent;
		} else  if (restructurisationMonths > 6) {
			if (currentMonth <= 6) {
				reserve = fond * refinancingPercent;
			} else if (currentMonth <= 6 + restructurisationMonths - 8) {
				reserve = 0.7 * debtPayment * reservePercent * refinancingPercent / 365 * 30 + 0.3 * refinancingPercent *  paymentsLeft * fondPercent / 365 * 30; 
				/* Cells(i, 12) = "=0.7*RC[-4]*RC[-1]*Расчет!R75C4/365*30+30%*(SUMIF('Ставки резервирования'!R2C9:R55C9,""истина"",'Ставки резервирования'!R2C8:R55C8)*R16C8*Расчет!R75C4/365*30)"*/
			} else {
				reserve = 0.7 * debtPayment * reservePercent * refinancingPercent / 365 * 30 + 0.3 * refinancingPercent *  paymentsLeft * fondPercent / 365 * 30; 
				/* Cells(i, 12) = "=0.7*RC[-4]*RC[-1]*Ðàñ÷åò!R75C4/365*30+30%*(SUMIF('Ñòàâêè ðåçåðâèðîâàíèÿ'!R2C9:R55C9,""èñòèíà"",'Ñòàâêè ðåçåðâèðîâàíèÿ'!R2C8:R55C8)*R16C8*Ðàñ÷åò!R75C4/365*30)"*/
			}
		} else {
			if (currentMonth <= restructurisationMonths - 3) {
				reserve = fond * refinancingPercent;
			} else {
				reserve = fond * refinancingPercent;
			}
		}

	 	//loanNewSum = loanNewSum - (annuinetetMonthlyPayment - creditSum*monthlyPercent);

	 	data[currentMonth] = {
	 		'loanNewSum': loanNewSum,
	 		'monthlyPayment': monthlyPayment,
	 		'percentPayments':  percentPayments,
	 		'debtPayment': debtPayment,
	 		'sumPaid': sumPaid,
	 		'paymentsLeft': paymentsLeft,
	 		'fond': fond,
	 		'PZ': PZ,
	 		'reservePercent': reservePercent,
	 		'reserve': reserve
	 	};

	 	newData[currentMonth] = {
	 		'fondPercent':  fondPercent,
	 		'refinancingPercent':  refinancingPercent,
	 		'fonding': (paymentsLeft /* + IfAnyLeftOD */) * fondPercent / 365 * 30,
	 		'PZ': PZ,
	 		'reservePercent': reservePercent,
	 		'reserve': (paymentsLeft) * reservePercent * refinancingPercent / 365 * 30, //Рассчет резерва непонятный, проценты умножаются что многократно снижает цифры
	 		'paymentsLeft': loanNewSum, // + 'По ИГ данные', в качества остатка долга почему!то пишется остаток до оплаты а не после
	 		'monthlyPayment': monthlyPayment, //  + 'По ИГ данные'
	 		'percentPayments': percentPayments,//  + 'По ИГ данные'
	 		'debtPayment': debtPayment, //  + 'По ИГ данные'
	 		'sumPaid': sumPaid,//  + 'По ИГ данные'
	 		'paymentsLeft': paymentsLeft,//  + 'По ИГ данные'
	 		'refinancingPercent': refinancingPercent//  + 'По ИГ данные'
	 	}

		paymentSchedule.push({
			'currentMonth': currentMonth,
			'loanLeftBeforePayment': loanNewSum,
			'monthlyPayment':  monthlyPayment,
			'percentPayment': percentPayments,
			'debtPayment': debtPayment,
			'debtPaid': sumPaid,
			'loanLeftAfterPayment': paymentsLeft,
		});

	 	sumFonds += (paymentsLeft  /*  +IfAnyLeftOD */) * fondPercent / 365 * 30, //Рассчет резерва непонятный, проценты умножаются что многократно снижает цифры
	 	sumReserve += (paymentsLeft) * reservePercent * refinancingPercent / 365 * 30; //Рассчет резерва непонятный, проценты умножаются что многократно снижает цифры

	 	loanNewSum = paymentsLeft;
	} 

	return {
		'data': data,
		'newData': newData,
		'sumFullyPaid': sumFullyPaid,
		'monthsLeft': restructurisationMonths,
		'AP': annuinetetMonthlyPayment,
		'sumReserve' : sumReserve,
		'sumFonds' : sumFonds,
		'paymentSchedule': paymentSchedule
	};
}
