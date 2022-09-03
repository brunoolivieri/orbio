<?php

namespace App\Mail\User;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;

class NotifyUserThatTheirDataHasBeenUpdated extends Mailable
{
    use Queueable, SerializesModels;

    private $title;
    private $name;
    private $email;
    private $content;
    private $datetime;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->name = $data["name"];
        $this->email = $data["email"];
        $this->title = "Notificação de alteração dos dados";
        $this->content = $data["content"];
        $this->datetime = Carbon::now();
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $view_data = [
            "name" => $this->name,
            "email" => $this->email,
            "date" => $this->date,
            "content" => $this->content,
            "date" => $this->datetime
        ];

        return $this->subject("Olá".$this->name."!")->view('emails.user_registered')->with($view_data);
    }
}
