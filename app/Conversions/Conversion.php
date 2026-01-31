<?php

namespace App\Conversions;

use Spatie\ImageOptimizer\OptimizerChain;
use Spatie\MediaLibrary\Conversions\Conversion as BaseConversion;
use Spatie\MediaLibrary\Conversions\Manipulations;

/**
 * Conversion that always uses an empty OptimizerChain so no proc_open is ever used.
 * Use this on servers where proc_open is disabled (e.g. shared hosting).
 * Thumb/medium/xl conversions still run via PHP GD; only external optimizers are skipped.
 */
class Conversion extends BaseConversion
{
    public function __construct(string $name)
    {
        // Never call OptimizerChainFactory::create() - it uses proc_open when config is [] (defaults to full list).
        $this->manipulations = new Manipulations;
        $this->manipulations->optimize(new OptimizerChain())->format('jpg');

        $this->fileNamer = app(config('media-library.file_namer'));

        $this->loadingAttributeValue = config('media-library.default_loading_attribute_value');

        $this->performOnQueue = config('media-library.queue_conversions_by_default', true);

        $this->name = $name;
    }
}
