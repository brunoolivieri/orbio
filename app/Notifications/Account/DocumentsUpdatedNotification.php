<?php

namespace App\Notifications\Account;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
// Models
use App\Models\Users\User;

class DocumentsUpdatedNotification extends Notification
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
            ->subject('ORBIO - Atualização dos documentos')
            ->greeting("Olá " . $notifiable->first_name . "!")
            ->line("Seus dados documentais foram atualizados.")
            ->line("Habilitação ANAC: " . $notifiable->personal_document->anac_license)
            ->line("CPF: " . $notifiable->personal_document->cpf)
            ->line("CNPJ: " . $notifiable->personal_document->cnpj)
            ->line("Telefone: " . $notifiable->personal_document->telephone)
            ->line("Celular: " . $notifiable->personal_document->cellphone)
            ->line("Razão social: " . $notifiable->personal_document->company_name)
            ->line("Nome fantasia: " . $notifiable->personal_document->trading_name)
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
