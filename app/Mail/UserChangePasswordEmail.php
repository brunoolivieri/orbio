<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserChangePasswordEmail extends Mailable
{
    use Queueable, SerializesModels;

    private $codeToSend;

    /**
     * Método para definir os valores utilizados no email
     * Esses valores são os atributos da classe - eles são enviados para a view do email
     *
     * @return void
     */
    public function __construct($code){
        $this->codeToSend = $code;
    }
    

    /**
     * Método para construir o email com os valores definidos no método construtor
     * A mensagem é construída, a view é definida e o email é enviado
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject("Código para alteração da senha")->view('emails.user_change_password')->with('code', $this->codeToSend);
    }
}
