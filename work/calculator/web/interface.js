loadTestData = function (loanId, testData) {
	for (var field in testData) {
		document.getElementsByName('loan[' + loanId + '][' + field + ']')[0].value = testData[field];
	}
}

removeLoan = function (loanId) {
	document.getElementById('loan-' + loanId).style.display = "none";
}

getDataFromForm = function (loanId) {
	var dataTemplate = {
		'product': '',
		'loan-sum': 0,
		'credit-term': 0,
		'percent': 0,
		'contract-conclusion-date': '',
		'ZT': 0,
		'delay': 0,
		'penalty': 0,
		'penalty-paid': 0,
		'changed-penalty': 0,
		'include-percents': 0,
		'fonding-rate-current': 0,
		'fonding-rate-after-restructurisation': 0,
		'term-foreclosure': 0,
		'refinancing-rate': 0,
		'bank': '',
		'delay-percent': 0,
		'new-restructurisation-percent': 0,
		'minimal-payment': 0,
		'discount': 0
	}

	for (var field in dataTemplate) {
		if ( document.getElementsByName('loan[' + loanId + '][' + field + ']')[0] == undefined) {
			alert('Необходимо заполнить все поля: ' + field);
			return ;
		} 
		if (typeof dataTemplate[field] == 'string') {
			dataTemplate[field] = document.getElementsByName('loan[' + loanId + '][' + field + ']')[0].value;
		} else {
			dataTemplate[field] = parseFloat(document.getElementsByName('loan[' + loanId + '][' + field + ']')[0].value);
		}
	}
	dataTemplate['fonding-rate-after-restructurisation'] = dataTemplate['delay-percent'];

	return dataTemplate;
}

loansCount = 0;

add_loan = function () {
	var compiledTemplate = _.template(loanTemplate);
	document.getElementById('loans').insertAdjacentHTML('beforeend', compiledTemplate({
		'id' : loansCount
	}));
	loansCount++;

	var es = document.getElementsByClassName('fill-test-data');
	for (var i in es) {
		es[i].onclick = function (e) {
			loadTestData(e.target.dataset.id, getTestData());
		}
	}

	var es = document.getElementsByClassName('delete');
	for (var i in es) {
		es[i].onclick = function (e) {
			removeLoan(e.target.dataset.id);
		}
	}

	var es = document.getElementsByClassName('make-report-default');
	for (var i in es) {
		es[i].onclick = function (e) {
			generateStandartLoanPlan(e.target.dataset.id);
		}
	}

	var es = document.getElementsByClassName('make-report');
	for (var i in es) {
		es[i].onclick = function (e) {
			generateRestructurisationData(e.target.dataset.id);
		}
	}
}

document.getElementById('add-loan').onclick = add_loan;

clearAll = function () {
	document.getElementById('loans').innerHTML = '';
	clearReportView();
	clearModals();
	loansCount = 0;
}

document.getElementById('clear-all').onclick = clearAll;


clearReportView = function () {
	document.getElementById('loan-summary-report').innerHTML = '';
	document.getElementById('loan-summary-report-admin').innerHTML = '';
}

clearModals = function () {
	document.getElementById('modals').innerHTML = '';
}

renderTotalResultInformation = function (tableBody, loanId, totalEffect, template, container) {
	var compiledTemplate = _.template(template || summaryResultTable);
	var container = container || 'loan-summary-report';
	document.getElementById(container).innerHTML += compiledTemplate({
		'tableBody': tableBody,
		'loanId': parseInt(loanId)+1,
		'totalEffect': totalEffect
	});
}

renderDefaultInformation = function (loanId, data, standartLoanPlan, comment) {
	var compiledTemplate = _.template(newResultInformation);
	var comment = comment || 'Исходный график';

	var standartLossesForReserves = calculateStandartLosesForReserves(data, standartLoanPlan);

	/**
		Здесь также рендерим модалку для индивидуального графика
	*/
	var modalId = loanId + '-default';
	var modalWindow = renderPaymentSchedule(standartLoanPlan['paymentsScheduleCompiled']['paymentSchedule'], modalId);
	document.getElementById('modals').innerHTML += modalWindow; 

	return compiledTemplate({
		'loanId': loanId,
		'bank': data['bank'],
		'restructurisationType': 'default',
		'summaryCreditTerm': data['credit-term'],
		'restructurisationTerm': undefined,
		'newAP': correctRound(standartLoanPlan['AP']),
		'APWithIG': undefined,
		'restulingRestructurisationDeviationFromPlanned': correctRound(standartLoanPlan['RevenueDeviationFromPlanned'] - standartLossesForReserves),
		'modalId': modalId,
		'comment': comment
	});
}

