function restructurisationScenarioIGWithProlongation(loanId, data, standartLoanPlan, payment, proportion) {
	this.probabilityOfDefault = 0.7;

	this.compute = function () {
		IGScenarios = [];
		var restructurisationPayment = payment * proportion;

		var currentIgScenario = generateIndividualSchedule(
			data['bank'],
			data['loan-sum'] - standartLoanPlan['paymentsScheduleCompiled']['realDischargedDebt'],
			standartLoanPlan['paymentsScheduleCompiled']['notPaidDebt'], 
			standartLoanPlan['paymentsScheduleCompiled']['notPaidPercents'], 
			payment, 
			payment * proportion, 
			data['delay-percent'], 
			data['delay'], 
			data['product'], 
			data['refinancing-rate']
		);
		IGScenarios.push(currentIgScenario);

		var paymentsAfterRestructurisation = standartLoanPlan['totalRealPayments'] 
			+ currentIgScenario['sumFullyPaid'] * this.probabilityOfDefault + 0.05 * data['changed-penalty'];
		var derivationFromPlanned = paymentsAfterRestructurisation - standartLoanPlan['totalPlannedPayments'] - restructurisationScenario['sumReserve'] * data['refinancing-rate'] 

		if (!checkRestructurisationTermLimits(data['bank'], 'prolongation', data['product'], currentIgScenario['monthsLeft'])) {
			if (!checkIsRestructurisationScenarioAvailable(data['bank'], 'prolongation', data['product'])) {
				return {
					'isPossible': false,
					'htmlBlock': 
						renderResultInformationAdmin('igrestr', loanId, data, standartLoanPlan, [], currentIgScenario, 'Индивидуальный график плюс реструктуризация', newResultInformationAdmin, paymentsAfterRestructurisation,
					'Пролонгация для данного продукта не поддерживается банком')
				};
			} else {
				return {
					'isPossible': false,
					'htmlBlock': 
						renderResultInformationAdmin('igrestr', loanId, data, standartLoanPlan, [], currentIgScenario, 'Индивидуальный график плюс реструктуризация', newResultInformationAdmin, paymentsAfterRestructurisation,
					'Период реструктуризации превышает максимальный для ИГ и пролонгации')
				};
			}
		}
		if (!checkRestructurisationTermLimits(data['bank'], 'ig', data['product'], currentIgScenario['monthsLeftIg'])) {
			if (!checkIsRestructurisationScenarioAvailable(data['bank'], 'ig', data['product'])	) {
				return {
					'isPossible': false,
					'htmlBlock': 
						renderResultInformationAdmin('igrestr', loanId, data, standartLoanPlan, [], currentIgScenario, 'Индивидуальный график плюс реструктуризация', newResultInformationAdmin, paymentsAfterRestructurisation,
					'ИГ для данного продукта не поддерживается банком')
				};
			} else {
				return {
					'isPossible': false,
					'htmlBlock': 
						renderResultInformationAdmin('igrestr', loanId, data, standartLoanPlan, [], currentIgScenario, 'Индивидуальный график плюс реструктуризация', newResultInformationAdmin, paymentsAfterRestructurisation,
					'Период ИГ превышает максимально возможный для ИГ при пролонгации')
				};
			}
		}

		return {
			'isPossible': true,
			'priority': 2,
			'htmlBlock': 
				renderResultInformation('igrestr', loanId, data, standartLoanPlan, [], currentIgScenario, 'Индивидуальный график плюс реструктуризация', newResultInformation, paymentsAfterRestructurisation),
			'derivationFromPlanned': derivationFromPlanned
		}
	}
}
