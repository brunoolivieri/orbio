<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotifyUserThatTheirDataHasBeenUpdated extends Mailable
{
    use Queueable, SerializesModels;

    private $title;
    private $name;
    private $email;
    private $date;
    private $content;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($email_data)
    {

        $this->name = $email_data["name"];
        $this->email = $email_data["email"];
        $this->date = date("d-m-Y h:i");
        $this->title = "Notificação de alteração dos dados";
        $this->content = $email_data["content"];

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
            "content" => $this->content
        ];

        return $this->subject("Olá".$this->name."!")->view('emails.user_registered')->with($view_data);

    }
}
