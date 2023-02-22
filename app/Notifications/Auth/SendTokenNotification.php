<?php

namespace App\Notifications\Auth;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
// Models
use App\Models\PasswordResets\PasswordReset;
use App\Models\Users\User;

class SendTokenNotification extends Notification
{
    use Queueable;

    private User $user;
    private PasswordReset $token;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(User $user, PasswordReset $token)
    {
        $this->user = $user;
        $this->token = $token;
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
            ->subject('ORBIO - Código para alteração da senha')
            ->greeting("Olá " . $notifiable->first_name . "!")
            ->line("Recebemos um pedido para alteração da sua senha.")
            ->line("Código: " . $this->token->token)
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
