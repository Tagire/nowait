<?php 

/**
Все это необходимо будет выкинуть и сделать по нормальному, ведь нет чтобы предупредить о том что система будет 
многопользовательская за две недели, нет даже за день нельзя. Надо в тот же день, ну епрст.
*/
class CsvLogic {
	private $csvFiles;
	private $banks;
	private $files;

	public function __construct() {
		$this->csvFiles = array();
		$this->banks = array('uralsib', 'gazprombank');
		$this->files = array('pull.csv', 'stavkireservirovania.csv', 'veroyatnostvziskanyaireserv.csv');
	}

	function loadCsvFile($filename) {
		$fullData = array();
		if (($handle = fopen($filename, "r")) !== FALSE) {
			while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
				$fullData[] = $data;
			}
			fclose($handle);
			return $fullData;
		} else {
			return false;
		}
	}

	function checkBank($bank) {
		if (!in_array($bank, $this->banks)) {
			throw new Exception('Wrong bank');
		}
	}

	function checkFIle($file) {
		if (!in_array($file, $this->files)) {
			throw new Exception('Wrong file');
		}
	}

	private function generateFilenameFromBankAndFIle($bank, $file) {
		$this->checkBank($bank);
		$this->checkFIle($file);
		return $bank.'/'.$file;
	}

	function getCsvFIle($bank, $file) {
		if (empty($this->csvFiles[$bank][$file])) {
			$this->csvFIles[$bank][$file] = $this->loadCsvFile($this->generateFilenameFromBankAndFIle($bank, $file));
		}
		return $this->csvFIles[$bank][$file];
	}


	function VLOOKUP($bank, $file, $column, $rowFrom, $rowTo, $search, $columnResult) {
		$data = $this->getCsvFIle($bank, $file);
		for ($i = $rowFrom-1; $i < $rowTo; $i++) {
			if (strpos($data[$i][$column], $search) !== false) {
				return $data[$i][$columnResult];
			}  
		}
	}

	function IFSUM($bank, $file, $ifcallback, $rowFrom, $rowTo, $columnSum) {
		$data = $this->getCsvFIle($bank,$file);
		$sum = 0;
		for ($i = $rowFrom -1; $i <= $rowTo - 1; $i++) {
			if (!isset($data[$i])) {
				print_r($i);die();
				throw new Exception('No such data');
			}
			$sum += $ifcallback($data[$i]);
		}
		return $sum;
	}

	//Пока описываем бизнес логику прямо сдесь
	function getStatisticalLosses($bank, $termForeclosure, $debtLeft, $refinancingRate) {
	      return $this->IFSUM($bank, 'veroyatnostvziskanyaireserv.csv', function ($tdata) use ($termForeclosure, $refinancingRate, $debtLeft) {
	            if ($tdata[2] > $termForeclosure && $tdata[2] < 180) {
	                  return $debtLeft*$tdata[5]*$refinancingRate/365;
	            } else {
	                  return 0;
	            }
	      }, 1, 4326, 8);
	}
}

//Я знаю, что все это очень примитивно и вообще криво и костыльно, но другого способа перенести обработку конфигов по банкам на сервер 
//за пару часов нет

$csvLogic = new CsvLogic();

try {
	if (!isset($_GET['method'])) {
		throw new Exception('Wrong method');
	}
	switch ($_GET['method']) {
		case 'VLOOKUP': 
			$result = $csvLogic->VLOOKUP($_GET['bank'], $_GET['file'], $_GET['column'], $_GET['rowFrom'], $_GET['rowTo'], urldecode($_GET['search']), $_GET['columnResult']);
			break;
		case 'getStatisticalLosses':
			$result = $csvLogic->getStatisticalLosses($_GET['bank'], $_GET['termForeclosure'], $_GET['debtLeft'], $_GET['refinancingRate']);
			break;
		default:
			throw new Exception('Wrong method');
	} 
} catch (Exception $e) {
	header('HTTP/1.0 405 Method Not Allowed');
	echo 'Method Not Allowed';
	die();
}

echo $result;