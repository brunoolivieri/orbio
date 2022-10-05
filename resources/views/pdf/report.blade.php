<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap" rel="stylesheet">
    <title>Relatório PDF</title>
</head>
<style>

    * {
        font-family: Arial, Helvetica, sans-serif;
        margin: 0;
        padding: 0;
    }

    body {
        padding: 30px;
    }

    section {
        width: 100%;
        margin-bottom: 30px;
    }

    ul,
    ol,
    li {
        list-style: none;
    }

    li {
        padding: 5px;
        font-weight: 900;
    }

    table {
        width: 100%;
        text-align: center;
        border-collapse: collapse;
    }

    table {
        border: 1px solid #333;
        margin-bottom: 35px;
    }

    th,
    td {
        background-color: #fff;
        border: 1px solid #333;
        padding: 3px;
    }

    th {
        background-color: #A0A0A0;
    }

    .top_section {
        min-height: '300px';
        max-height: fit-content;
    }

    .table_section {
        width: 100%;
    }

    .table-bottom td:first-child {
        text-align: left;
    }

    .to_left {
        text-align: left;
    }
    
</style>

<body>

    <section class="top_section">
        <ul>
            <li style="margin-bottom: 15px;"><img src="birdview.png" width="120px" height="50px" /></li>
            <li>RELATÓRIO: {{ $data['name'] }}</li>
            <li>CLIENTE: {{ $data['client'] }}</li>
            <li>REGIÃO: {{ $data['region'] }}</li>
            <li>FAZENDA: {{ $data['farm'] }}</li>
        </ul>
    </section>

    <section class="table_section">

        <table class="table-top">
            <thead>
                <tr>
                    <th>ÁREA TOTAL APLICADA (ha)</th>
                    <th>DATA DA APLICAÇÃO</th>
                    <th>NO. APLICAÇÃO</th>
                    <th>DOSAGEM/Ha</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ $data['area'] }}</td>
                    <td>{{ $data['date'] }}</td>
                    <td>{{ $data['number'] }}</td>
                    <td>{{ $data['dosage'] }}</td>
                </tr>
            </tbody>
        </table>

        @foreach ($data['tables'] as $index => $table )
            
        <table class="table-bottom">
            <thead>
                <tr>
                    <th>CONDIÇÕES CLIMÁTICAS {{ ($index+1) }} </th>
                    <th>INICIAL</th>
                    <th>FINAL</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>TEMPERATURA (°C)</td>
                    <td>{{ $table['temperature']['initial'] }}</td>
                    <td>{{ $table['temperature']['final'] }}</td>
                </tr>
                <tr>
                    <td>UMIDADE</td>
                    <td>{{ $table['humidity']['initial'] }}</td>
                    <td>{{ $table['humidity']['final'] }}</td>
                </tr>
                <tr>
                    <td>VELOCIDADE DO VENTO (Km/h)</td>
                    <td>{{ $table['wind']['initial'] }}</td>
                    <td>{{ $table['wind']['final'] }}</td>
                </tr>
                <tr>
                    <td>FORNECEDOR PRODUTO</td>
                    <td colspan="2">{{ $table['provider'] }}</td>
                </tr>
                <tr>
                    <td>RESPONSÁVEL</td>
                    <td colspan="2">{{ $table['responsible'] }}</td>
                </tr>
            </tbody>
        </table>

        @endforeach

        

    </section>

</body>

</html>