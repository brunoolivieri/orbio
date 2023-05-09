<?php

namespace App\Notifications\Modules\Administration\User;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserDisabledNotification extends Notification
{
    use Queueable;

    private $user;

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('ORBIO - Desabilitação da conta')
            ->greeting("Olá " . $notifiable->first_name . "!")
            ->line("Você está sendo notificado que sua conta foi desabilitada no nosso sistema.")
            ->line("Data: " . date("d-m-Y h:i:s"))
            ->line('Se não foi você quem requisitou ou realizou o procedimento, contate o suporte.');
    }

}
