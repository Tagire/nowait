/**
 * Аналог функции для расчета месячного платежа из экселя
 *
 * @var ir percent
 * @var np number of payments
 * @var pv payment sum
 */
function PMT(ir, np, pv) 
{ 
      var fv = 0;
      var q = Math.pow ( (ir+1), np ) ;
      //var vPMT = ( ir * ( pv * q + fv ) ) / ( ( ir + 1 ) * ( q - 1 ) );
      var vPMT = ( ir * ( pv * q + fv ) ) / ( ( -1 + q ) );

      return vPMT; 
}

/**
 * Аналог функции для рассчета количества платежей по кредиту
 *
 */
function NPer (Rate, Pmt, PV, FV, Type) {
      
      FV=FV || 0; // default value of 0;
      Type=Type || 0; // default value of 0;
                  
      var totalIncomeFromFlow;
      var sumOfPvAndPayment;
      var currentValueOfPvAndPayment;
      
      if (Rate == 0 && Pmt == 0) {
            alert("Invalid Pmt argument");
            return null;
      }
      else if (Rate == 0)
            return (- (PV + FV) / Pmt);
      else if (Rate <= -1) {
            alert("Invalid Pmt argument");
            return null;
      }
      
      totalIncomeFromFlow = (Pmt / Rate);
      if (Type == 1) {
            totalIncomeFromFlow *= (1 + Rate);
      }

      sumOfPvAndPayment = (-FV + totalIncomeFromFlow);
      currentValueOfPvAndPayment = (PV + totalIncomeFromFlow);
      if ((sumOfPvAndPayment < 0) && (currentValueOfPvAndPayment < 0)) {
            sumOfPvAndPayment = -sumOfPvAndPayment;
            currentValueOfPvAndPayment = 0-currentValueOfPvAndPayment;
      }
      else if ((sumOfPvAndPayment <= 0) || (currentValueOfPvAndPayment <= 0)) {
            //alert("NPer cannot be calculated");
            return 999;
      }

      totalInterestRate = sumOfPvAndPayment / currentValueOfPvAndPayment;
      return Math.log(totalInterestRate) / Math.log(Rate + 1);
}

function hereDoc(f) {
    return f.toString().
          replace(/^[^\/]+\/\*!?/, '').
          replace(/\*\/[^\/]+$/, '');
}

function VLOOKUP(bank, file, column, rowFrom, rowTo, search, columnResult) {
      var remoteUrl = 'http://calc.mncr.ru/util.php';

      return parseFloat($.ajax({
          type: "GET",
          url: remoteUrl,
          data: {'method': 'VLOOKUP', 'bank': bank, 'file': file, 'column': column, 'rowFrom': rowFrom, 'rowTo': rowTo, 'search': search, 'columnResult': columnResult},
          async: false
    }).responseText); 
}

function getStaticalLosses(bank, termForeclosure, debtLeft, refinancingRate) {
      var remoteUrl = 'http://calc.mncr.ru/util.php';

      return parseFloat($.ajax({
          type: "GET",
          url: remoteUrl,
          data: {'method': 'getStatisticalLosses', 'bank': bank, 'termForeclosure': termForeclosure, 'debtLeft': debtLeft, 'refinancingRate': refinancingRate},
          async: false
    }).responseText); 
}

function fromPercents(value) {
      return value / 100;
}

function toPercents(value) {
      return (value * 100) + "%";
}

function correctRound(value, precision) {
      var precision = precision || 2;
      return Math.ceil(value * Math.pow(10, precision)) / Math.pow(10, precision);
}

function parseDate(dateString) {
      var dateExpr = /([0-9]{1,2})\.([0-9]{1,2})\.([0-9]{4})$/;
      var dateArr = dateString.match(dateExpr);
      if (dateArr == null) {
            return false;
      }
      var date = new Date(dateArr[3], dateArr[2], dateArr[1]);
      if (date == 'Invalid Date') {
            return false;
      }
      return date;
}

