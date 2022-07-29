<?php

namespace App\Notifications\Account;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
// Custom
use App\Models\User\UserModel;

class AddressUpdatedNotification extends Notification
{
    use Queueable;

    private $user;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(UserModel $user)
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

        $first_name = explode($notifiable->name, " ")[0];
        
        return (new MailMessage)
            ->subject('ORBIO - Atualização do endereço')
            ->greeting("Olá ". $first_name."!")
            ->line("Seus dados de endereço foram atualizados.")
            ->line("Estado: ".$notifiable->complementary_data->address->state)
            ->line("Cidade: ".$notifiable->complementary_data->address->city)
            ->line("CEP: ".$notifiable->complementary_data->address->cep)
            ->line("Logradouro: ".$notifiable->complementary_data->address->address)
            ->line("Número: ".$notifiable->complementary_data->address->number)
            ->line("Complemento: ".$notifiable->complementary_data->address->complement)
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
