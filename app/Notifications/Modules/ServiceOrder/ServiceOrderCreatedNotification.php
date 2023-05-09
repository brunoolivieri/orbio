<?php

namespace App\Notifications\Modules\ServiceOrder;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\ServiceOrders\ServiceOrder;

class ServiceOrderCreatedNotification extends Notification
{
    use Queueable;

    private ServiceOrder $service_order;

    public function __construct(ServiceOrder $service_order)
    {
        $this->service_order = $service_order;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('ORBIO - Criação de ordem de serviço')
            ->greeting("Olá " . $notifiable->first_name . "!")
            ->line("Você está sendo notificado porque foi vinculado a uma nova ordem de serviço.")
            ->line("Data inicial: " . $this->service_order->start_date)
            ->line("Data final: " . $this->service_order->end_date)
            ->line("Número: " . $this->service_order->number)
            ->line("Observação: " . $this->service_order->observation)
            ->line("Criador: " . $this->service_order->users[0]->name)
            ->line("Piloto: " . $this->service_order->users[1]->name)
            ->line("Cliente: " . $this->service_order->users[2]->name)
            ->action("Página de acesso", url(env("APP_URL")));
    }
}
