/**
* Отдельная функция для просчета АП
*/
calculateAP = function (percent, creditTerm, loanSum, product) {

}

/**
* Основная функция для подсчета исходного графика и основных показателей
*/
calculatePaymentSchedule = function (loanSum, creditTerm, percent, contractConclusionDate, delay, penalty, penaltyPaid, product, bank) {
	var AP = PMT(percent/12, creditTerm, loanSum);
	var sum = AP * creditTerm;
	var calculationDate = new Date(); //Сегодняшняя дата
	var contractConclusionDate = contractConclusionDate; //Сегодняшняя дата
	var loanGivedMonthsAgo = Math.ceil((calculationDate.getTime() - contractConclusionDate.getTime()) / (3600 * 24 * 30 * 1000));  
	var loanMonthLeft = (creditTerm - loanGivedMonthsAgo) < 0 ? 0 : (creditTerm - loanGivedMonthsAgo);

	//Код для рассчета платежей 
	paymentScheduleCompiling = function (loanSum, percent, AP, delay, loanGivedMonthsAgo) {
		var balanceBeforePayment = loanSum;
		var balanceAfterPayment = balanceBeforePayment;
		var discargedDebt = 0;
		var sumPercentsPaid = 0;
		var delayedDebtPaid = 0;
		var delayedPercentsPaid = 0;
		var notPaidPercents = 0;
		var notPaidDebt = 0;
		var currentMonth = 1;
	 	var paymentSchedule = [];

		do {
			balanceBeforePayment = balanceAfterPayment;
			percentPayment = balanceBeforePayment * percent / 12;
			debtPayment = AP - percentPayment;
				sumPercentsPaid += percentPayment;
			discargedDebt += debtPayment;
			balanceAfterPayment = loanSum - discargedDebt;
			if (currentMonth <= loanGivedMonthsAgo - Math.ceil(delay/30)) {
				delayedDebtPaid = discargedDebt;
				delayedPercentsPaid = sumPercentsPaid;
			}
			if (currentMonth <= loanGivedMonthsAgo) {
				notPaidPercents = sumPercentsPaid;	
				notPaidDebt = discargedDebt;
			}
			paymentSchedule.push({
				'currentMonth': currentMonth,
				'loanLeftBeforePayment': balanceBeforePayment,
				'monthlyPayment': AP,
				'percentPayment': percentPayment,
				'debtPayment': debtPayment,
				'debtPaid': discargedDebt,
				'loanLeftAfterPayment': balanceAfterPayment
			});
	 		currentMonth++;
		} while (balanceAfterPayment > 0);

		return {
			"dischargedDebt": discargedDebt,
			'sumPercentsPaid': sumPercentsPaid,
			'realDischargedDebt': delayedDebtPaid,
			'realPercentsPaid': delayedPercentsPaid,
			'notPaidPercents': notPaidPercents - delayedPercentsPaid,
			'notPaidDebt': notPaidDebt - delayedDebtPaid,
			'paymentSchedule': paymentSchedule
		};
	}
	paymentScheduleCompiled = paymentScheduleCompiling(loanSum, percent, AP, delay, loanGivedMonthsAgo);

	reportData = {};

	reportData['AP'] = AP;
	reportData['loanGivedMonthsAgo'] = loanGivedMonthsAgo;
	reportData['loanMonthsLeft'] = loanMonthLeft;
	reportData['paymentsCount'] = loanGivedMonthsAgo - Math.ceil(delay/30);

	reportData['paymentsScheduleCompiled'] = paymentScheduleCompiled;
	reportData['totalPlannedPayments'] = paymentScheduleCompiled['dischargedDebt'] + paymentScheduleCompiled['sumPercentsPaid'];
	reportData['totalRealPayments'] = paymentScheduleCompiled['realDischargedDebt'] + paymentScheduleCompiled['realPercentsPaid'] + penaltyPaid;

	reportData['reservePool'] = delay > 721 ? 8 : VLOOKUP(bank, 'pull.csv', 0, 1, 1048576,  delay, 1);
	lookupstring = (delay > 721)?(product+721):(product+delay);
	reportData['retrievingChance'] = VLOOKUP(bank, 'veroyatnostvziskanyaireserv.csv', 3, 1, 1048576,  lookupstring, 4);

	reportData['penaltyPaid'] = penaltyPaid;

	//Сценарий стандартного взыскания

	reportData['collectorsShare'] = delay > 721 ? VLOOKUP(bank, 'pull.csv', 0, 1, 1048576,  720, 2) : VLOOKUP(bank, 'pull.csv', 0, 1, 1048576,  delay, 2);
	reportData['SumOfODReturnedByCollectors'] = (loanSum - paymentScheduleCompiled['realDischargedDebt']) * reportData['retrievingChance'];
	reportData['SumOfPercentsReturnedByCollectors'] = (paymentScheduleCompiled['sumPercentsPaid'] - paymentScheduleCompiled['realPercentsPaid']) * reportData['retrievingChance'];
	reportData['SumOfPenaltyReturnedByCollectors'] = ((penalty - penaltyPaid) * 0.05 * reportData['retrievingChance']);
	reportData['SumReturnedByCollectors'] = reportData['SumOfODReturnedByCollectors'] + reportData['SumOfPercentsReturnedByCollectors'] + reportData['SumOfPenaltyReturnedByCollectors'];
	reportData['RewardForCollectors'] = (reportData['SumOfODReturnedByCollectors'] + reportData['SumOfPercentsReturnedByCollectors']  + reportData['SumOfPenaltyReturnedByCollectors']) * reportData['collectorsShare'];
	reportData['AdjustedForecastForLoan'] = reportData['totalRealPayments'] + reportData['SumReturnedByCollectors'] - reportData['RewardForCollectors'];
	reportData['RevenueDeviationFromPlanned'] = reportData['AdjustedForecastForLoan'] - reportData['totalPlannedPayments'] - reportData['RewardForCollectors']; //Тут зачем-то 2 раза вычитается награда для коллекторов
	reportData['calculationDate'] = calculationDate;

	return reportData;
}
