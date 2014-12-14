function getTestData() {
	var testdata = {
		'loan-sum': 300000,
		'credit-term': 36,
		'percent': 0.27,
		'contract-conclusion-date': '01.03.2013',
		'ZT': 0,
		'delay': 90,
		'penalty': 25000,
		'penalty-paid': 200,
		'changed-penalty': 1000,
		'include-percents': 1,
		'fonding-rate-current': 0.085,
		'fonding-rate-after-restructurisation': 0.085,
		'term-foreclosure': 6,
		'refinancing-rate': 0.085,
		'bank': 'uralsib',
		'delay-percent': 0.27,
		'new-restructurisation-percent': 0.27,
		'minimal-payment': 10000,
		'discount': 0
	}
	return testdata;
}

function restructurisationInformation() {
	var restructurisations = {
		'uralsib': {
			'ig': {
				'maximum-term' : {
					'Автокредиты': 18,
					'Банковские карты': 0,
					'Ипотечное кредитование': 18,
					'Кредиты под залог': 18,
					'Потребительские кредиты': 18,
					'Экспресс-кредитование': 18,
				}
			},
			'prolongation': {
				'maximum-term' : {
					'Автокредиты': 7 * 12,
					'Банковские карты': 0,
					'Ипотечное кредитование': 30 * 12,
					'Кредиты под залог': 30 * 12,
					'Потребительские кредиты': 5 * 12,
					'Экспресс-кредитование': 7 * 12,
				}
			},
			'refinancing': {
				'maximum-term' : {
					'Автокредиты': 5 * 12,
					'Банковские карты': 5 * 12,
					'Ипотечное кредитование': 0,
					'Кредиты под залог': 5 * 12,
					'Потребительские кредиты': 5 * 12,
					'Экспресс-кредитование': 0,
				}
			}
		}, 
		'gazprombank': {
			'ig': {
				'maximum-term' : {
					'Автокредиты': 18,
					'Банковские карты': 0,
					'Ипотечное кредитование': 18,
					'Кредиты под залог': 18,
					'Потребительские кредиты': 18,
					'Экспресс-кредитование': 18,
				}
			},
			'prolongation': {
				'maximum-term' : {
					'Автокредиты': 7 * 12,
					'Банковские карты': 0,
					'Ипотечное кредитование': 30 * 12,
					'Кредиты под залог': 30 * 12,
					'Потребительские кредиты': 0,
					'Экспресс-кредитование': 7 * 12,
				}
			},
			'refinancing': {
				'maximum-term' : {
					'Автокредиты': 5 * 12,
					'Банковские карты': 5 * 12,
					'Ипотечное кредитование': 0,
					'Кредиты под залог': 5 * 12,
					'Потребительские кредиты': 5 * 12,
					'Экспресс-кредитование': 0,
				}
			}

		}
	}
	return restructurisations;
}

function checkRestructurisationTermLimits(bank, restructurisationType, product, term) {
	var restructurisationInformationData = restructurisationInformation();
	return restructurisationInformationData[bank][restructurisationType]['maximum-term'][product] >= term;
}

function checkIsRestructurisationScenarioAvailable(bank, restructurisationType, product) {
	var restructurisationInformationData = restructurisationInformation();
	return restructurisationInformationData[bank][restructurisationType]['maximum-term'][product] >= 0;
}
