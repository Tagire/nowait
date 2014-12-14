function PMT(d,f,b){var e=0;var c=Math.pow((d+1),f);var a=(d*(b*c+e))/((-1+c));return a;}function NPer(d,a,g,h,c){h=h||0;c=c||0;var f;var e;var b;if(d==0&&a==0){alert("Invalid Pmt argument");return null;}else{if(d==0){return(-(g+h)/a);}else{if(d<=-1){alert("Invalid Pmt argument");return null;}}}f=(a/d);if(c==1){f*=(1+d);}e=(-h+f);b=(g+f);if((e<0)&&(b<0)){e=-e;b=0-b;}else{if((e<=0)||(b<=0)){return 999;}}totalInterestRate=e/b;return Math.log(totalInterestRate)/Math.log(d+1);}function hereDoc(a){return a.toString().replace(/^[^\/]+\/\*!?/,"").replace(/\*\/[^\/]+$/,"");}function VLOOKUP(b,d,e,h,g,c,f){var a="http://calc.mncr.ru/util.php";return parseFloat($.ajax({type:"GET",url:a,data:{method:"VLOOKUP",bank:b,file:d,column:e,rowFrom:h,rowTo:g,search:c,columnResult:f},async:false}).responseText);}function getStaticalLosses(c,a,d,e){var b="http://calc.mncr.ru/util.php";return parseFloat($.ajax({type:"GET",url:b,data:{method:"getStatisticalLosses",bank:c,termForeclosure:a,debtLeft:d,refinancingRate:e},async:false}).responseText);}function fromPercents(a){return a/100;}function toPercents(a){return(a*100)+"%";}function correctRound(b,a){var a=a||2;return Math.ceil(b*Math.pow(10,a))/Math.pow(10,a);}function parseDate(c){var d=/([0-9]{1,2})\.([0-9]{1,2})\.([0-9]{4})$/;var b=c.match(d);if(b==null){return false;}var a=new Date(b[3],b[2],b[1]);if(a=="Invalid Date"){return false;}return a;}calculateStandartLosesForReserves=function(d,c){var a=0;var b=getStaticalLosses(d.bank,d["term-foreclosure"],c.paymentsScheduleCompiled["dischargedDebt"]-c.paymentsScheduleCompiled["realDischargedDebt"],d["refinancing-rate"]);if(d["term-foreclosure"]*30>720){a=(b+(c.paymentsScheduleCompiled["dischargedDebt"]-c.paymentsScheduleCompiled["realDischargedDebt"])*d["refinancing-rate"]/365*(d["term-foreclosure"]*30-720));}else{a=(b+(c.paymentsScheduleCompiled["dischargedDebt"]-c.paymentsScheduleCompiled["realDischargedDebt"])*d["refinancing-rate"]/365*(d.delay));}return a;};function getTestData(){var a={"loan-sum":300000,"credit-term":36,percent:0.27,"contract-conclusion-date":"01.03.2013",ZT:0,delay:90,penalty:25000,"penalty-paid":200,"changed-penalty":1000,"include-percents":1,"fonding-rate-current":0.085,"fonding-rate-after-restructurisation":0.085,"term-foreclosure":6,"refinancing-rate":0.085,bank:"uralsib","delay-percent":0.27,"new-restructurisation-percent":0.27,"minimal-payment":10000,discount:0};return a;}function restructurisationInformation(){var a={uralsib:{ig:{"maximum-term":{"Автокредиты":18,"Банковские карты":0,"Ипотечное кредитование":18,"Кредиты под залог":18,"Потребительские кредиты":18,"Экспресс-кредитование":18}},prolongation:{"maximum-term":{"Автокредиты":7*12,"Банковские карты":0,"Ипотечное кредитование":30*12,"Кредиты под залог":30*12,"Потребительские кредиты":5*12,"Экспресс-кредитование":7*12}},refinancing:{"maximum-term":{"Автокредиты":5*12,"Банковские карты":5*12,"Ипотечное кредитование":0,"Кредиты под залог":5*12,"Потребительские кредиты":5*12,"Экспресс-кредитование":0}}},gazprombank:{ig:{"maximum-term":{"Автокредиты":18,"Банковские карты":0,"Ипотечное кредитование":18,"Кредиты под залог":18,"Потребительские кредиты":18,"Экспресс-кредитование":18}},prolongation:{"maximum-term":{"Автокредиты":7*12,"Банковские карты":0,"Ипотечное кредитование":30*12,"Кредиты под залог":30*12,"Потребительские кредиты":0,"Экспресс-кредитование":7*12}},refinancing:{"maximum-term":{"Автокредиты":5*12,"Банковские карты":5*12,"Ипотечное кредитование":0,"Кредиты под залог":5*12,"Потребительские кредиты":5*12,"Экспресс-кредитование":0}}}};return a;}function checkRestructurisationTermLimits(a,d,c,b){var e=restructurisationInformation();return e[a][d]["maximum-term"][c]>=b;}function checkIsRestructurisationScenarioAvailable(a,c,b){var d=restructurisationInformation();return d[a][c]["maximum-term"][b]>=0;}loanTemplate=hereDoc(function(){
/*!
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
		*/
;});standartLoanPlanTemplate=hereDoc(function(){
/*!
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
*/
;});restructurisationScenarioTemplate=hereDoc(function(){
/*!
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
*/
;});IGScenarioTemplate=hereDoc(function(){
/*!
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
*/
;});ResultInformation=hereDoc(function(){
/*!
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
*/
;});paymentScheduleTable=hereDoc(function(){
/*!
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
*/
;});paymentsScheduleTableRow=hereDoc(function(){
/*!
	<tr>
		<td><%= currentMonth %></td>
		<td><%= correctRound(loanLeftBeforePayment) %></td>
		<td><%= correctRound(monthlyPayment) %></td>
		<td><%= correctRound(percentPayment) %></td>
		<td><%= correctRound(debtPayment) %></td>
		<td><%= correctRound(debtPaid) %></td>
		<td><%= correctRound(loanLeftAfterPayment) %></td>
	</tr>
*/
;});summaryResultTable=hereDoc(function(){
/*!
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
*/
;});newResultInformation=hereDoc(function(){
/*!
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
*/
;});summaryResultTableAdmin=hereDoc(function(){
/*!
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
*/
;});newResultInformationAdmin=hereDoc(function(){
/*!
	<tr>
		<td><%= bank %></td>
		<td><%= comment %></td>
		<td><%if (restructurisationTerm !== undefined) { %><%= restructurisationTerm %>(Суммарный срок: <%= summaryCreditTerm %>)<% } else { %><%= summaryCreditTerm %> <% } %></td>
		<td><%if (APWithIG !== undefined) { %> Платеж при ИГ: <%= correctRound(APWithIG) %>, <% } %>Обычный платеж: <%= newAP %> </td>
		<td><%= restulingRestructurisationDeviationFromPlanned %></td>
		<td><%= reason %></td>
	</tr>
*/
;});loanFormat={loanId:0,debtLeft:1000,retrievingChance:0.9};generateProportions=function(c,a){sumOfLoansPaymentsLeft=0;for(var b in c){sumOfLoansPaymentsLeft+=c[b]["debtLeft"]*c[b]["retrievingChance"];}proportionsByLoan=[];for(var b in c){proportionsByLoan.push({loanId:c[b]["loanId"],payment:a*(c[b]["debtLeft"]*c[b]["retrievingChance"])/sumOfLoansPaymentsLeft});}return proportionsByLoan;};chooseBestScenarios=function(g){var b=[];var a={};var f=1000;for(var e in g){for(var d in g[e]){if(a[g[e][d]["priority"]]==undefined){a[g[e][d]["priority"]]={length:0};}a[g[e][d]["priority"]][e]=true;a[g[e][d]["priority"]]["length"]++;}}for(var c in a){if((a[c]["length"]==Object.keys(g).length)&&c<f){f=c;}}if(f==1000){return[];}for(var e in g){for(var d in g[e]){if(g[e][d]["priority"]==f){b[e]=g[e][d];}}}return b;};calculatePaymentSchedule=function(b,j,g,m,d,i,c,k,f){var l=PMT(g/12,j,b);var e=l*j;var h=new Date();var m=m;var n=Math.ceil((h.getTime()-m.getTime())/(3600*24*30*1000));var a=(j-n)<0?0:(j-n);paymentScheduleCompiling=function(r,y,B,v,C){var u=r;var o=u;var x=0;var p=0;var t=0;var q=0;var w=0;var A=0;var z=1;var s=[];do{u=o;percentPayment=u*y/12;debtPayment=B-percentPayment;p+=percentPayment;x+=debtPayment;o=r-x;if(z<=C-Math.ceil(v/30)){t=x;q=p;}if(z<=C){w=p;A=x;}s.push({currentMonth:z,loanLeftBeforePayment:u,monthlyPayment:B,percentPayment:percentPayment,debtPayment:debtPayment,debtPaid:x,loanLeftAfterPayment:o});z++;}while(o>0);return{dischargedDebt:x,sumPercentsPaid:p,realDischargedDebt:t,realPercentsPaid:q,notPaidPercents:w-q,notPaidDebt:A-t,paymentSchedule:s};};paymentScheduleCompiled=paymentScheduleCompiling(b,g,l,d,n);reportData={};reportData.AP=l;reportData.loanGivedMonthsAgo=n;reportData.loanMonthsLeft=a;reportData.paymentsCount=n-Math.ceil(d/30);reportData.paymentsScheduleCompiled=paymentScheduleCompiled;reportData.totalPlannedPayments=paymentScheduleCompiled.dischargedDebt+paymentScheduleCompiled.sumPercentsPaid;reportData.totalRealPayments=paymentScheduleCompiled.realDischargedDebt+paymentScheduleCompiled.realPercentsPaid+c;reportData.reservePool=d>721?8:VLOOKUP(f,"pull.csv",0,1,1048576,d,1);lookupstring=(d>721)?(k+721):(k+d);reportData.retrievingChance=VLOOKUP(f,"veroyatnostvziskanyaireserv.csv",3,1,1048576,lookupstring,4);reportData.penaltyPaid=c;reportData.collectorsShare=d>721?VLOOKUP(f,"pull.csv",0,1,1048576,720,2):VLOOKUP(f,"pull.csv",0,1,1048576,d,2);reportData.SumOfODReturnedByCollectors=(b-paymentScheduleCompiled.realDischargedDebt)*reportData.retrievingChance;reportData.SumOfPercentsReturnedByCollectors=(paymentScheduleCompiled.sumPercentsPaid-paymentScheduleCompiled.realPercentsPaid)*reportData.retrievingChance;reportData.SumOfPenaltyReturnedByCollectors=((i-c)*0.05*reportData.retrievingChance);reportData.SumReturnedByCollectors=reportData.SumOfODReturnedByCollectors+reportData.SumOfPercentsReturnedByCollectors+reportData.SumOfPenaltyReturnedByCollectors;reportData.RewardForCollectors=(reportData.SumOfODReturnedByCollectors+reportData.SumOfPercentsReturnedByCollectors+reportData.SumOfPenaltyReturnedByCollectors)*reportData.collectorsShare;reportData.AdjustedForecastForLoan=reportData.totalRealPayments+reportData.SumReturnedByCollectors-reportData.RewardForCollectors;reportData.RevenueDeviationFromPlanned=reportData.AdjustedForecastForLoan-reportData.totalPlannedPayments-reportData.RewardForCollectors;reportData.calculationDate=h;return reportData;};generateIndividualSchedule=function(k,u,w,s,p,g,c,v,a,t){var x=[];var f=0;var h=0;var e=0;var n=p;var m=[];var d=0;x[0]={};x[0]["debtLeft"]=u;x[0]["debtPaid"]=0;x[0]["notPaidPercents"]=s;x[0]["notPaidDebtLeft"]=w;var r=1;do{x[r]={};x[r]["loanNewSum"]=x[r-1]["notPaidDebtLeft"]+x[r-1]["debtLeft"];x[r]["loanLeftBeforePayment"]=x[r]["loanNewSum"];var l=(x[r-1]["debtLeft"]+x[r-1]["notPaidDebtLeft"])*c/12;x[r]["monthlyPayment"]=0;if(x[r-1]["notPaidPercents"]>n){x[r]["monthlyPayment"]=n;x[r]["notPaidPercents"]=x[r-1]["notPaidPercents"]-x[r]["monthlyPayment"];}else{if(x[r-1]["notPaidPercents"]>0){x[r]["monthlyPayment"]=x[r-1]["notPaidPercents"];x[r]["notPaidPercents"]=0;}else{x[r]["notPaidPercents"]=x[r-1]["notPaidPercents"];}}if(x[r]["monthlyPayment"]<n){if(n-x[r]["monthlyPayment"]<=x[r-1]["notPaidDebtLeft"]){x[r]["notPaidDebtLeft"]=x[r-1]["notPaidDebtLeft"]-(n-x[r]["monthlyPayment"]);x[r]["monthlyPayment"]=n;}else{if(x[r-1]["notPaidDebtLeft"]>0){x[r]["monthlyPayment"]+=x[r-1]["notPaidDebtLeft"];x[r]["notPaidDebtLeft"]=0;}else{x[r]["notPaidDebtLeft"]=x[r-1]["notPaidDebtLeft"];}}}else{x[r]["notPaidDebtLeft"]=x[r-1]["notPaidDebtLeft"];}x[r]["percentPayments"]=0;if(x[r]["monthlyPayment"]<n){if(l>n-x[r]["monthlyPayment"]){x[r]["percentPayments"]=n-x[r]["monthlyPayment"];x[r]["monthlyPayment"]=n;}else{x[r]["percentPayments"]=l;x[r]["monthlyPayment"]+=x[r]["percentPayments"];}}x[r]["fullPercentPayments"]=(x[r-1]["notPaidPercents"]-x[r]["notPaidPercents"])+(x[r]["percentPayments"]);x[r]["notPaidPercents"]=x[r]["notPaidPercents"]+(l-x[r]["percentPayments"]);x[r]["debtLeft"]=x[r-1]["debtLeft"];if(x[r]["monthlyPayment"]<n){if(x[r-1]["debtLeft"]>n-x[r]["monthlyPayment"]){x[r]["debtLeft"]=x[r-1]["debtLeft"]-(n-x[r]["monthlyPayment"]);x[r]["monthlyPayment"]=n;}else{if(x[r-1]["debtLeft"]>0){x[r]["monthlyPayment"]+=x[r]["debtLeft"];x[r]["debtLeft"]=0;}else{x[r]["debtLeft"]=x[r-1]["debtLeft"];}}x[r]["debtPayment"]=(x[r-1]["debtLeft"]-x[r]["debtLeft"])+(x[r-1]["notPaidDebtLeft"]-x[r]["notPaidDebtLeft"]);x[r]["debtPaid"]=x[r-1]["debtPaid"]+x[r]["debtPayment"];}else{x[r]["debtPayment"]=(x[r-1]["debtLeft"]-x[r]["debtLeft"])+(x[r-1]["notPaidDebtLeft"]-x[r]["notPaidDebtLeft"]);x[r]["debtPaid"]=x[r-1]["debtPaid"]+x[r]["debtPayment"];x[r]["notPaidDebtLeft"]+=(g-(x[r-1]["debtLeft"]-x[r]["debtLeft"]))>0?(g-x[r]["debtPayment"]):0;x[r]["debtLeft"]-=(g-(x[r-1]["debtLeft"]-x[r]["debtLeft"]))>0?(g-x[r]["debtPayment"]):0;}if(x[r]["notPaidDebtLeft"]==0){n=g;}else{d++;}x[r]["loanNewSum"]=x[r]["notPaidDebtLeft"]+x[r]["debtLeft"];x[r]["loanLeftAfterPayment"]=x[r]["loanNewSum"];f+=x[r]["fullPercentPayments"]+x[r]["debtPayment"];r++;}while(x[r-1]["debtLeft"]>0.01);x[r-1]["debtLeft"]=0;var b=r;for(var r in x){if(r==0){continue;}if(v==0){PZ=0;vl=1;}else{if(v<=30){PZ=1;vl=2;}else{if(v<=60){PZ=31;vl=3;}else{if(v<=90){PZ=61;vl=4;}else{if(v<=120){PZ=91;vl=5;}else{if(v<=180){PZ=121;vl=6;}else{if(v<=360){PZ=181;vl=7;}else{if(v<=719){PZ=361;vl=8;}else{PZ=720;vl=9;}}}}}}}}if(r==1){reservePercent=VLOOKUP(k,"stavkireservirovania.csv",2,1,54,a+PZ,3);}else{if(b>6){if(r<=6){reservePercent=VLOOKUP(k,"stavkireservirovania.csv",2,1,54,a+PZ,3);}else{if(r<=7+b-8){if(v==0){reservePercent=reservePercent;}else{if(v>360){reservePercent=1;}else{reservePercent=VLOOKUP(k,"stavkireservirovania.csv",6,1,54,a+PZ+(vl-1),7);}}}else{if(v==0){reservePercent=reservePercent;}else{if(v>360){reservePercent=1;}else{reservePercent=VLOOKUP(k,"stavkireservirovania.csv",6,1,54,a+PZ+(vl-1),7);}}}}}else{if(r<b){reservePercent=VLOOKUP(k,"stavkireservirovania.csv",2,1,54,a+PZ,3);}else{reservePercent=VLOOKUP(k,"stavkireservirovania.csv",2,1,54,a+PZ,3);}}}var o=x[r]["loanNewSum"]*reservePercent*t/365*30;h+=o;x[r]["reservePercent"]=reservePercent;x[r]["reserve"]=o;m.push({currentMonth:r,loanLeftBeforePayment:x[r]["loanLeftBeforePayment"],monthlyPayment:x[r]["monthlyPayment"],percentPayment:x[r]["fullPercentPayments"],debtPayment:x[r]["debtPayment"],debtPaid:x[r]["debtPaid"],loanLeftAfterPayment:x[r]["loanLeftAfterPayment"]});}summaryPayment=0;for(var q=1;q<=r;q++){summaryPayment+=x[q]["monthlyPayment"];}f+=0;return{data:x,summaryPayment:summaryPayment,sumReserve:h,monthsLeft:b,monthsLeftIg:b,sumFullyPaid:f,sumFullyPaid:f,AP:g,APWithIG:p,paymentSchedule:m};};function computeRestructurisationScenario(c,t,o,B,n,d,A,a,u,l){var v=t-o-B;var e=Math.ceil(NPer(d/12,n,-v));var p=PMT(d/12,e,v);var g=p;var q=0;var b=0;var i=0;var x=v;var h=0;var f=0;var z=0;var w=0;var k=0;var C=[];var j=[];var r=0;var y=0;var k=0;var m=[];for(var s=1;s<=e;s++){q=v*d/12;if(A==0){f=0;w=1;}else{if(A<=30){f=1;w=2;}else{if(A<=60){f=31;w=3;}else{if(A<=90){f=61;w=4;}else{if(A<=120){f=91;w=5;}else{if(A<=180){f=121;w=6;}else{if(A<=360){f=181;w=7;}else{if(A<=719){f=361;w=8;}else{f=720;w=9;}}}}}}}}if(s==1){g=p;reservePercent=VLOOKUP(l,"stavkireservirovania.csv",2,1,54,c+f,3);}else{if(e>6){if(s<=6){g=p;reservePercent=VLOOKUP(l,"stavkireservirovania.csv",2,1,54,c+f,3);}else{if(s<=7+e-8){g=p;if(A==0){reservePercent=reservePercent;}else{if(A>360){reservePercent=1;}else{reservePercent=VLOOKUP(l,"stavkireservirovania.csv",6,1,54,c+f+(w-1),7);}}}else{g=v+v*d/12;if(A==0){reservePercent=reservePercent;}else{if(A>360){reservePercent=1;}else{reservePercent=VLOOKUP(l,"stavkireservirovania.csv",6,1,54,c+f+(w-1),7);}}}}}else{if(s<e){g=p;reservePercent=VLOOKUP(l,"stavkireservirovania.csv",2,1,54,c+f,3);}else{g=x+x*d/12;reservePercent=VLOOKUP(l,"stavkireservirovania.csv",2,1,54,c+f,3);}}}b=g-q;i+=b;x-=b;h+=g;z=x*a/365*30;if(s==1){r=z*reservePercent;}else{if(e>6){if(s<=6){r=z*u;}else{if(s<=6+e-8){r=0.7*b*reservePercent*u/365*30+0.3*u*x*a/365*30;}else{r=0.7*b*reservePercent*u/365*30+0.3*u*x*a/365*30;}}}else{if(s<=e-3){r=z*u;}else{r=z*u;}}}C[s]={loanNewSum:v,monthlyPayment:g,percentPayments:q,debtPayment:b,sumPaid:i,paymentsLeft:x,fond:z,PZ:f,reservePercent:reservePercent,reserve:r};j[s]={fondPercent:a,refinancingPercent:u,fonding:(x)*a/365*30,PZ:f,reservePercent:reservePercent,reserve:(x)*reservePercent*u/365*30,paymentsLeft:v,monthlyPayment:g,percentPayments:q,debtPayment:b,sumPaid:i,paymentsLeft:x,refinancingPercent:u};m.push({currentMonth:s,loanLeftBeforePayment:v,monthlyPayment:g,percentPayment:q,debtPayment:b,debtPaid:i,loanLeftAfterPayment:x});y+=(x)*a/365*30,k+=(x)*reservePercent*u/365*30;v=x;}return{data:C,newData:j,sumFullyPaid:h,monthsLeft:e,AP:p,sumReserve:k,sumFonds:y,paymentSchedule:m};}function restructurisationScenarioIG(c,d,b,a){this.probabilityOfDefault=0.7;this.compute=function(){IGScenarios=[];var h=a-b.AP;if(h<0){return{isPossible:false,htmlBlock:"<tr><td colspan=6>Платежа не хватает на чистый ИГ<td></tr>"};}var e=generateIndividualSchedule(d.bank,d["loan-sum"]-b.paymentsScheduleCompiled["realDischargedDebt"],b.paymentsScheduleCompiled["notPaidDebt"],b.paymentsScheduleCompiled["notPaidPercents"],a,b.AP,d["delay-percent"],d.delay,d.product,d["refinancing-rate"]);IGScenarios.push(e);var f=b.totalRealPayments+e.sumFullyPaid*this.probabilityOfDefault+0.05*d["changed-penalty"];var g=f-b.totalPlannedPayments-restructurisationScenario.sumReserve*d["refinancing-rate"];if(!checkRestructurisationTermLimits(d.bank,"ig",d.product,e.monthsLeft)){if(!checkIsRestructurisationScenarioAvailable(d.bank,"ig",d.product)){return{isPossible:false,htmlBlock:renderResultInformationAdmin("ig",c,d,b,[],e,"Индивидуальный график",newResultInformationAdmin,f,"ИГ для данного продукта не поддерживается банком")};}else{return{isPossible:false,htmlBlock:renderResultInformationAdmin("ig",c,d,b,[],e,"Индивидуальный график",newResultInformationAdmin,f,"Период ИГ превышает максимально возможный установленный банком")};}}return{isPossible:true,priority:4,htmlBlock:renderResultInformation("ig",c,d,b,[],e,"Индивидуальный график",newResultInformation,f),derivationFromPlanned:g};};}function restructurisationScenarioIGWithProlongation(c,d,b,a,e){this.probabilityOfDefault=0.7;this.compute=function(){IGScenarios=[];var i=a*e;var f=generateIndividualSchedule(d.bank,d["loan-sum"]-b.paymentsScheduleCompiled["realDischargedDebt"],b.paymentsScheduleCompiled["notPaidDebt"],b.paymentsScheduleCompiled["notPaidPercents"],a,a*e,d["delay-percent"],d.delay,d.product,d["refinancing-rate"]);IGScenarios.push(f);var g=b.totalRealPayments+f.sumFullyPaid*this.probabilityOfDefault+0.05*d["changed-penalty"];var h=g-b.totalPlannedPayments-restructurisationScenario.sumReserve*d["refinancing-rate"];if(!checkRestructurisationTermLimits(d.bank,"prolongation",d.product,f.monthsLeft)){if(!checkIsRestructurisationScenarioAvailable(d.bank,"prolongation",d.product)){return{isPossible:false,htmlBlock:renderResultInformationAdmin("igrestr",c,d,b,[],f,"Индивидуальный график плюс реструктуризация",newResultInformationAdmin,g,"Пролонгация для данного продукта не поддерживается банком")};}else{return{isPossible:false,htmlBlock:renderResultInformationAdmin("igrestr",c,d,b,[],f,"Индивидуальный график плюс реструктуризация",newResultInformationAdmin,g,"Период реструктуризации превышает максимальный для ИГ и пролонгации")};}}if(!checkRestructurisationTermLimits(d.bank,"ig",d.product,f.monthsLeftIg)){if(!checkIsRestructurisationScenarioAvailable(d.bank,"ig",d.product)){return{isPossible:false,htmlBlock:renderResultInformationAdmin("igrestr",c,d,b,[],f,"Индивидуальный график плюс реструктуризация",newResultInformationAdmin,g,"ИГ для данного продукта не поддерживается банком")};}else{return{isPossible:false,htmlBlock:renderResultInformationAdmin("igrestr",c,d,b,[],f,"Индивидуальный график плюс реструктуризация",newResultInformationAdmin,g,"Период ИГ превышает максимально возможный для ИГ при пролонгации")};}}return{isPossible:true,priority:2,htmlBlock:renderResultInformation("igrestr",c,d,b,[],f,"Индивидуальный график плюс реструктуризация",newResultInformation,g),derivationFromPlanned:h};};}function restructurisationScenarioProlongation(c,d,b,a){this.probabilityOfDefault=0.7;this.compute=function(){restructurisationScenario=computeRestructurisationScenario(d.product,d["loan-sum"],b.paymentsScheduleCompiled["realDischargedDebt"],b.paymentsScheduleCompiled["notPaidDebt"],a,d["new-restructurisation-percent"],d.delay,d["refinancing-rate"],d["fonding-rate-after-restructurisation"],d.bank);var e=b.totalRealPayments+(b.paymentsScheduleCompiled["notPaidDebt"]+b.paymentsScheduleCompiled["notPaidPercents"]+d["changed-penalty"]+restructurisationScenario.sumFullyPaid)*this.probabilityOfDefault+0.05*d["changed-penalty"];var f=e-b.totalPlannedPayments-restructurisationScenario.sumReserve*d["refinancing-rate"];if(!checkRestructurisationTermLimits(d.bank,"prolongation",d.product,restructurisationScenario.monthsLeft+b.loanGivedMonthsAgo)){if(!checkIsRestructurisationScenarioAvailable(d.bank,"prolongation",d.product)){return{isPossible:false,htmlBlock:renderResultInformationAdmin("prolongation",c,d,b,[],restructurisationScenario,"Пролонгация(ПЗ считается погашеной до сделки)",newResultInformationAdmin,e,"Пролонгация для данного продукта не поддерживается банком")};}else{return{isPossible:false,htmlBlock:renderResultInformationAdmin("prolongation",c,d,b,[],restructurisationScenario,"Пролонгация(ПЗ считается погашеной до сделки)",newResultInformationAdmin,e,"Период реструктуризации превышает максимальный для пролонгации")};}}return{isPossible:true,priority:1,htmlBlock:renderResultInformation("prolongation",c,d,b,[],restructurisationScenario,"Пролонгация(ПЗ считается погашеной до сделки)",newResultInformation,e),derivationFromPlanned:f};};}function restructurisationScenarioRefinancing(c,d,b,a){this.probabilityOfDefault=0.7;this.compute=function(){var f=(d["loan-sum"]-b.paymentsScheduleCompiled["realDischargedDebt"]+b.paymentsScheduleCompiled["notPaidPercents"]+b.paymentsScheduleCompiled["notPaidDebt"]);restructurisationScenario=computeRestructurisationScenario(d.product,f,0,0,a,d["new-restructurisation-percent"],d.delay,d["refinancing-rate"],d["fonding-rate-after-restructurisation"],d.bank);var e=b.totalRealPayments+restructurisationScenario.sumFullyPaid*this.probabilityOfDefault+0.05*d["changed-penalty"];var g=e-b.totalPlannedPayments-restructurisationScenario.sumReserve*d["refinancing-rate"];if(!checkRestructurisationTermLimits(d.bank,"refinancing",d.product,restructurisationScenario.monthsLeft)){if(!checkIsRestructurisationScenarioAvailable(d.bank,"refinancing",d.product)){return{isPossible:false,htmlBlock:renderResultInformationAdmin("refinancing",c,d,b,[],restructurisationScenario,"Рефинансирование(ПЗ включены в сумму долга)",newResultInformationAdmin,e,"Рефинансирование для данного продукта не поддерживается банком")};}else{return{isPossible:false,htmlBlock:renderResultInformationAdmin("refinancing",c,d,b,[],restructurisationScenario,"Рефинансирование(ПЗ включены в сумму долга)",newResultInformationAdmin,e,"Период реструктуризации превышает максимальный для рефинансирования")};}}return{isPossible:true,priority:3,htmlBlock:renderResultInformation("refinancing",c,d,b,[],restructurisationScenario,"Рефинансирование(ПЗ включены в сумму долга)",newResultInformation,e),derivationFromPlanned:g};};}function restructurisationScenarioCompleteDelayedDebtRepayment(c,d,b,a){this.probabilityOfDefault=0.7;this.compute=function(){if(a>=b.paymentsScheduleCompiled["notPaidDebt"]+b.paymentsScheduleCompiled["notPaidPercents"]+d["changed-penalty"]){return{isPossible:true,priority:0,htmlBlock:renderDefaultInformation(c,d,b,"Полное погашение ПЗ"),derivationFromPlanned:0};}else{return{isPossible:false,htmlBlock:"<tr><td colspan=6>Недостаточно платежа для варианта с полным покрытием ПЗ</td></tr>"};}};}loadTestData=function(b,a){for(var c in a){document.getElementsByName("loan["+b+"]["+c+"]")[0].value=a[c];}};removeLoan=function(a){document.getElementById("loan-"+a).style.display="none";};getDataFromForm=function(b){var a={product:"","loan-sum":0,"credit-term":0,percent:0,"contract-conclusion-date":"",ZT:0,delay:0,penalty:0,"penalty-paid":0,"changed-penalty":0,"include-percents":0,"fonding-rate-current":0,"fonding-rate-after-restructurisation":0,"term-foreclosure":0,"refinancing-rate":0,bank:"","delay-percent":0,"new-restructurisation-percent":0,"minimal-payment":0,discount:0};for(var c in a){if(document.getElementsByName("loan["+b+"]["+c+"]")[0]==undefined){alert("Необходимо заполнить все поля: "+c);return;}if(typeof a[c]=="string"){a[c]=document.getElementsByName("loan["+b+"]["+c+"]")[0].value;}else{a[c]=parseFloat(document.getElementsByName("loan["+b+"]["+c+"]")[0].value);}}a["fonding-rate-after-restructurisation"]=a["delay-percent"];return a;};loansCount=0;add_loan=function(){var a=_.template(loanTemplate);document.getElementById("loans").insertAdjacentHTML("beforeend",a({id:loansCount}));loansCount++;var c=document.getElementsByClassName("fill-test-data");for(var b in c){c[b].onclick=function(d){loadTestData(d.target.dataset.id,getTestData());};}var c=document.getElementsByClassName("delete");for(var b in c){c[b].onclick=function(d){removeLoan(d.target.dataset.id);};}var c=document.getElementsByClassName("make-report-default");for(var b in c){c[b].onclick=function(d){generateStandartLoanPlan(d.target.dataset.id);};}var c=document.getElementsByClassName("make-report");for(var b in c){c[b].onclick=function(d){generateRestructurisationData(d.target.dataset.id);};}};document.getElementById("add-loan").onclick=add_loan;clearAll=function(){document.getElementById("loans").innerHTML="";clearReportView();clearModals();loansCount=0;};document.getElementById("clear-all").onclick=clearAll;clearReportView=function(){document.getElementById("loan-summary-report").innerHTML="";document.getElementById("loan-summary-report-admin").innerHTML="";};clearModals=function(){document.getElementById("modals").innerHTML="";};renderTotalResultInformation=function(f,d,e,c,b){var a=_.template(c||summaryResultTable);var b=b||"loan-summary-report";document.getElementById(b).innerHTML+=a({tableBody:f,loanId:parseInt(d)+1,totalEffect:e});};renderDefaultInformation=function(e,f,d,h){var c=_.template(newResultInformation);var h=h||"Исходный график";var b=calculateStandartLosesForReserves(f,d);var a=e+"-default";var g=renderPaymentSchedule(d.paymentsScheduleCompiled["paymentSchedule"],a);document.getElementById("modals").innerHTML+=g;return c({loanId:e,bank:f.bank,restructurisationType:"default",summaryCreditTerm:f["credit-term"],restructurisationTerm:undefined,newAP:correctRound(d.AP),APWithIG:undefined,restulingRestructurisationDeviationFromPlanned:correctRound(d.RevenueDeviationFromPlanned-b),modalId:a,comment:h});};renderResultInformation=function(i,b,d,j,g,m,f,k,e){var h=_.template(k||newResultInformation);var f=f||"";var l=b+i;var c=renderPaymentSchedule(m.paymentSchedule,l);document.getElementById("modals").innerHTML+=c;var a=e-j.totalPlannedPayments-m.sumReserve*d["refinancing-rate"];return h({loanId:b,bank:d.bank,restructurisationType:i,summaryCreditTerm:m.monthsLeft+j.loanGivedMonthsAgo,restructurisationTerm:m.monthsLeft,newAP:correctRound(m.AP),APWithIG:((m.APWithIG==undefined)?undefined:m.APWithIG),restulingRestructurisationDeviationFromPlanned:correctRound(a),modalId:l,comment:f});};renderResultInformationAdmin=function(i,b,c,j,g,l,f,k,e,d){var h=_.template(k||newResultInformation);var f=f||"";var a=e-j.totalPlannedPayments-l.sumReserve*c["refinancing-rate"];return h({loanId:b,bank:c.bank,restructurisationType:i,summaryCreditTerm:l.monthsLeft+j.loanGivedMonthsAgo,restructurisationTerm:l.monthsLeft,newAP:correctRound(l.AP),APWithIG:((l.APWithIG==undefined)?undefined:l.APWithIG),restulingRestructurisationDeviationFromPlanned:correctRound(a),comment:f,reason:d});};renderPaymentSchedule=function(e,a){var b=_.template(paymentsScheduleTableRow||ResultInformation);var c="";for(var d in e){c+=b(e[d]);}var b=_.template(paymentScheduleTable);return b({tableBody:c,modalId:a});};computeStandartLoanPlan=function(a){var c=getDataFromForm(a);var b=parseDate(c["contract-conclusion-date"]);if(!b){return false;}return calculatePaymentSchedule(c["loan-sum"],c["credit-term"],c.percent,b,c.delay,c.penalty,c["penalty-paid"],c.product,c.bank);};getAllLoansComputeSharesAndMakeAnalysis=function(){var x=document.getElementById("maximum-credit-payment").value;var v=document.getElementById("delay-paid").checked;clearReportView();clearModals();var z=[];var a=[];var i=0;var o="";var d=[];var c=[];var e=[];for(var r=0;r<loansCount;r++){if(document.getElementById("loan-"+r).style.display!="none"){var A=getDataFromForm(r);var g=PMT(A.percent/12,A["credit-term"],A["loan-sum"]);i+=g;}}if(x<i/2){alert("Суммарный платеж должен превышать 50% суммарных платежей по кредиту");return false;}for(var r=0;r<loansCount;r++){if(document.getElementById("loan-"+r).style.display!="none"){z[r]=computeStandartLoanPlan(r);if(!z[r]){alert('Неправильный формат даты, даты задается в формате "дд.мм.гггг"');return false;}a[r]={loanId:r,debtLeft:z[r]["totalPlannedPayments"]-z[r]["totalRealPayments"],retrievingChance:reportData.retrievingChance};}}loansData=generateProportions(a,x);for(var n in loansData){var s=loansData[n]["loanId"];var A=getDataFromForm(s);d[s]=[];c[s]=[];var f=calculateStandartLosesForReserves(A,z[s]);e[s]={derivationFromPlanned:correctRound(z[s]["RevenueDeviationFromPlanned"]-f),htmlBlock:renderDefaultInformation(s,A,z[s])};if(v){var k=new restructurisationScenarioCompleteDelayedDebtRepayment(s,A,z[s],loansData[n]["payment"]);var q=k.compute();if(q.isPossible){d[s].push(q);}else{c[s].push(q);}var l=new restructurisationScenarioProlongation(s,A,z[s],loansData[n]["payment"]);var q=l.compute();if(q.isPossible){d[s].push(q);}else{c[s].push(q);}}else{var m=new restructurisationScenarioRefinancing(s,A,z[s],loansData[n]["payment"]);var y=m.compute();if(y.isPossible){d[s].push(y);}else{c[s].push(y);}var u=new restructurisationScenarioIG(s,A,z[s],loansData[n]["payment"]);var p=u.compute();if(p.isPossible){d[s].push(p);}else{c[s].push(p);}var t=new restructurisationScenarioIGWithProlongation(s,A,z[s],loansData[s]["payment"],0.8);var w=t.compute();if(w.isPossible){for(var b=0.8;b<0.5;b-=0.1){var h=new restructurisationScenarioIGWithProlongation(s,A,z[s],loansData[s]["payment"],b);if(!h.isPossible){continue;}if(h.derivationFromPlanned<w.derivationFromPlanned){w=h;}}d[s].push(w);}else{c[s].push(w);}}}bestScenarios=chooseBestScenarios(d);if(bestScenarios==[]||bestScenarios.length==0){document.getElementById("loan-summary-report").innerHTML="Реструктуризация кредитов с заданными данными невозможна";}for(var j in bestScenarios){o="";o+=e[j]["htmlBlock"];o+=bestScenarios[j]["htmlBlock"];renderTotalResultInformation(o,j,-correctRound(e[j]["derivationFromPlanned"]-bestScenarios[j]["derivationFromPlanned"]));}for(var s in c){o="";for(var j in c[s]){o+=c[s][j]["htmlBlock"];}renderTotalResultInformation(o,s,null,summaryResultTableAdmin,"loan-summary-report-admin");}};document.getElementById("calculate").onclick=function(){return getAllLoansComputeSharesAndMakeAnalysis();};exportDataForDebug=function(){};