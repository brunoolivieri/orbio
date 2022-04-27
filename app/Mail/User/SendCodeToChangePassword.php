<?php

namespace App\Mail\User;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendCodeToChangePassword extends Mailable
{
    use Queueable, SerializesModels;

    private $title;
    private $message;
    private $name;
    private $email;
    private $datetime;
    private $code;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->subject = env("APP_NAME")." - Alteração da senha de acesso";
        $this->message = "Você está recebendo este e-mail porque recebemos um pedido de redefinição de senha para sua conta.";
        $this->name = $data["name"];
        $this->email = $data["email"];
        $this->datetime = $data["datetime"];
        $this->code = $data["code"];
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {

        $view_data = [
            "message" => $this->message,
            "name" => $this->name,
            "email" => $this->email,
            "datetime" => $this->datetime,
            "code" => $this->code
        ];

        return $this->subject($this->subject)->view('emails.user_change_password')->with($view_data);
    }
}
