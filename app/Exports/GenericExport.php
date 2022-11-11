<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Database\Eloquent\Model;

class GenericExport implements FromCollection
{
    public function __construct(Model $model, string $limit)
    {
        $this->model = $model;
        $this->limit = $limit;
        $this->offset = 0;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        if ($this->limit === "all") {
            return $this->model->all();
        } else {
            return $this->model->skip($this->offset)->take($this->limit)->get();
        }
    }
}
