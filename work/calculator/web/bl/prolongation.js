function restructurisationScenarioProlongation(loanId, data, standartLoanPlan, payment) {
	this.probabilityOfDefault = 0.7;

	this.compute = function () {
		restructurisationScenario = computeRestructurisationScenario(
			data['product'],
			data['loan-sum'], 
			standartLoanPlan['paymentsScheduleCompiled']['realDischargedDebt'], 
			standartLoanPlan['paymentsScheduleCompiled']['notPaidDebt'], 
			payment, 
			data['new-restructurisation-percent'],
			data['delay'],
			data['refinancing-rate'],
			data['fonding-rate-after-restructurisation'],
			data['bank']
		);

		var paymentsAfterRestructurisation = standartLoanPlan['totalRealPayments'] 
			+ (standartLoanPlan['paymentsScheduleCompiled']['notPaidDebt'] + standartLoanPlan['paymentsScheduleCompiled']['notPaidPercents'] + data['changed-penalty']
			+ restructurisationScenario['sumFullyPaid']) * this.probabilityOfDefault + 0.05 * data['changed-penalty'];
		var derivationFromPlanned = paymentsAfterRestructurisation - standartLoanPlan['totalPlannedPayments'] - restructurisationScenario['sumReserve'] * data['refinancing-rate'] 

		if (!checkRestructurisationTermLimits(data['bank'], 'prolongation', data['product'], restructurisationScenario['monthsLeft'] + standartLoanPlan['loanGivedMonthsAgo'])) {
			if (!checkIsRestructurisationScenarioAvailable(data['bank'], 'prolongation', data['product'])) {
				return {
					'isPossible': false,
					'htmlBlock': 
						renderResultInformationAdmin('prolongation', loanId, data, standartLoanPlan, [], restructurisationScenario, 'Пролонгация(ПЗ считается погашеной до сделки)', newResultInformationAdmin, paymentsAfterRestructurisation,
					'Пролонгация для данного продукта не поддерживается банком')
				};
			} else {
				return {
					'isPossible': false,
					'htmlBlock': 
						renderResultInformationAdmin('prolongation', loanId, data, standartLoanPlan, [], restructurisationScenario, 'Пролонгация(ПЗ считается погашеной до сделки)', newResultInformationAdmin, paymentsAfterRestructurisation,
					'Период реструктуризации превышает максимальный для пролонгации')
				};
			}
		}

		return {
			'isPossible': true,
			'priority': 1,
			'htmlBlock': 
				renderResultInformation('prolongation', loanId, data, standartLoanPlan, [], restructurisationScenario, 'Пролонгация(ПЗ считается погашеной до сделки)', newResultInformation, paymentsAfterRestructurisation),
			'derivationFromPlanned': derivationFromPlanned
		}
	}
}
