<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'user'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['https://pentatechsolution.com'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
