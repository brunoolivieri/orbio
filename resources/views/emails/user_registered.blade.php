<h1>Bem vindo ao time da Embrapa/Birdview!</h1>
<p>Para realizar o seu primeiro acesso utilize esses dados de acesso: </p>
<p>Email: {{ $email }} | Senha: {{ $password }}</p>
<p>Após o primeiro acesso, será realizada a ativação da conta, e você poderá atualizar seus dados de cadastro.</p>
@isset($link)
<p><a href = "{{ $link }}">Clique aqui para realizar o seu primeiro acesso.</a></p>
@endisset 