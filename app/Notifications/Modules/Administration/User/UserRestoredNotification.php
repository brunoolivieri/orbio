<?php

namespace App\Notifications\Modules\Administration\User;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Users\User;

class UserRestoredNotification extends Notification
{
    use Queueable;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('ORBIO - Reabilitação da conta')
            ->greeting("Olá " . $notifiable->first_name . "!")
            ->line("Você está sendo notificado porque sua conta foi reabilitada.")
            ->line("Data: " . date("d-m-Y h:i:s"))
            ->action("Página de acesso", url(env("APP_URL")))
    }
}
