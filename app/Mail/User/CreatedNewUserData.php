<?php

namespace App\Mail\User;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CreatedNewUserData extends Mailable
{
    use Queueable, SerializesModels;

    private $data = [];

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $name, string $email, string $profile, string $password, string $datetime)
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
        return $this->subject($this->data["subject"])->view('emails.user.new_registered_user_data')->with($this->data);
    }
}
