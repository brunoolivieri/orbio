<?php

namespace App\Traits;
use ZipArchive;

trait UnzipFile
{

    /**
     * Download Resource
     * 
     * @param string $filename
     * @return \Illuminate\Http\Response
     */
    abstract public function extractZipFile(ZipArchive $file);
}
