<?php

namespace App\Notifications\Modules\ServiceOrder;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
// Custom
use App\Models\User\UserModel;

class ServiceOrderCreatedNotification extends Notification
{
    use Queueable;

    private $user;
    private $service_order_data;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(UserModel $user, array $service_order_data)
    {
        $this->user = $user;
        $this->service_order_data = $service_order_data;
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
            ->subject('ORBIO - Nova ordem de serviço')
            ->greeting("Olá ".$first_name."!")
            ->line("Você está sendo notificado porque foi vinculado a uma nova ordem de serviço.")
            ->line("Data inicial: ".$this->service_order_data["initial_date"])
            ->line("Data final: ".$this->service_order_data["final_date"])
            ->line("Criador: ".$this->service_order_data["creator"])
            ->line("Piloto: ".$this->service_order_data["pilot"])
            ->line("Cliente: ".$this->service_order_data["client"])
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
