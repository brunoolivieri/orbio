<?php

namespace App\Mail\Auth;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TokenForChangePasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    private $data = [];

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $name, string $token, string $datetime)
    {
        $this->data = [
            "subject" => "LARAV-REACT - Código para alteração da senha",
            "title" => "Olá $name,",
            "token" => $token,
            "header_text" => "Você solicitou uma alteração da sua senha no dia e hora ".$datetime,
            "footer_text" => "Se não foi você quem solicitou a operação, contate o suporte."
        ];
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->data["subject"])->view('emails.auth.token_for_change_password')->with($this->data);
    }
}
