<?php

namespace App\Mail\Auth;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class LogInNotification extends Mailable
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
            "subject" => "LARAV-REACT - Notificação de Login",
            "title" => "Olá $name,",
            "header_text" => "Você acessou o sistema no dia e hora ".$datetime,
            "footer_text" => "Se não foi você quem realizou o acesso, contate o suporte."
        ];
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->data["subject"])->view('emails.auth.login_notification')->with($this->data);
    }
}