calculateStandartLosesForReserves = function (data, standartLoanPlan) {
      var standartLossesForReserves = 0;

      var statisticalLosses = getStaticalLosses(data['bank'], data['term-foreclosure'], standartLoanPlan['paymentsScheduleCompiled']['dischargedDebt']-standartLoanPlan['paymentsScheduleCompiled']['realDischargedDebt'], data['refinancing-rate']);

      if (data['term-foreclosure']*30 > 720) {
            standartLossesForReserves = (statisticalLosses + (standartLoanPlan['paymentsScheduleCompiled']['dischargedDebt'] - standartLoanPlan['paymentsScheduleCompiled']['realDischargedDebt']) *
                  data['refinancing-rate']/365 * (data['term-foreclosure'] * 30 - 720));
      } else {
            standartLossesForReserves = (statisticalLosses + (standartLoanPlan['paymentsScheduleCompiled']['dischargedDebt'] - standartLoanPlan['paymentsScheduleCompiled']['realDischargedDebt']) *
                  data['refinancing-rate']/365 * (data['delay']));
      }
      return standartLossesForReserves;
}

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
loanTemplate = hereDoc(function() { /*!
	<li class="well" id="loan-<%= id %>">
		<button class="fill-test-data" data-id="<%= id %>">Заполнить тестовыми данными</button>
		<button class="delete" data-id="<%= id %>">Удалить</button>

		<form class="form-horizontal" role="form">
		<h2>Добавление нового кредита</h3>
			<fieldset>
			<legend>Данные по кредиту</legend>
				<div class="form-group form-group-sm">
					<label for="" class="col-sm-3 control-label">Продукт кредитования</label>
					<div class="col-sm-9">
						<select name="loan[<%= id %>][product]" id="" class="form-control" placeholder="Продукт кредитования">
							 <option value="Автокредиты" selected>Автокредиты</option>
							 <option value="Банковские карты">Банковские карты</option>
							 <option value="Ипотечное кредитование">Ипотечное кредитование</option>
							 <option value="Кредиты под залог">Кредиты под залог</option>
							 <option value="Потребительские кредиты">Потребительские кредиты</option>
							 <option value="Экспресс-кредитование">Экспресс кредитование</option>
						</select>
					</div>
				</div>
				<div class="form-group form-group-sm">
					<label for="" class="col-sm-3 control-label">Сумма выдачи кредита</label>
					<div class="col-sm-9">
						<input name="loan[<%= id %>][loan-sum]" id="" class="form-control" placeholder="Сумма выдачи кредита"></input>
					</div>
				</div>
				<div class="form-group form-group-sm">
					<label for="" class="col-sm-3 control-label">Срок кредита в месяцах</label>
					<div class="col-sm-9">
						<input name="loan[<%= id %>][credit-term]" id="" class="form-control" placeholder="Срок кредита в месяцах"></input>
					</div>
				</div>
				<div class="form-group form-group-sm">
					<label for="" class="col-sm-3 control-label">Ставка по кредиту</label>
					<div class="col-sm-9">
						<input name="loan[<%= id %>][percent]" id="" class="form-control" placeholder="Ставка по кредиту"></input>
					</div>
				</div>
				<div class="form-group form-group-sm">
					<label for="" class="col-sm-3 control-label">Дата заключения договора</label>
					<div class="col-sm-9">
						<input name="loan[<%= id %>][contract-conclusion-date]" id="" class="form-control" placeholder="Дата заключения договора"></input>
					</div>
				</div>
				<div class="form-group form-group-sm" style="display:none">
					<label for="" class="col-sm-3 control-label">Выставлено ЗТ</label>
					<div class="col-sm-9">
						<input name="loan[<%= id %>][ZT]" id="" type="checkbox" class="form-control" placeholder="Выставлено ЗТ"></input>
					</div>
				</div>
				<div class="form-group form-group-sm">
					<label for="" class="col-sm-3 control-label">Срок просрочки в днях (Справедливой)</label>
					<div class="col-sm-9">
						<input name="loan[<%= id %>][delay]" id="" class="form-control" placeholder="Срок просрочки в днях (Справедливой)"></input>
					</div>
				</div>
				<div class="form-group form-group-sm">
					<label for="" class="col-sm-3 control-label">Размер начисленных штрафов</label>
					<div class="col-sm-9">
						<input name="loan[<%= id %>][penalty]" id="" class="form-control" placeholder="Размер начисленных штрафов"></input>
					</div>
				</div>
				<div class="form-group form-group-sm">
					<label for="" class="col-sm-3 control-label">Размер фактических поступлений по штрафам</label>
					<div class="col-sm-9">
						<input name="loan[<%= id %>][penalty-paid]" id="" class="form-control" placeholder="Размер фактических поступлений по штрафам"></input>
					</div>
				</div>
				<div class="form-group form-group-sm">
					<label for="" class="col-sm-3 control-label">Срок взыскания в стандартном сценарии в месяцах</label>
					<div class="col-sm-9">
						<input name="loan[<%= id %>][term-foreclosure]" id="" class="form-control" placeholder="Срок взыскания в стандартном сценарии в месяцах"></input>
					</div>
				</div>
			</fieldset>
			<fieldset>
				<legend>Реструктуризация</legend>
				<div class="form-group form-group-sm">
					<label for="" class="col-sm-3 control-label">Измененный размер штрафов в рублях</label>
					<div class="col-sm-9">
						<input name="loan[<%= id %>][changed-penalty]" id="" class="form-control" placeholder="Измененный размер штрафов в рублях"></input>
					</div>
				</div>
				<div class="form-group form-group-sm" style="display:none">
					<label for="" class="col-sm-3 control-label">Включить проценты в сумму кредита или погашение до реструктуризации</label>
					<div class="col-sm-9">
						<input name="loan[<%= id %>][include-percents]" id="" type="checkbox" class="form-control"></input>
					</div>
				</div>
				<div class="form-group">
					<label for="" class="col-sm-3 control-label">Ставка рефинансирования</label>
					<div class="col-sm-9">
						<input name="loan[<%= id %>][refinancing-rate]" id="" class="form-control" placeholder="Ставка рефинансирования"></input>
					</div>
				</div>
			</fieldset>
			<fieldset style="display:none">
				<legend>Фондирование</legend>
				<div class="form-group form-group-sm" style="display:none">
					<label for="" class="col-sm-3 control-label">Ставка фондирования текущая</label>
					<div class="col-sm-9">
						<input name="loan[<%= id %>][fonding-rate-current]" id="" class="form-control" placeholder="Ставка фондирования текущая"></input>
					</div>
				</div>
				<div class="form-group form-group-sm" style="display:none">
					<label for="" class="col-sm-3 control-label">Ставка фондирования при реструктуризации (например увеличение при пролонгации)</label>
					<div class="col-sm-9">
						<input name="loan[<%= id %>][fonding-rate-after-restructurisation]" id="" class="form-control" placeholder="Ставка фондирования при реструктуризации (например увеличение при пролонгации)"></input>
					</div>
				</div>
				
			</fieldset>
			<fieldset>
				<legend>Банк выдавший кредит</legend>
				<select name="loan[<%= id %>][bank]">Банк выдавший кредит
					<option value="uralsib" selected>Uralsib</option>
					<option value="gazprombank">GazPromBank</option>
				</select>
			</fieldset>
			<fieldset>
				<legend>Настройка общих условий реструктуризации для кредита</legend>
				<div class="form-group">
					<label for="" class="col-sm-3 control-label">Годовая процентная ставка</label>
					<div class="col-sm-9">
						<input name="loan[<%= id %>][new-restructurisation-percent]" id="" class="form-control" placeholder=""></input>
					</div>
				</div>
				<div class="form-group">
					<label for="" class="col-sm-3 control-label">Сумма дисконта к списанию</label>
					<div class="col-sm-9">
						<input name="loan[<%= id %>][discount]" id="" class="form-control" placeholder=""></input>
					</div>
				</div>
				<h3 style="display:none">Условия ИГ</h3>
				<div class="form-group" style="display:none">
					<label for="" class="col-sm-3 control-label">Минимальный ежемесячный платеж</label>
					<div class="col-sm-9">
						<input name="loan[<%= id %>][minimal-payment]" id="" class="form-control" placeholder=""></input>
					</div>
				</div>
				<div class="form-group">
					<label for="" class="col-sm-3 control-label">Годовая процентная ставка на просрочку</label>
					<div class="col-sm-9">
						<input name="loan[<%= id %>][delay-percent]" id="" class="form-control" placeholder=""></input>
					</div>
				</div>
				</div>
			</fieldset>
		</form>

		<div class="well" style="display:none">
			<button class="make-report-default" data-id="<%= id %>">Сформировать отдельный расчет</button>
			<button class="make-report" data-id="<%= id %>">Сформировать отдельный расчет c реструктуризацией</button>
		</div>

		<p class="well" id="loan-report-<%= id %>" style="display:none"></p>

		</li>
		*/});

