<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <style>
        *{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body{
            width: 100%;
            height: 100vh;
            display: flex; 
            flex-direction: column; 
            font-family: Helvetica, Arial, sans-serif;
        }

        p{
            text-align: justify;
        }

        header, footer{
            width: 100%; 
            flex-basis: 100px; 
            display: flex; 
            flex-direction: column; 
            justify-content: center; 
            align-items: center; 
            background-color: #F5F8FA; 
            color: #BBBFC3;
        }

        main{
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        section{
            width: 400px;
            color: #74787E;
        }

        .section_body{
            display: flex;
            justify-content: center;
            align-items: center;
        }
    </style>
</head>
<body>

    <header>
        <h1>ORBIO</h1>
    </header>

    <main style = "flex-grow: 1;">
        <section>
            <p style = "color: black;"><b>Olá,</b></p>
            <div class = "section_header">
                <p><b>{{ $message }}</b></p>
            </div>
            <div class = "section_body">
                <p>Email: {{ $email }}</p>
                <p>Senha: {{ $password }}</p>
                <p>Perfil: {{ $profile }}</p>
                <p>Data da criação: {{ $datetime }}</p>
            </div>
            <div class = "section_footer">
                <p>Após o primeiro acesso, a conta será ativada, e você precisará atualizar seus dados pessoais.</p>
                <p><a href = "{{ env('APP_URL') }}/acessar" >Acessar</a></p> 
            </div>
            <hr>
            <p>Atenciosamente, equipe ORBIO.</p>
        </section>
    </main>

    <footer>
        <p>&copy; Orbio. Todos os direitos reservados.</p>
    </footer>
    
</body>
</html>