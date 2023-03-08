<?php

namespace App\Notifications\Modules\Administration\User;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserCreatedNotification extends Notification
{
    use Queueable;

    private $password;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(string $password)
    {
        $this->password = $password;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
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
