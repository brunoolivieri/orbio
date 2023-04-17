<?php

namespace App\Notifications\Modules\Report;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\ServiceOrders\ServiceOrder;

class ReportCreatedNotification extends Notification
{
    use Queueable;

    private ServiceOrder $service_order;

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
        ->subject('ORBIO - Criação de ordem de serviço')
        ->greeting("Olá " . $notifiable->first_name . "!")
        ->line("Você está sendo notificado porque a ordem de serviço de id {$this->service_order->id} já possui um relatório disponível.")
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
