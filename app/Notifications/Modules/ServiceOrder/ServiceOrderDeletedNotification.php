<?php

namespace App\Notifications\Modules\ServiceOrder;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
// Custom
use App\Models\User\UserModel;

class ServiceOrderDeletedNotification extends Notification
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
        return (new MailMessage)
            ->subject('ORBIO - Ordem de serviço removida')
            ->greeting("Olá ".$notifiable->name."!")
            ->line("Você está sendo notificado porque uma das ordens de serviço a que estava vinculado foi removida.")
            ->line("Data inicial: ".$this->service_order_data["initial_date"])
            ->line("Data final: ".$this->service_order_data["final_date"])
            ->line("Criador: ".$this->service_order_data["creator"])
            ->line("Piloto: ".$this->service_order_data["pilot"])
            ->line("Cliente: ".$this->service_order_data["client"])
            ->action("Página de acesso", url(env("APP_URL")))
            ->line('Se desconhece a origem desse e-mail, ignore.');
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
