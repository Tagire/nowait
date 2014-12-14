#!/bin/sh
cat util.js testdata.js templates.js bl/base/algorithm.js bl/base/calculator.js bl/base/individual-schedule.js bl/base/restructurisation.js bl/ig.js bl/igWithProlongation.js bl/prolongation.js bl/refinancing.js bl/completeDelayedDebtRepayment.js interface.js > compiled.js
sed -i 's/\r//g' compiled.js
