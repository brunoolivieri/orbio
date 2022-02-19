<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserRegisteredEmail extends Mailable
{
    use Queueable, SerializesModels;

    private $link;
    private $name;
    private $password;

    /**
     * Método para definir os valores utilizados no email
     * Esses valores são os atributos da classe - eles são enviados para a view do email
     *
     * @return void
     */
    public function __construct($emailData)
    {   

        $this->name = $emailData["name"];
        $this->email = $emailData["email"];
        $this->password = $emailData["password"];
        $this->link = "http://127.0.0.1/:8000/acessar";

    }

    /**
     * Método para construir o email com os valores definidos no método construtor
     * A mensagem é construída, a view é definida e o email é enviado
     *
     * @return $this
     */
    public function build()
    {

        $viewData = [
            "name" => $this->name,
            "email" => $this->email,
            "password" => $this->password,
            "link" => $this->link
        ];
        
        return $this->subject("Bem vindo ".$this->name."!")->view('emails.user_registered')->with($viewData);

    }
}
