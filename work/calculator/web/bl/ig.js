function restructurisationScenarioIG(loanId, data, standartLoanPlan, payment) {
	this.probabilityOfDefault = 0.7;

	this.compute = function () {
		IGScenarios = [];

		var IGPayment = payment - standartLoanPlan['AP'];
		if (IGPayment < 0) {
			return {
				'isPossible': false,
				'htmlBlock': '<tr><td colspan=6>Платежа не хватает на чистый ИГ<td></tr>'
			};
		}

		var currentIgScenario = generateIndividualSchedule(
			data['bank'],
			data['loan-sum'] - standartLoanPlan['paymentsScheduleCompiled']['realDischargedDebt'],
			standartLoanPlan['paymentsScheduleCompiled']['notPaidDebt'], 
			standartLoanPlan['paymentsScheduleCompiled']['notPaidPercents'], 
			payment, 
			standartLoanPlan['AP'], 
			data['delay-percent'], 
			data['delay'], 
			data['product'], 
			data['refinancing-rate']
		);
		IGScenarios.push(currentIgScenario);

		var paymentsAfterRestructurisation = standartLoanPlan['totalRealPayments'] 
			+ currentIgScenario['sumFullyPaid'] * this.probabilityOfDefault + 0.05 * data['changed-penalty'];
		var derivationFromPlanned = paymentsAfterRestructurisation - standartLoanPlan['totalPlannedPayments'] - restructurisationScenario['sumReserve'] * data['refinancing-rate'] 

		if (!checkRestructurisationTermLimits(data['bank'], 'ig', data['product'], currentIgScenario['monthsLeft'])) {
			if (!checkIsRestructurisationScenarioAvailable(data['bank'], 'ig', data['product'])) {
				return {
					'isPossible': false,
					'htmlBlock': 
						renderResultInformationAdmin('ig', loanId, data, standartLoanPlan, [], currentIgScenario, 'Индивидуальный график', newResultInformationAdmin, paymentsAfterRestructurisation,
					'ИГ для данного продукта не поддерживается банком')
				};
			} else {
				return {
					'isPossible': false,
					'htmlBlock': 
						renderResultInformationAdmin('ig', loanId, data, standartLoanPlan, [], currentIgScenario, 'Индивидуальный график', newResultInformationAdmin, paymentsAfterRestructurisation,
					'Период ИГ превышает максимально возможный установленный банком')
				};
			}
		}

		return {
			'isPossible': true,
			'priority': 4,
			'htmlBlock': 
				renderResultInformation('ig', loanId, data, standartLoanPlan, [], currentIgScenario, 'Индивидуальный график', newResultInformation, paymentsAfterRestructurisation),
			'derivationFromPlanned': derivationFromPlanned
		}
	}
}
