<?php
	if (isset($_POST)) {
		$data = $_POST;
		$fp = fopen('letters.json', 'w');
		fwrite($fp, json_encode($data, JSON_NUMERIC_CHECK));
		fclose($fp);
		var_dump($data);
	}

?>