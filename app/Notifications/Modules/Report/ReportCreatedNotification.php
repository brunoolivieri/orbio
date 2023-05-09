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
        ->subject('ORBIO - Criação de relatório')
        ->greeting("Olá " . $notifiable->first_name . "!")
        ->line("Você está sendo notificado porque a ordem de serviço {$this->service_order->number}, que você está vinculado, já possui um relatório disponível.")
        ->action("Página de acesso", url(env("APP_URL")));
    }
}
