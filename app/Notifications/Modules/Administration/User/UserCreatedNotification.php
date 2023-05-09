<?php

namespace App\Notifications\Modules\Administration\User;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserCreatedNotification extends Notification
{
    use Queueable;

    private $password;

    public function __construct(string $password)
    {
        $this->password = $password;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('ORBIO - Nova conta')
            ->greeting("Bem vindo " . $notifiable->first_name . "!")
            ->line("A seguir estão os dados para acesso a sua nova conta no nosso sistema.")
            ->line("Email: " . $notifiable->email)
            ->line("Senha: " . $this->password)
            ->line("Data de acesso: " . date("d-m-Y h:i:s"))
            ->action("Página de acesso", url(env("APP_URL")))
            ->line('Se não foi você quem requisitou o procedimento, ignore.');
    }
}
