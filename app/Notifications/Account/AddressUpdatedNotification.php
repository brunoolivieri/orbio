<?php

namespace App\Notifications\Account;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
// Custom
use App\Models\Users\User;

class AddressUpdatedNotification extends Notification
{
    use Queueable;

    private $user;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(User $user)
    {
        $this->user = $user;
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
            ->subject('ORBIO - Atualização do endereço')
            ->greeting("Olá " . $notifiable->first_name . "!")
            ->line("Seus dados de endereço foram atualizados.")
            ->line("Estado: " . $notifiable->personal_document->address->state)
            ->line("Cidade: " . $notifiable->personal_document->address->city)
            ->line("CEP: " . $notifiable->personal_document->address->cep)
            ->line("Logradouro: " . $notifiable->personal_document->address->address)
            ->line("Número: " . $notifiable->personal_document->address->number)
            ->line("Complemento: " . $notifiable->personal_document->address->complement)
            ->line('Se não foi você quem realizou o procedimento, contate o suporte imediatamente.');
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