standartLoanPlanTemplate = hereDoc(function() { /*!
	<h3>Дата расчета	<%= calculationDate %></h3>
	<ul class="statistic">
	<br><li>Плановые поступления ОД по кредиту	 <%= correctRound(paymentsScheduleCompiled['dischargedDebt']) %>   
	<br><li>Плановые поступления % по кредиту	 <%= correctRound(paymentsScheduleCompiled['sumPercentsPaid']) %>   
	<br><li>Плановые поступления Итого	    <%= correctRound(totalPlannedPayments) %>
	<br><li>Кол-во месяцев с момента выдачи кредита	 <%= loanGivedMonthsAgo %>
	<br><li>Остаток месяцев до конца срока договора	  <%= loanMonthsLeft %> 
	<br><li>Кол-во закрытых платежей по кредиту	   <%= paymentsCount %>
	<br><li>Размер фактических поступлений по %	    <%= correctRound(paymentsScheduleCompiled['realPercentsPaid']) %>
	<br><li>Размер фактических поступлений по ОД (без учета суммы досрочного гашения)	 <%= correctRound(paymentsScheduleCompiled['realDischargedDebt']) %>
	<br><li>Размер фактических поступлений по штрафам	 <%= penaltyPaid %>
	<br><li>Итого фактические поступления по кредиту	  <%= correctRound(totalRealPayments) %>  
	<br><li>Пул для резерва	 <%= reservePool %>
	<br><li>Вероятность взыскания по стандартному сценарию	<%= retrievingChance %>

	<br><li>Размер вознаграждения коллектора/ собственные издержки	<%= collectorsShare %>
	<br><li>Сумма ОД возвращенная коллектором	 <%= correctRound(SumOfODReturnedByCollectors) %>
	<br><li>Сумма % возвращенная коллектором	 <%= correctRound(SumOfPercentsReturnedByCollectors) %>
	<br><li>Сумма штрафов возвращенная коллектором	 <%= correctRound(SumOfPenaltyReturnedByCollectors) %>
	<br><li>Итог взысканный коллектором	  <%= correctRound(SumReturnedByCollectors) %>
	<br><li>Сумма вознаграждения (без учета %)	 <%= correctRound(RewardForCollectors) %>
	<br><li>Скорректированный прогноз поступлений по кредиту	<%= correctRound(AdjustedForecastForLoan) %>
	<br><li>Отклонение от запланированного уровня поступлений	<%= correctRound(RevenueDeviationFromPlanned) %>
	</ul>
*/});

