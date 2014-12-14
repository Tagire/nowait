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
*/});