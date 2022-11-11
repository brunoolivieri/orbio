<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Database\Eloquent\Model;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Excel;

class GenericExport implements FromCollection
{
    use Exportable;

    /*
    private $fileName = 'arquivo.xlsx';

    private $writerType = Excel::XLSX;

    private $headers = [
        'Content-Type' => 'text/csv'
    ];
    */

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