renderResultInformation = function (type, loanId, data, standartLoanPlan, restructurisationData, restructurisationScenario, comment, template, paymentsAfterRestructurisation) {
	//var compiledTemplate = _.template(template || ResultInformation);
	var compiledTemplate = _.template(template || newResultInformation);
	var comment = comment || '';

	/**
		Здесь также рендерим модалку для индивидуального графика
	*/
	var modalId = loanId + type;
	var modalWindow = renderPaymentSchedule(restructurisationScenario['paymentSchedule'], modalId);
	document.getElementById('modals').innerHTML += modalWindow; 

	var resultingStandartDeviationFromPlanned = paymentsAfterRestructurisation - standartLoanPlan['totalPlannedPayments'] - restructurisationScenario['sumReserve'] * data['refinancing-rate'] 

	return compiledTemplate({
		'loanId': loanId,
		'bank': data['bank'],
		'restructurisationType': type,
		'summaryCreditTerm': restructurisationScenario['monthsLeft'] + standartLoanPlan['loanGivedMonthsAgo'],
		'restructurisationTerm': restructurisationScenario['monthsLeft'] ,
		'newAP': correctRound(restructurisationScenario['AP']),
		'APWithIG': ((restructurisationScenario['APWithIG'] == undefined) ? undefined : restructurisationScenario['APWithIG']),
		'restulingRestructurisationDeviationFromPlanned': correctRound(resultingStandartDeviationFromPlanned),
		'modalId': modalId,
		'comment': comment
	});
}

renderResultInformationAdmin = function (type, loanId, data, standartLoanPlan, restructurisationData, restructurisationScenario, comment, template, paymentsAfterRestructurisation, reason) {
	var compiledTemplate = _.template(template || newResultInformation);
	var comment = comment || '';


	var resultingStandartDeviationFromPlanned = paymentsAfterRestructurisation - standartLoanPlan['totalPlannedPayments'] - restructurisationScenario['sumReserve'] * data['refinancing-rate'] 

	return compiledTemplate({
		'loanId': loanId,
		'bank': data['bank'],
		'restructurisationType': type,
		'summaryCreditTerm': restructurisationScenario['monthsLeft'] + standartLoanPlan['loanGivedMonthsAgo'],
		'restructurisationTerm': restructurisationScenario['monthsLeft'] ,
		'newAP': correctRound(restructurisationScenario['AP']),
		'APWithIG': ((restructurisationScenario['APWithIG'] == undefined) ? undefined : restructurisationScenario['APWithIG']),
		'restulingRestructurisationDeviationFromPlanned': correctRound(resultingStandartDeviationFromPlanned),
		'comment': comment,
		'reason': reason
	});
}

renderPaymentSchedule = function (paymentSchedule, modalId) {
	var compiledTemplate = _.template(paymentsScheduleTableRow || ResultInformation);
	var paymentScheduleTableBody = '';
	for (var i in paymentSchedule) {
		paymentScheduleTableBody += compiledTemplate(paymentSchedule[i]);
	}

	var compiledTemplate = _.template(paymentScheduleTable);
	return compiledTemplate({
		'tableBody': paymentScheduleTableBody,
		'modalId': modalId
	})
}

computeStandartLoanPlan = function (loanId) {
	var data = getDataFromForm(loanId);
	var contractConclusionDate = parseDate(data['contract-conclusion-date']);
	if (!contractConclusionDate) {
		return false;
	}

	return calculatePaymentSchedule(
		data['loan-sum'],
		data['credit-term'],
		data['percent'],
		contractConclusionDate,
		data['delay'],
		data['penalty'],
		data['penalty-paid'],
		data['product'],
		data['bank']
		);
}


