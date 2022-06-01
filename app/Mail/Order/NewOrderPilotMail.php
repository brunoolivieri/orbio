<?php

namespace App\Mail\Order;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewOrderPilotMail extends Mailable
{
    use Queueable, SerializesModels;

    private $data = [];

     /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $initial_date, string $final_date, array $creator, array $pilot, array $client, string $observation)
    {
        $this->data = [
            "subject" => "ORBIO - Nova ordem de serviço",
            "title" => "Olá ".$pilot["first_name"].",",
            "body" => [
                "initial_date" => $initial_date,
                "final_date" => $final_date,
                "creator" => $creator["fullname"],
                "pilot" => $pilot["fullname"],
                "client" => $client["fullname"]
            ]
        ];
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->data["subject"])->view('emails.order.new_order_created')->with($this->data);
    }
}
