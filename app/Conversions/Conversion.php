<?php

namespace App\Conversions;

use Spatie\ImageOptimizer\OptimizerChain;
use Spatie\ImageOptimizer\OptimizerChainFactory;
use Spatie\MediaLibrary\Conversions\Conversion as BaseConversion;
use Spatie\MediaLibrary\Conversions\Manipulations;

/**
 * Conversion that uses an empty OptimizerChain when image_optimizers config is empty,
 * so media conversions work on servers where proc_open is disabled (e.g. shared hosting).
 */
class Conversion extends BaseConversion
{
    public function __construct(string $name)
    {
        $optimizersConfig = config('media-library.image_optimizers', []);

        // When config is empty, OptimizerChainFactory::create([]) uses DEFAULT optimizers (proc_open).
        // Use an empty chain so no external binaries are run.
        $optimizerChain = ! empty($optimizersConfig)
            ? OptimizerChainFactory::create($optimizersConfig)
            : new OptimizerChain();

        $this->manipulations = new Manipulations;
        $this->manipulations->optimize($optimizerChain)->format('jpg');

        $this->fileNamer = app(config('media-library.file_namer'));

        $this->loadingAttributeValue = config('media-library.default_loading_attribute_value');

        $this->performOnQueue = config('media-library.queue_conversions_by_default', true);

        // Set name (parent uses constructor promotion; we don't call parent to avoid overwriting manipulations)
        $this->name = $name;
    }
}
