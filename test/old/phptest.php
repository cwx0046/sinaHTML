<html>
<head>
<title>PHP ����</title>
</head>
<body>
</body>
<?php
function convert_data($data){
	$image = base64_decode(str_replace('data:image/png;base64,', '',$data)); //�ǵ�Ҫ��base64���룬����ȥ��base64��ǰ׺
	header('Content-Type: image/png');
	save_to_file($image);
}
function save_to_file($image){

	$fp = fopen("2.png", 'w');
	fwrite($fp, $image);
	fclose($fp);
}

convert_data("data:image/png;base64,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");

?>
</html>