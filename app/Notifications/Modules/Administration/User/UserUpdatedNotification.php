<?php

namespace App\Notifications\Modules\Administration\User;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserUpdatedNotification extends Notification
{
    use Queueable;

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('ORBIO - Atualização dos dados de cadastro')
            ->greeting("Olá " . $notifiable->first_name . "!")
            ->line("Você está sendo notificado porque seus dados cadastrais básicos foram atualizados.")
            ->line("Data: " . date("d-m-Y h:i:s"))
            ->action("Página de acesso", url(env("APP_URL")))
            ->line('Se não foi você quem requisitou ou realizou o procedimento, contate o suporte.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
