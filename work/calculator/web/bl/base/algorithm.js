/*
Алгоритм справедливой реструктуризации
Система из n+1 уравнений, где n уравнений

Исчисление исходя из сравнения потерь при реструктуризации 
потери = (планируемая сумма - сумма при реструктуризации) / (планируемая сумма * вероятнхость возврата) * 100%;
максимальная сумма ежемесячного платежа = платеж 1 при реструктуризации + платеж 2 при реструктуризации + ... + платеж n при реструктуризации

Есть вопрос, каким образом вывести сумму получаемую при реструктуризации

UPDATE:

Пока реализован более простой вариант алгоритма.
*/

loanFormat = {
	'loanId' : 0,
	'debtLeft': 1000,
	'retrievingChance': 0.9
};

generateProportions = function (loans, maximumPayment) {
	sumOfLoansPaymentsLeft = 0;
	for (var loan in loans) {
		sumOfLoansPaymentsLeft += loans[loan]['debtLeft'] * loans[loan]['retrievingChance'];
	}

	proportionsByLoan = [];

	for (var loan in loans) {
		proportionsByLoan.push({
			'loanId': loans[loan]['loanId'],
			'payment': maximumPayment * (loans[loan]['debtLeft'] * loans[loan]['retrievingChance']) / sumOfLoansPaymentsLeft
		});
	}

	return proportionsByLoan;
}

chooseBestScenarios = function (scenarios) {
	var bestScenarios = [];
	var scenariosByPriority = {};
	var topPriority = 1000;

	for (var loanId in scenarios) {
		for (var scenario in scenarios[loanId]) {
			if (scenariosByPriority[scenarios[loanId][scenario]['priority']] == undefined) {
				scenariosByPriority[scenarios[loanId][scenario]['priority']] = {
					'length': 0
				};
			}	
			scenariosByPriority[scenarios[loanId][scenario]['priority']][loanId] = true;
			scenariosByPriority[scenarios[loanId][scenario]['priority']]['length']++;
		}
	}

	for (var priority in scenariosByPriority) {
		if ((scenariosByPriority[priority]['length'] == Object.keys( scenarios ).length) && priority < topPriority) {
			topPriority = priority;
		}
	}
	if (topPriority == 1000) {
		return [];
	}

	for (var loanId in scenarios) {
		for (var scenario in scenarios[loanId]) {
			if (scenarios[loanId][scenario]['priority'] == topPriority) {
				bestScenarios[loanId] = scenarios[loanId][scenario];
			}	
		}
	}

	return bestScenarios;
}