restructurisationScenarioTemplate = hereDoc(function () {/*!
	<h3>Кредит №<%= loanId %></h3>
	<p> <%= comment %> </p>
	<ul class="statistic">
		<li>Текущая ставка по кредиту <span><%= percent %></span>
		<br><li>Новая ставка по кредиту	<span><%= newPercent %></span>
		<br><li>Размер первоначального ежемесячного платежа<span><%= AP %></span>
		<br><li>Размер измененного ежемесячного платежа	<span><%= newAP %></span>
		<br><li>Плановые поступления ОД по новому кредиту <span><%= plannedDebtPayments %></span>
		<br><li>Плановые поступления % по новому кредиту<span><%= plannedPercentPayments %></span>
		<br><li>Текущий остаток месяцев до конца срока договора <span><%= currentCreditTermLeft %></span>
		<br><li>Измененный остаток месяцев до конца срока договора<span> <%= newCreditTermLeft %></span>
		<br><li>Общий срок кредита с учетом реструктуризации <span><%= summaryCreditTerm %></span>
		<br><li>Текущий размер штрафов в рублях <span><%= currentPenalty %></span>
		<br><li>Измененный размер штрафов  в рублях <span><%= newPenalty %></span>
		<br><li>Неоплаченные проценты по кредиту <span><%= notPaidPercents %></span>
		<br><li>Сумма плановых поступлений по новому графику <span><%= plannedSumPayments %></span>
		<br><li>Отклонение от запланированного уровня поступлений <span><%= revenueDeviationFromPlanned %></span>
	</ul>
*/});

