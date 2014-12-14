function restructurisationScenarioCompleteDelayedDebtRepayment(loanId, data, standartLoanPlan, payment) {
	this.probabilityOfDefault = 0.7;

	this.compute = function () {
		if (payment >= standartLoanPlan['paymentsScheduleCompiled']['notPaidDebt'] +  standartLoanPlan['paymentsScheduleCompiled']['notPaidPercents'] + data['changed-penalty']) {
			return {
				'isPossible': true,
				'priority': 0,
				'htmlBlock': 
					renderDefaultInformation(loanId, data, standartLoanPlan, 'Полное погашение ПЗ'),
				'derivationFromPlanned': 0
			}
		} else {
			return {
				'isPossible': false,
				'htmlBlock': '<tr><td colspan=6>Недостаточно платежа для варианта с полным покрытием ПЗ</td></tr>'
			};
		}
	}
}
