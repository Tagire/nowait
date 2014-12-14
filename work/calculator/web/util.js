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
      var remoteUrl = '/util.php';

      return parseFloat($.ajax({
          type: "GET",
          url: remoteUrl,
          data: {'method': 'VLOOKUP', 'bank': bank, 'file': file, 'column': column, 'rowFrom': rowFrom, 'rowTo': rowTo, 'search': search, 'columnResult': columnResult},
          async: false
    }).responseText); 
}

function getStaticalLosses(bank, termForeclosure, debtLeft, refinancingRate) {
      var remoteUrl = '/util.php';

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

