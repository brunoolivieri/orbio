<?php

namespace App\Notifications\Modules\ServiceOrder;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\ServiceOrders\ServiceOrder;

class ServiceOrderDeletedNotification extends Notification
{
    use Queueable;

    private $service_order;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(ServiceOrder $service_order)
    {
        $this->service_order = $service_order;
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
            ->subject('ORBIO - Deleção de ordem de serviço')
            ->greeting("Olá " . $notifiable->first_name . "!")
            ->line("Você está sendo notificado porque uma das ordens de serviço a que estava vinculado foi removida.")
            ->line("Data inicial: " . $this->service_order->start_date)
            ->line("Data final: " . $this->service_order->end_date)
            ->line("Número: " . $this->service_order->number)
            ->line("Observação: " . $this->service_order->observation)
            ->line("Criador: " . $this->service_order->users[0]->name)
            ->line("Piloto: " . $this->service_order->users[1]->name)
            ->line("Cliente: " . $this->service_order->users[2]->name)
            ->action("Página de acesso", url(env("APP_URL")));
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
