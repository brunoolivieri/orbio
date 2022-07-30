<?php

namespace App\Notifications\Account;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
// Custom
use App\Models\User\UserModel;

class DocumentsUpdatedNotification extends Notification
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

        $first_name = explode(" ", $notifiable->name)[0];

        return (new MailMessage)
            ->subject('ORBIO - Atualização dos documentos')
            ->greeting("Olá ". $first_name."!")
            ->line("Seus dados documentais foram atualizados.")
            ->line("Habilitação ANAC: ".$notifiable->complementary_data->anac_license)
            ->line("CPF: ".$notifiable->complementary_data->cpf)
            ->line("CNPJ: ".$notifiable->complementary_data->cnpj)
            ->line("Telefone: ".$notifiable->complementary_data->telephone)
            ->line("Celular: ".$notifiable->complementary_data->cellphone)
            ->line("Razão social: ".$notifiable->complementary_data->company_name)
            ->line("Nome fantasia: ".$notifiable->complementary_data->trading_name)
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
