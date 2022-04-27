<?php

namespace App\Mail\User;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendAccessDataToCreatedUser extends Mailable
{
    use Queueable, SerializesModels;

    private $title;
    private $message;
    private $link;
    private $datetime;
    private $name;
    private $email;
    private $profile;
    private $password;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->subject = env("APP_NAME")." - Dados de acesso";
        $this->message = "Você está recebendo este e-mail para que tenha acesso à sua nova conta no sistema ".env("APP_NAME");
        $this->name = $data["name"];
        $this->email = $data["email"];
        $this->profile = $data["profile"];
        $this->password = $data["unencrypted_password"];
        $this->datetime = $data["created_at"];
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $view_data = [
            "message" => $this->message,
            "name" => $this->name,
            "email" => $this->email,
            "profile" => $this->profile,
            "password" => $this->password,
            "datetime" => $this->datetime
        ];
        
        return $this->subject($this->subject)->view('emails.new_user_data_access')->with($view_data);
    }
}
