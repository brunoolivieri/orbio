<?php

namespace App\Mail\Order;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderDeletedMail extends Mailable
{
    use Queueable, SerializesModels;

    private $data = [];

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->data = [
            "subject" => "ORBIO - Dados de acesso da nova conta",
            "title" => "Bem vindo $name!",
            "header_text" => "Uma conta foi criada para o seu uso no sistema ORBIO. Seus dados básicos são: ",
            "body" => [
                "name" => $name,
                "email" => $email,
                "profile" => $profile,
                "password" => $password,
                "created_at" => $datetime
            ]
        ];
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->data["subject"])->view('emails.user.order_deleted')->with($this->data);
    }
}
