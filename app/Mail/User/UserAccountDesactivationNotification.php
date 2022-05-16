<?php

namespace App\Mail\User;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserAccountDesactivationNotification extends Mailable
{
    use Queueable, SerializesModels;

    private $data = [];

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $name, string $email, string $datetime)
    {
        $this->data = [
            "subject" => env("APP_NAME")." - Desativação da conta",
            "title" => "Olá $name,",
            "header_text" => "Você está recebendo este e-mail porque recebemos um pedido de desativação temporária da sua conta.",
            "footer_text" => "Se não foi você quem solicitou, ou se foi um erro, contate o suporte para reativar a sua conta.",
            "body_text" => "O pedido foi realizado nesta data e hora: $datetime"
        ];
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->subject)->view('user.account_desactivation')->with($this->data);
    }
}