IGScenarioTemplate = hereDoc(function () {/*!
	<h4><%= comment %></h4>
	<ul class="statistic">
		<li>Текущая ставка по кредиту <span><%= percent %></span>
		<br><li>Новая ставка по кредиту	<span><%= newPercent %></span>
		<br><li>Размер первоначального ежемесячного платежа<span><%= AP %></span>
		<br><li>Размер измененного ежемесячного платежа	<span><%= newAP %></span>
		<br><li>Плановые поступления ОД по новому кредиту <span><%= plannedDebtPayments %></span>
		<br><li>Плановые поступления % по новому кредиту<span><%= plannedPercentPayments %></span>
		<br><li>Текущий остаток месяцев до конца срока договора <span><%= currentCreditTermLeft %></span>
		<br><li>Измененный остаток месяцев до конца срока договора<span> <%= newCreditTermLeft %></span>
		<br><li>Общий срок кредита с учетом реструктуризации <span><%= summaryCreditTerm %></span>
		<br><li>Текущий размер штрафов в рублях <span><%= currentPenalty %></span>
		<br><li>Измененный размер штрафов  в рублях <span><%= newPenalty %></span>
		<br><li>Неоплаченные проценты по кредиту <span><%= notPaidPercents %></span>
		<br><li>Сумма плановых поступлений по новому графику <span><%= plannedSumPayments %></span>
		<br><li>Отклонение от запланированного уровня поступлений <span><%= revenueDeviationFromPlanned %></span>
	</ul>
*/});

ResultInformation = hereDoc(function () {/*!
	<h4>Выводы</h4>
	<ul class="statistic">
		<br><li>Итого отклонение от изначального плана при стандартном сценарии <span><%= standartDeviationFromPlanned  %></span>
		<br><li>Итого отклонение от изначального плана при реструктуризации <span><%= restructurisationDeviationFromPlanned  %></span>
		<br><li>Срок взыскания в сценарии реструктуризации <span><%= restructurisationTerm  %></span>
	</ul>
	<h4>Выводы с учетом фондирования</h4>
	<ul class="statistic">
		<br><li>Итого отклонение от изначального плана при стандартном сценарии <span><%= standartDeviationFromPlannedWithFonds %></span>
		<br><li>Итого отклонение от изначального плана при реструктуризации <span><%= restructurisationDeviationFromPlannedWithFonds %></span>
	</ul>
	<h4>Выводы с учетом фондирования и резервов</h4>
	<ul class="statistic">
		<br><li>Потери от отвлечения ресурсов на резервы при стандартном сценарии <span><%= standartLossesForReserves %></span>
		<br><li>Потери от отвлечения ресурсов на резервы  в случае реструктуризации <span><%= restructurisationLossesForReserves %></span>
	</ul>
	<h4>Итого</h4>
	<ul class="statistic">
		<br><li>Итого отклонение от изначального плана при стандартном сценарии <span><%= resultingStandartDeviationFromPlanned %></span>
		<br><li>Итого отклонение  от изначального плана при реструктуризации <span><%= restulingRestructurisationDeviationFromPlanned %></span>
	</ul>
*/});

paymentScheduleTable = hereDoc(function () {/*!
	<div class="modal fade bs-example-modal-big" id="show-graph-<%= modalId %>" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	  <div class="modal-dialog modal-lg">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Закрыть</span></button>
	        <h4 class="modal-title" id="myModalLabel">График платежей</h4>
	      </div>
	      <div class="modal-body">
	            <table class="table table-bordered">
			<thead>
				<th>Месяц</th>
				<th>Остаток до платежа</th>
				<th>Ежемесячный платеж(по графику)</th>
				<th>В том числе выплата процентов</th>
				<th>В том числе выплата долга</th>
				<th>Погашенный долг</th>
				<th>Остаток долга после платежа</th>
			</thead>
			<tbody>
				<%= tableBody %>
			</tbody>
		</table>
	      </div>
	      <div class="modal-footer">
	        <!-- <button type="button" class="btn btn-default" >Скачать</button> -->
	        <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>
	      </div>
	    </div>
	  </div>
	</div>
*/});

