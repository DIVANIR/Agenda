<?php





//criamos o arquivo
$arquivo = fopen('agenda.json','w');

//escrevemos no arquivo
$texto = file_get_contents('php://input');

fwrite($arquivo, $texto);
//Fechamos o arquivo após escrever nele
fclose($arquivo);
echo "DADOS GRAVADOS COM SUCESSO...";