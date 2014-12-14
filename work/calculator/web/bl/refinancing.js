function restructurisationScenarioRefinancing(loanId, data, standartLoanPlan, payment) {
	this.probabilityOfDefault = 0.7;

	this.compute = function () {
		//Составляем новую сумму кредита в которую включены просрочка и штрафы
		var newLoanSum = (data['loan-sum']
			- standartLoanPlan['paymentsScheduleCompiled']['realDischargedDebt']
			//+ data['changed-penalty']
			+ standartLoanPlan['paymentsScheduleCompiled']['notPaidPercents']
			+ standartLoanPlan['paymentsScheduleCompiled']['notPaidDebt']) 
			;

		restructurisationScenario = computeRestructurisationScenario(
			data['product'],
			newLoanSum, 
			0, 
			0, 
			payment, 
			data['new-restructurisation-percent'],
			data['delay'],
			data['refinancing-rate'],
			data['fonding-rate-after-restructurisation'],
			data['bank']
		);
		var paymentsAfterRestructurisation = standartLoanPlan['totalRealPayments'] 
			+ restructurisationScenario['sumFullyPaid'] * this.probabilityOfDefault + 0.05 * data['changed-penalty'];
		var derivationFromPlanned = paymentsAfterRestructurisation - standartLoanPlan['totalPlannedPayments'] - restructurisationScenario['sumReserve'] * data['refinancing-rate'] 
		//renderRestructurisationPlan(loanId, data, standartLoanPlans[loanId], [], restructurisationScenario, 'Пролонгация');

		if (!checkRestructurisationTermLimits(data['bank'], 'refinancing', data['product'], restructurisationScenario['monthsLeft'])) {
			if (!checkIsRestructurisationScenarioAvailable(data['bank'], 'refinancing', data['product'])) {
				return {
					'isPossible': false,
					'htmlBlock': 
						renderResultInformationAdmin('refinancing', loanId, data, standartLoanPlan, [], restructurisationScenario, 'Рефинансирование(ПЗ включены в сумму долга)', newResultInformationAdmin, paymentsAfterRestructurisation,
					'Рефинансирование для данного продукта не поддерживается банком')
				};
			} else {
				return {
					'isPossible': false,
					'htmlBlock': 
						renderResultInformationAdmin('refinancing', loanId, data, standartLoanPlan, [], restructurisationScenario, 'Рефинансирование(ПЗ включены в сумму долга)', newResultInformationAdmin, paymentsAfterRestructurisation,
					'Период реструктуризации превышает максимальный для рефинансирования')
				};
			}
		}
		return {
			'isPossible': true,
			'priority': 3,
			'htmlBlock': 
				renderResultInformation('refinancing', loanId, data, standartLoanPlan, [], restructurisationScenario, 'Рефинансирование(ПЗ включены в сумму долга)', newResultInformation, paymentsAfterRestructurisation),
			'derivationFromPlanned': derivationFromPlanned
		}
	}
}