paymentsScheduleTableRow = hereDoc(function () {/*!
	<tr>
		<td><%= currentMonth %></td>
		<td><%= correctRound(loanLeftBeforePayment) %></td>
		<td><%= correctRound(monthlyPayment) %></td>
		<td><%= correctRound(percentPayment) %></td>
		<td><%= correctRound(debtPayment) %></td>
		<td><%= correctRound(debtPaid) %></td>
		<td><%= correctRound(loanLeftAfterPayment) %></td>
	</tr>
*/})

summaryResultTable = hereDoc(function () {/*!
	<h3>Кредит №<%= loanId %></h3>
	<table class="table table-bordered">
		<thead>
			<th>Банк</th>
			<th>Тип реструктуризации</th>
			<th>Срок реструктуризации</th>
			<th>Платеж</th>
			<th>Эффект</th>
			<th>График платежей</th>
		</thead>
		<tbody>
			<%= tableBody %>
		</tbody>
	</table>
	<h4>Реструктуризация выгоднее изначального сценария на <%= totalEffect %> рублей.</h4>
*/});

newResultInformation = hereDoc(function () {/*!
	<tr>
		<td><%= bank %></td>
		<td><%= comment %></td>
		<td><%if (restructurisationTerm !== undefined) { %><%= restructurisationTerm %>(Суммарный срок: <%= summaryCreditTerm %>)<% } else { %><%= summaryCreditTerm %> <% } %></td>
		<td><%if (APWithIG !== undefined) { %> Платеж при ИГ: <%= correctRound(APWithIG) %>, <% } %>Обычный платеж: <%= newAP %> </td>
		<td><%= restulingRestructurisationDeviationFromPlanned %></td>
		<td>
			<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#show-graph-<%= modalId %>">
			  График платежей
			</button>
		</td>
	</tr>
*/});

summaryResultTableAdmin = hereDoc(function () {/*!
	<h3>Кредит №<%= loanId %></h3>
	<table class="table table-bordered">
		<thead>
			<th>Банк</th>
			<th>Тип реструктуризации</th>
			<th>Срок реструктуризации</th>
			<th>Платеж</th>
			<th>Эффект</th>
			<th>Причина почему неподходит</th>
		</thead>
		<tbody>
			<%= tableBody %>
		</tbody>
	</table>
*/});