getAllLoansComputeSharesAndMakeAnalysis = function () {
	var maximumPayment = document.getElementById('maximum-credit-payment').value;
	var delayPaidBefore = document.getElementById('delay-paid').checked;

	clearReportView();
	clearModals();

	var standartLoanPlans = [];
	var dataForAnalysis = [];
	var summaryPayment = 0;
	var tableBody = '';
	var possibleScenarios = [];
	var notPossibleScenarios = [];
	var defaultScenarios = [];

	//Смотрим чтобы платеж был больше 50% суммарного платежа по кредиту
	for (var currentLoan = 0; currentLoan < loansCount; currentLoan++) {
		if (document.getElementById('loan-' + currentLoan).style.display != 'none') {
			var data = getDataFromForm(currentLoan);
			var AP = PMT(data['percent']/12, data['credit-term'], data['loan-sum']);
			summaryPayment += AP;
		}
	}

	if (maximumPayment < summaryPayment / 2) {
		alert ('Суммарный платеж должен превышать 50% суммарных платежей по кредиту');
		return false;
	}

	for (var currentLoan = 0; currentLoan < loansCount; currentLoan++) {
		if (document.getElementById('loan-' + currentLoan).style.display != 'none') {
			standartLoanPlans[currentLoan] = computeStandartLoanPlan(currentLoan);
			if (!standartLoanPlans[currentLoan]) {
				alert('Неправильный формат даты, даты задается в формате "дд.мм.гггг"');
				return false;
			}
			dataForAnalysis[currentLoan] = {
				'loanId' : currentLoan,
				'debtLeft': standartLoanPlans[currentLoan]['totalPlannedPayments'] - standartLoanPlans[currentLoan]['totalRealPayments'],
				'retrievingChance': reportData['retrievingChance']
			};
		}
	}

	loansData = generateProportions(dataForAnalysis, maximumPayment);

	for (var id in loansData) {
		var loanId = loansData[id]['loanId'];
		var data = getDataFromForm(loanId);

		possibleScenarios[loanId] = [];
		notPossibleScenarios[loanId] = [];

		var standartLossesForReserves = calculateStandartLosesForReserves(data, standartLoanPlans[loanId]);

		defaultScenarios[loanId] = {
			'derivationFromPlanned' : correctRound(standartLoanPlans[loanId]['RevenueDeviationFromPlanned'] - standartLossesForReserves),
			'htmlBlock': renderDefaultInformation(loanId, data, standartLoanPlans[loanId])
		};

		if (delayPaidBefore) {
			var completeDelayedDebtRepaymentComputer = new restructurisationScenarioCompleteDelayedDebtRepayment(loanId, data, standartLoanPlans[loanId], loansData[id]['payment']);
			var scenario = completeDelayedDebtRepaymentComputer.compute();
			if (scenario['isPossible']) {
				possibleScenarios[loanId].push(scenario);
			} else {
				notPossibleScenarios[loanId].push(scenario);
			}

			var prolongationComputer = new restructurisationScenarioProlongation(loanId, data, standartLoanPlans[loanId], loansData[id]['payment']);
			var scenario = prolongationComputer.compute();
			if (scenario['isPossible']) {
				possibleScenarios[loanId].push(scenario);
			} else {
				notPossibleScenarios[loanId].push(scenario);
			}
		} else {
			var refinancingComputer = new restructurisationScenarioRefinancing(loanId, data, standartLoanPlans[loanId], loansData[id]['payment']);
			var refinancingScenario = refinancingComputer.compute();
			if (refinancingScenario['isPossible']) {
				possibleScenarios[loanId].push(refinancingScenario);
			} else {
				notPossibleScenarios[loanId].push(refinancingScenario);
			}

			var igComputer = new restructurisationScenarioIG(loanId, data, standartLoanPlans[loanId], loansData[id]['payment']);
			var igScenario = igComputer.compute();
			if (igScenario['isPossible']) {
				possibleScenarios[loanId].push(igScenario);
			} else {
				notPossibleScenarios[loanId].push(igScenario);
			}

			var igWithProlongationScenarioComputer = new restructurisationScenarioIGWithProlongation(loanId, data, standartLoanPlans[loanId], loansData[loanId]['payment'], 0.8);
			var igWithProlongationScenario = igWithProlongationScenarioComputer.compute();
			if (igWithProlongationScenario['isPossible']) {
				for (var proportion = 0.8; proportion < 0.5; proportion -= 0.1) {
					var newIgWithProlongationScenario = new restructurisationScenarioIGWithProlongation(loanId, data, standartLoanPlans[loanId], loansData[loanId]['payment'], proportion);
					if (!newIgWithProlongationScenario['isPossible']) {
						continue;
					}
					if (newIgWithProlongationScenario['derivationFromPlanned'] < igWithProlongationScenario['derivationFromPlanned']) {
						igWithProlongationScenario = newIgWithProlongationScenario;
						//TODO: проверить
					}
				}
				possibleScenarios[loanId].push(igWithProlongationScenario);
			} else {
				notPossibleScenarios[loanId].push(igWithProlongationScenario);
			}
		}
	}

	bestScenarios = chooseBestScenarios(possibleScenarios);

	if (bestScenarios == [] || bestScenarios.length == 0) {
		document.getElementById('loan-summary-report').innerHTML = 'Реструктуризация кредитов с заданными данными невозможна';
	}

	for (var scenarioId in bestScenarios) {
		tableBody = '';
		tableBody += defaultScenarios[scenarioId]['htmlBlock'];
		tableBody += bestScenarios[scenarioId]['htmlBlock'];

		renderTotalResultInformation(tableBody, scenarioId, - correctRound(defaultScenarios[scenarioId]['derivationFromPlanned'] - bestScenarios[scenarioId]['derivationFromPlanned']));
	}

	for (var loanId in notPossibleScenarios) {
		tableBody = '';
		for (var scenarioId in notPossibleScenarios[loanId]) {
			tableBody += notPossibleScenarios[loanId][scenarioId]['htmlBlock'];
		}

		renderTotalResultInformation(tableBody, loanId, null, summaryResultTableAdmin, 'loan-summary-report-admin');
	}

}

document.getElementById('calculate').onclick = function() {
	return getAllLoansComputeSharesAndMakeAnalysis()
};

exportDataForDebug = function () {
	
}