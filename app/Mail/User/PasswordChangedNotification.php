<?php

namespace App\Mail\User;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordChangedNotification extends Mailable
{
    use Queueable, SerializesModels;

    private $data = [];

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $name, string $datetime)
    {
        $this->data = [
            "subject" => env("APP_NAME")." - Senha alterada",
            "title" => "Olá $name,",
            "header_text" => "Sua senha foi alterada no dia e hora ".$datetime,
            "footer_text" => "Se não foi você quem solicitou e realizou a operação, contate o suporte."
        ];
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->data["subject"])->view('emails.user.password_changed_notification')->with($this->data);
    }
}