newResultInformationAdmin = hereDoc(function () {/*!
	<tr>
		<td><%= bank %></td>
		<td><%= comment %></td>
		<td><%if (restructurisationTerm !== undefined) { %><%= restructurisationTerm %>(Суммарный срок: <%= summaryCreditTerm %>)<% } else { %><%= summaryCreditTerm %> <% } %></td>
		<td><%if (APWithIG !== undefined) { %> Платеж при ИГ: <%= correctRound(APWithIG) %>, <% } %>Обычный платеж: <%= newAP %> </td>
		<td><%= restulingRestructurisationDeviationFromPlanned %></td>
		<td><%= reason %></td>
	</tr>
*/});/*
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
}/**
Класс содержащий описание логики работы калькулятора.
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
generateIndividualSchedule = function (bank, debtLeft, notPaidDebt, notPaidPercents, APWithIg, APWithoutIg, newPercent, delay, product, refinancingPercent) {
	var data = [];
	var sumFullyPaid = 0;
	var sumReserve = 0;

	var monthlyPayment = 0;
	var minimalPayment = APWithIg;
	var paymentSchedule = [];
	var monthsLeftIg = 0;
	data[0] = {};
	data[0]['debtLeft'] = debtLeft;
	data[0]['debtPaid'] = 0;
	data[0]['notPaidPercents'] = notPaidPercents;
	data[0]['notPaidDebtLeft'] = notPaidDebt;

	var i = 1;
	do {
		data[i] = {};
		data[i]['loanNewSum'] = data[i-1]['notPaidDebtLeft'] + data[i-1]['debtLeft'];
		data[i]['loanLeftBeforePayment'] = data[i]['loanNewSum'];

		var currentPercents = (data[i-1]['debtLeft'] + data[i-1]['notPaidDebtLeft']) * newPercent / 12;
		data[i]['monthlyPayment'] = 0;

		if (data[i-1]['notPaidPercents'] > minimalPayment) {
			data[i]['monthlyPayment'] = minimalPayment;
			data[i]['notPaidPercents'] = data[i-1]['notPaidPercents'] - data[i]['monthlyPayment'];
		} else if (data[i-1]['notPaidPercents'] > 0){
			data[i]['monthlyPayment'] = data[i-1]['notPaidPercents'];
			data[i]['notPaidPercents'] = 0;
		} else {
			data[i]['notPaidPercents'] = data[i-1]['notPaidPercents'];
		}

		if (data[i]['monthlyPayment'] < minimalPayment) {
			if (minimalPayment - data[i]['monthlyPayment'] <= data[i-1]['notPaidDebtLeft']) {
				data[i]['notPaidDebtLeft'] = data[i-1]['notPaidDebtLeft'] - (minimalPayment - data[i]['monthlyPayment']);
				data[i]['monthlyPayment'] = minimalPayment;
			} else if (data[i-1]['notPaidDebtLeft'] > 0){
				data[i]['monthlyPayment'] += data[i-1]['notPaidDebtLeft'];
				data[i]['notPaidDebtLeft'] = 0;
			} else {
				data[i]['notPaidDebtLeft'] = data[i-1]['notPaidDebtLeft'];
			}
		} else {
			data[i]['notPaidDebtLeft'] = data[i-1]['notPaidDebtLeft'];
		}

		data[i]['percentPayments'] = 0;
		if (data[i]['monthlyPayment'] < minimalPayment) {
			if (currentPercents > minimalPayment - data[i]['monthlyPayment']) {
				data[i]['percentPayments'] = minimalPayment - data[i]['monthlyPayment'];
				data[i]['monthlyPayment'] = minimalPayment;
			} else {
				data[i]['percentPayments'] = currentPercents;
				data[i]['monthlyPayment'] += data[i]['percentPayments'];
			}
		}
		data[i]['fullPercentPayments'] = (data[i-1]['notPaidPercents'] - data[i]['notPaidPercents']) + (data[i]['percentPayments']);

		data[i]['notPaidPercents'] = data[i]['notPaidPercents'] + (currentPercents - data[i]['percentPayments']);

		data[i]['debtLeft'] = data[i-1]['debtLeft'];
		if (data[i]['monthlyPayment'] < minimalPayment) {
			if (data[i-1]['debtLeft'] > minimalPayment - data[i]['monthlyPayment']) {
				data[i]['debtLeft'] = data[i-1]['debtLeft'] - (minimalPayment - data[i]['monthlyPayment']);
				data[i]['monthlyPayment'] = minimalPayment;
			} else if (data[i-1]['debtLeft'] > 0){
				data[i]['monthlyPayment'] += data[i]['debtLeft'];
				data[i]['debtLeft'] = 0;
			} else {
				data[i]['debtLeft'] = data[i-1]['debtLeft'];
			}
			data[i]['debtPayment'] = (data[i-1]['debtLeft'] - data[i]['debtLeft']) + (data[i-1]['notPaidDebtLeft'] - data[i]['notPaidDebtLeft']);
			data[i]['debtPaid'] = data[i-1]['debtPaid'] + data[i]['debtPayment'];
		} else {
			data[i]['debtPayment'] = (data[i-1]['debtLeft'] - data[i]['debtLeft']) + (data[i-1]['notPaidDebtLeft'] - data[i]['notPaidDebtLeft']);
			data[i]['debtPaid'] = data[i-1]['debtPaid'] + data[i]['debtPayment'];
			data[i]['notPaidDebtLeft'] += (APWithoutIg - (data[i-1]['debtLeft'] - data[i]['debtLeft'])) > 0?(APWithoutIg - data[i]['debtPayment']):0;
			data[i]['debtLeft'] -= (APWithoutIg - (data[i-1]['debtLeft'] - data[i]['debtLeft'])) > 0?(APWithoutIg - data[i]['debtPayment']):0;
		}

		if (data[i]['notPaidDebtLeft'] == 0) {
			minimalPayment = APWithoutIg;
		} else {
			monthsLeftIg++;
		}

		data[i]['loanNewSum'] = data[i]['notPaidDebtLeft'] + data[i]['debtLeft'];
		data[i]['loanLeftAfterPayment'] = data[i]['loanNewSum'];
		sumFullyPaid += data[i]['fullPercentPayments'] + data[i]['debtPayment'];

		i++;
	} while (data[i-1]['debtLeft'] > 0.01); 
	data[i-1]['debtLeft'] = 0; //Временный фикс на этап перехода к числам с фиксированной запятой

	var restructurisationMonths = i;

	for (var i in data) {
		if (i==0) {
			continue;
		}
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

		if (i == 1) {
			reservePercent = VLOOKUP(bank, 'stavkireservirovania.csv', 2, 1, 54, product + PZ, 3);
		} else if (restructurisationMonths > 6) {
			if (i <= 6) {
				reservePercent = VLOOKUP(bank, 'stavkireservirovania.csv', 2, 1, 54,  product  + PZ, 3);
			} else if (i <= 7 + restructurisationMonths - 8) {
				if (delay == 0) {
					reservePercent = reservePercent; //Оставляем старый
				} else if (delay > 360) {
					reservePercent = 1; //100%
				} else {
					reservePercent = VLOOKUP(bank, 'stavkireservirovania.csv', 6, 1, 54, product + PZ + (vl-1), 7);
				}
			} else {
				if (delay == 0) {
					reservePercent = reservePercent; //Оставляем старый
				} else if (delay > 360) {
					reservePercent = 1; //100%
				} else {
					reservePercent = VLOOKUP(bank, 'stavkireservirovania.csv', 6, 1, 54, product + PZ + (vl-1), 7);
				}
			}
		} else {
			if (i < restructurisationMonths) {
//				reservePercent = VLOOKUP(data['product'] + PZ);
				reservePercent = VLOOKUP(bank, 'stavkireservirovania.csv', 2, 1, 54, product + PZ, 3);
			} else {
//				reservePercent = VLOOKUP(data['product'] + PZ);
				reservePercent = VLOOKUP(bank, 'stavkireservirovania.csv', 2, 1, 54, product + PZ, 3);
			}
		}

		var reserve = data[i]['loanNewSum'] * reservePercent * refinancingPercent / 365 * 30;
	 	sumReserve += reserve; //Рассчет резерва непонятный, проценты умножаются что многократно снижает цифры

	 	data[i]['reservePercent'] = reservePercent;
 		data[i]['reserve'] = reserve;

		paymentSchedule.push({
			'currentMonth': i,
			'loanLeftBeforePayment': data[i]['loanLeftBeforePayment'],
			'monthlyPayment':  data[i]['monthlyPayment'],
			'percentPayment': data[i]['fullPercentPayments'],
			'debtPayment': data[i]['debtPayment'],
			'debtPaid': data[i]['debtPaid'],
			'loanLeftAfterPayment': data[i]['loanLeftAfterPayment'],
		});
	}

	summaryPayment = 0;
	for (var j = 1; j <= i; j++) {
		summaryPayment += data[j]['monthlyPayment'];
	}
	sumFullyPaid += 0;

	return {
		'data': data,
		'summaryPayment': summaryPayment,
		'sumReserve': sumReserve,
		'monthsLeft': restructurisationMonths,
		'monthsLeftIg': restructurisationMonths,
		'sumFullyPaid': sumFullyPaid,
		'sumFullyPaid': sumFullyPaid,
		'AP': APWithoutIg,
		'APWithIG': APWithIg,
		'paymentSchedule': paymentSchedule
	};
}
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
			'loanLeftAfterPayment': paymentsLeft
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